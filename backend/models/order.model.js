import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String
    }
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "Order must contain at least one item."
      }
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["PENDING", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING"
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING"
    },

    razorpayOrderId: {
      type: String
    },

    razorpayPaymentId: {
      type: String
    },

    razorpaySignature: {
      type: String
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
