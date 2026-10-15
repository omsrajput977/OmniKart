import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContent';
import { axiosInstance } from '../services/api';

const Orders = () => {
  const navigate = useNavigate();
  const { customer, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all orders for current authenticated user
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get('/orders');
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.message || 'Failed to load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans-ui text-[#231F1D]">
      <Navbar customer={customer} onLogout={handleLogout} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 border-b border-[#EAE4DC] pb-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8377] block">
              Purchase Archive
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#231F1D] mt-1">
              My Orders
            </h1>
            <p className="mt-1 text-xs text-[#78716C]">
              Review and inspect all past acquisitions and shipment updates.
            </p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex rounded-full border border-[#DDD6CC] bg-white px-5 py-2 text-xs font-semibold text-[#4A443E] hover:bg-[#FAF7F2] transition"
          >
            Explore Catalog
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl border border-[#EAE4DC] bg-white p-6 shadow-xs"
              >
                <div className="flex justify-between items-center pb-4 border-b border-[#EAE4DC]">
                  <div className="h-4 w-40 bg-[#EAE4DC] rounded" />
                  <div className="h-5 w-20 bg-[#EAE4DC] rounded-full" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-10 w-full bg-[#FAF7F2] rounded" />
                  <div className="h-10 w-3/4 bg-[#FAF7F2] rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 shadow-xs">
            <p className="text-xs font-semibold">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 rounded-full bg-[#1E1B18] px-6 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#BA5D38] transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[#EAE4DC] bg-white p-12 text-center shadow-xs">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF7F2] text-[#BA5D38] border border-[#EAE4DC]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#231F1D]">No orders recorded</h3>
            <p className="mt-1 text-xs text-[#78716C] max-w-sm">
              You haven't placed an order yet. Begin building your space with our curated objects.
            </p>
            <Link
              to="/products"
              className="mt-6 rounded-full bg-[#1E1B18] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-xs hover:bg-[#BA5D38] transition"
            >
              Discover Catalog
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-[#EAE4DC] bg-white shadow-xs transition hover:shadow-sm"
                >
                  {/* Card Header */}
                  <div className="bg-[#FAF7F2]/60 px-5 py-4 border-b border-[#EAE4DC] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-[#8C8377] font-bold block">
                        Order Ref #{order._id}
                      </span>
                      <span className="text-xs text-[#78716C] font-medium">{orderDate}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'PLACED'
                            ? 'bg-[#E8F2EC] text-[#2E6B47]'
                            : order.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-[#FAF7F2] text-[#78716C]'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="font-editorial text-lg font-bold text-[#231F1D]">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-5 divide-y divide-[#EAE4DC]">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 w-12 shrink-0 rounded-xl object-cover border border-[#EAE4DC] bg-[#FAF7F2]"
                            />
                          ) : (
                            <div className="h-12 w-12 shrink-0 rounded-xl bg-[#FAF7F2] border border-[#EAE4DC] flex items-center justify-center text-[#8C8377] text-[10px]">
                              Item
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#231F1D] truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-[#8C8377] font-medium">
                              Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-[#231F1D] whitespace-nowrap">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer: Delivery Details */}
                  {order.shippingAddress && (
                    <div className="bg-[#FAF7F2]/40 px-5 py-3 border-t border-[#EAE4DC] text-[11px] text-[#78716C] flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-[#231F1D]">Dispatch to: </span>
                        {order.shippingAddress.fullName}, {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </div>
                      <span className="font-medium text-[#8C8377]">
                        Status: <span className="text-[#2E6B47] font-semibold">{order.paymentStatus || 'PAID'}</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
