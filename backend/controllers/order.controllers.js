import crypto from "crypto";
import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import razorpayInstance from "../utils/razorpay.js";

// Validation helper for shipping address
const validateShippingAddress = (shippingAddress) => {
  if (!shippingAddress || typeof shippingAddress !== "object") {
    return "Shipping address is required";
  }

  const { fullName, phone, addressLine1, city, state, pincode } = shippingAddress;

  if (!fullName || !fullName.trim()) return "Full Name is required";
  if (!phone || !phone.trim()) return "Phone number is required";

  const cleanPhone = phone.trim().replace(/[\s-]/g, "");
  if (!/^\+?[0-9]{10,12}$/.test(cleanPhone)) {
    return "Please enter a valid phone number";
  }

  if (!addressLine1 || !addressLine1.trim()) return "Address Line is required";
  if (!city || !city.trim()) return "City is required";
  if (!state || !state.trim()) return "State is required";

  if (!pincode || !pincode.trim()) return "Pincode is required";
  if (!/^\d{6}$/.test(pincode.trim())) {
    return "Pincode must contain 6 digits";
  }

  return null;
};

/**
 * Task 4: Create Order API
 * POST /orders/create-payment-order
 * Flow:
 * 1. Validate shipping address
 * 2. Authenticate user & load user cart
 * 3. Verify products exist and verify stock
 * 4. Build historical order snapshot & calculate server-side total
 * 5. Create pending OmniKart order in MongoDB
 * 6. Create Razorpay order in paise
 * 7. Save razorpayOrderId to the order
 * 8. Return checkout payload
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // 1. Validate shipping address
    const validationError = validateShippingAddress(shippingAddress);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const customerId = req.customer._id;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // 2. Verify Cart is not empty
    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty. Please add items before checking out.",
      });
    }

    // 3. Verify each product exists, verify stock, and build snapshot
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of customer.cart) {
      const product = await Product.findById(cartItem.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "One or more products in your cart are no longer available.",
        });
      }

      // Stock verification: reject if requested qty exceeds stock
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}.`,
        });
      }

      const itemPrice = Number(product.price);
      const itemTotal = itemPrice * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: cartItem.quantity,
        image: product.image || product.imageUrl || "",
      });
    }

    // 4. Create Pending OmniKart Order in MongoDB
    const order = await Order.create({
      user: customerId,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        addressLine1: shippingAddress.addressLine1.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
      },
      totalAmount,
      status: "PENDING",
      paymentStatus: "PENDING",
    });

    // 5. Create Razorpay Order in Paise (amount * 100)
    let razorpayOrder;
    try {
      razorpayOrder = await razorpayInstance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `order_${order._id.toString()}`,
      });
    } catch (razorError) {
      order.status = "FAILED";
      order.paymentStatus = "FAILED";
      await order.save();

      return res.status(502).json({
        success: false,
        message: "Failed to initiate Razorpay order. Please verify Razorpay keys.",
        error: razorError?.error?.description || razorError.message,
      });
    }

    // 6. Save razorpayOrderId to the Order document
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    // 7. Return Checkout Data to Frontend
    res.status(201).json({
      success: true,
      message: "Payment order created successfully",
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
      },
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("createPaymentOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * Task 5: Verify Payment & Clear Cart
 * POST /orders/verify-payment
 * Flow:
 * 1. Extract razorpay_order_id, razorpay_payment_id, razorpay_signature
 * 2. Compute HMAC SHA256 signature using RAZORPAY_KEY_SECRET
 * 3. Verify signature matches:
 *    - If invalid: return 400 Bad Request (cart remains untouched)
 *    - If valid: update order status to "PLACED", paymentStatus to "PAID"
 * 4. Decrement product stock in DB
 * 5. Clear user cart: customer.cart = []; await customer.save()
 * 6. Return confirmed order
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification parameters",
      });
    }

    // 1. Verify HMAC SHA256 Signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Payment verification failed.",
      });
    }

    // 2. Find matching Order belonging to authenticated user
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.customer._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }

    // If already verified and paid, return order directly
    if (order.paymentStatus === "PAID") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    // 3. Update Order status to PLACED and paymentStatus to PAID
    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    // 4. Decrement product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 5. Clear User Cart in MongoDB
    const customer = await Customer.findById(req.customer._id);
    if (customer) {
      customer.cart = [];
      await customer.save();
    }

    // 6. Return Confirmed Order
    res.status(200).json({
      success: true,
      message: "Payment verified successfully. Order placed.",
      order,
    });
  } catch (error) {
    console.error("verifyPayment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * Task 7: My Orders API
 * GET /orders
 * Return all orders belonging to authenticated user sorted newest first.
 */
export const getMyOrders = async (req, res) => {
  try {
    const customerId = req.customer._id;

    const orders = await Order.find({ user: customerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getMyOrders error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * Single Order API
 * GET /orders/:id
 * Retrieve a single order by ID, enforcing strict ownership verification.
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Strict Ownership Check: Prevents ID guessing / unauthorized access
    if (order.user.toString() !== req.customer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to view this order.",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("getOrderById error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


