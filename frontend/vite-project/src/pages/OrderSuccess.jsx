import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContent';
import { axiosInstance } from '../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, logout } = useAuth();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState('');

  // If order wasn't passed in router state, fetch it from backend
  useEffect(() => {
    if (!order && id) {
      axiosInstance
        .get(`/orders/${id}`)
        .then((res) => {
          setOrder(res.data.order);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to load order details');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, order]);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans-ui text-[#231F1D]">
      <Navbar customer={customer} onLogout={handleLogout} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 flex items-center justify-center">
        {loading ? (
          <div className="text-center py-12 animate-pulse">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#EAE4DC]" />
            <div className="mt-4 h-6 w-48 rounded bg-[#EAE4DC] mx-auto" />
            <div className="mt-2 h-4 w-32 rounded bg-[#EAE4DC] mx-auto" />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-white p-8 sm:p-10 text-center shadow-xs w-full">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-[#BA5D38] mb-4 text-2xl font-bold">
              ✕
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[#231F1D]">Order Notice</h2>
            <p className="mt-2 text-xs text-[#78716C]">{error}</p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                to="/orders"
                className="rounded-full bg-[#1E1B18] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#BA5D38] transition"
              >
                View Orders
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-[#EAE4DC] bg-white p-8 sm:p-12 text-center shadow-xs w-full">
            {/* Elegant Success Badge */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EFEA] text-[#2E6B47] border border-[#EAE4DC] mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#BA5D38] block mb-1">
              Payment Confirmed
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#231F1D] tracking-tight">
              Order Confirmed
            </h1>
            <p className="mt-2 text-xs text-[#78716C] max-w-md mx-auto">
              Your acquisition has been recorded. Our studio team is preparing your package for courier dispatch.
            </p>

            {/* Order Summary Receipt Box */}
            <div className="mt-8 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DC] p-5 sm:p-6 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-[#EAE4DC] pb-2.5">
                <span className="text-[#8C8377] font-semibold uppercase tracking-wider text-[10px]">Reference Number</span>
                <span className="font-mono font-bold text-[#231F1D] text-xs">
                  {order?._id}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[#EAE4DC] pb-2.5">
                <span className="text-[#8C8377] font-semibold uppercase tracking-wider text-[10px]">Total Paid</span>
                <span className="font-editorial font-bold text-[#231F1D] text-lg">
                  ₹{order?.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[#EAE4DC] pb-2.5">
                <span className="text-[#8C8377] font-semibold uppercase tracking-wider text-[10px]">Order Fulfillment</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E8F2EC] text-[#2E6B47]">
                  {order?.status || 'PLACED'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-0.5">
                <span className="text-[#8C8377] font-semibold uppercase tracking-wider text-[10px]">Payment Verification</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E8F2EC] text-[#2E6B47]">
                  {order?.paymentStatus || 'PAID'} (Razorpay)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/orders"
                className="w-full sm:w-auto rounded-full bg-[#1E1B18] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-xs hover:bg-[#BA5D38] active:scale-95 transition"
              >
                Track Your Orders
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto rounded-full border border-[#DDD6CC] bg-white px-8 py-3 text-xs font-semibold text-[#4A443E] hover:bg-[#FAF7F2] active:scale-95 transition"
              >
                Continue Exploring
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderSuccess;
