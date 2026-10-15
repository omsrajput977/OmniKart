import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContent';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../redux/cartSlice';
import { axiosInstance } from '../services/api';

// Helper to dynamically load the Razorpay checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customer, logout } = useAuth();
  const { cartItems } = useSelector((state) => state.cart);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Pre-fill from customer profile if available
  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || customer.fullName || customer.name || '',
        phone: prev.phone || customer.phone || '',
      }));
    }
  }, [customer]);

  // Validation Errors State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-level error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Task 3: Shipping Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    const cleanPhone = formData.phone.trim().replace(/[\s-]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,12}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address line is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Pincode must contain 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculations
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Handle Place Order & Razorpay Flow
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setServerError('');

    // 1. Client-side validation check
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Ensure Razorpay script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setServerError('Razorpay SDK failed to load. Please check your internet connection.');
        setIsSubmitting(false);
        return;
      }

      // 3. Call backend to create OmniKart Order & Razorpay Order
      const { data } = await axiosInstance.post('/orders/create-payment-order', {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          addressLine1: formData.addressLine1.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
      });

      // 4. Configure Razorpay Checkout Modal
      const options = {
        key: data.key,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: 'OmniKart',
        description: 'Complete your purchase (Test Mode)',
        order_id: data.razorpayOrder.id,
        prefill: {
          name: formData.fullName.trim(),
          contact: formData.phone.trim(),
          email: customer?.email || '',
        },
        theme: {
          color: '#BA5D38',
        },
        // Callback when payment succeeds in Razorpay modal
        handler: async function (response) {
          try {
            // 5. Verify payment signature on backend & clear cart
            const verifyRes = await axiosInstance.post('/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Refresh global cart state (clears cart count in Navbar)
            dispatch(fetchCart());

            // Navigate to Order Success page with order details
            navigate(`/order-success/${verifyRes.data.order._id}`, {
              state: { order: verifyRes.data.order },
              replace: true,
            });
          } catch (verifyError) {
            console.error('Payment verification failed:', verifyError);
            setServerError(
              verifyError.response?.data?.message || 'Payment verification failed on server.'
            );
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        setServerError(response.error.description || 'Payment failed. Please try again.');
        setIsSubmitting(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error('Create order error:', error);
      const message =
        error.response?.data?.message || 'Failed to initiate order. Please try again.';
      setServerError(message);
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // If cart is empty, show helpful redirect
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans-ui text-[#231F1D]">
        <Navbar customer={customer} onLogout={handleLogout} />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 text-center">
          <div className="rounded-3xl border border-[#EAE4DC] bg-white p-12 shadow-xs">
            <h2 className="font-editorial text-2xl font-bold text-[#231F1D]">Your Cart is Empty</h2>
            <p className="mt-2 text-xs text-[#78716C]">
              You need at least one item in your cart before checking out.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-full bg-[#1E1B18] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-xs hover:bg-[#BA5D38] transition"
            >
              Browse Objects
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans-ui text-[#231F1D]">
      <Navbar customer={customer} onLogout={handleLogout} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center text-xs font-semibold text-[#8C8377] hover:text-[#BA5D38] transition"
          >
            ← Back to Cart
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8 border-b border-[#EAE4DC] pb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8377] block">
            Complete Purchase
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#231F1D] mt-1">
            Checkout
          </h1>
          <p className="mt-1 text-xs text-[#78716C]">
            Provide your delivery details to finalize your curated order.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 flex items-start justify-between">
            <span>{serverError}</span>
            <button
              onClick={() => setServerError('')}
              className="font-bold text-rose-800 hover:text-rose-900 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Grid: Shipping Form + Order Summary */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Shipping Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#EAE4DC] bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="font-editorial text-xl font-bold text-[#231F1D] border-b border-[#EAE4DC] pb-3">
                Shipping Destination
              </h2>

              <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4" noValidate>
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#4A443E] mb-1.5">
                    Full Name <span className="text-[#BA5D38]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Aarav Sharma"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-[#231F1D] outline-none transition ${
                      errors.fullName
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-[#DDD6CC] bg-[#FAF7F2]/40 focus:border-[#BA5D38] focus:bg-white focus:ring-1 focus:ring-[#BA5D38]'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#4A443E] mb-1.5">
                    Phone Number <span className="text-[#BA5D38]">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-[#231F1D] outline-none transition ${
                      errors.phone
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-[#DDD6CC] bg-[#FAF7F2]/40 focus:border-[#BA5D38] focus:bg-white focus:ring-1 focus:ring-[#BA5D38]'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.phone}</p>
                  )}
                </div>

                {/* Address Line */}
                <div>
                  <label htmlFor="addressLine1" className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#4A443E] mb-1.5">
                    Street Address <span className="text-[#BA5D38]">*</span>
                  </label>
                  <input
                    id="addressLine1"
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Sunshine Apartments, MG Road"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-[#231F1D] outline-none transition ${
                      errors.addressLine1
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-[#DDD6CC] bg-[#FAF7F2]/40 focus:border-[#BA5D38] focus:bg-white focus:ring-1 focus:ring-[#BA5D38]'
                    }`}
                  />
                  {errors.addressLine1 && (
                    <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.addressLine1}</p>
                  )}
                </div>

                {/* City & State (Two column row) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#4A443E] mb-1.5">
                      City <span className="text-[#BA5D38]">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Bengaluru"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-[#231F1D] outline-none transition ${
                        errors.city
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                          : 'border-[#DDD6CC] bg-[#FAF7F2]/40 focus:border-[#BA5D38] focus:bg-white focus:ring-1 focus:ring-[#BA5D38]'
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#4A443E] mb-1.5">
                      State <span className="text-[#BA5D38]">*</span>
                    </label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Karnataka"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-[#231F1D] outline-none transition ${
                        errors.state
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                          : 'border-[#DDD6CC] bg-[#FAF7F2]/40 focus:border-[#BA5D38] focus:bg-white focus:ring-1 focus:ring-[#BA5D38]'
                      }`}
                    />
                    {errors.state && (
                      <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.state}</p>
                    )}
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label htmlFor="pincode" className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#4A443E] mb-1.5">
                    Postal / PIN Code <span className="text-[#BA5D38]">*</span>
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    maxLength={6}
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 560001"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-[#231F1D] outline-none transition ${
                      errors.pincode
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-[#DDD6CC] bg-[#FAF7F2]/40 focus:border-[#BA5D38] focus:bg-white focus:ring-1 focus:ring-[#BA5D38]'
                    }`}
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.pincode}</p>
                  )}
                </div>

                <div className="pt-2 text-[11px] text-[#8C8377]">
                  * All fields required for courier dispatch & invoice generation.
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#EAE4DC] bg-white p-6 shadow-xs sticky top-24">
              <h2 className="font-editorial text-xl font-bold text-[#231F1D] border-b border-[#EAE4DC] pb-3">
                Order Summary
              </h2>

              {/* Items Snapshot List */}
              <div className="mt-4 divide-y divide-[#EAE4DC] max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const itemPrice = item.price * item.quantity;
                  return (
                    <div key={item._id || item.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 rounded-xl bg-[#FAF7F2] overflow-hidden border border-[#EAE4DC]">
                          <img
                            src={item.image || item.imageUrl || 'https://via.placeholder.com/100?text=Item'}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#231F1D] line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-[#8C8377]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#231F1D] whitespace-nowrap">
                        ₹{itemPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation */}
              <div className="mt-4 border-t border-[#EAE4DC] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#78716C]">
                  <span>Total Units</span>
                  <span className="font-semibold text-[#231F1D]">{totalUnits}</span>
                </div>
                <div className="flex justify-between text-[#78716C]">
                  <span>Courier Delivery</span>
                  <span className="font-semibold text-[#2E6B47] uppercase tracking-wider text-[11px]">Complimentary</span>
                </div>
                <div className="border-t border-[#EAE4DC] pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-[#231F1D] text-sm">Estimated Total</span>
                  <span className="font-editorial text-2xl font-bold text-[#231F1D]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-[#1E1B18] py-3.5 px-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-white shadow-sm transition-all duration-150 hover:bg-[#BA5D38] active:scale-[0.98] disabled:cursor-wait disabled:bg-[#8C8377] focus:outline-none"
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                <span>{isSubmitting ? 'Securing Order...' : 'Pay with Razorpay'}</span>
              </button>

              {/* Razorpay Test Mode Badge */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#8C8377]">
                <svg className="w-3.5 h-3.5 text-[#2E6B47]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Razorpay Test Sandbox • End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
