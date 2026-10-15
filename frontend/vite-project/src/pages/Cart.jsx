import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContent';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateQuantityApi, removeFromCartApi } from '../redux/cartSlice.js';

const Cart = () => {
  const navigate = useNavigate();
  const { customer, logout } = useAuth();

  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cart);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Increase Quantity (+)
  const handleIncrease = (item) => {
    const itemId = item._id || item.id;
    dispatch(updateQuantityApi({ id: itemId, quantity: item.quantity + 1 }));
  };

  // Decrease Quantity (-)
  const handleDecrease = (item) => {
    const itemId = item._id || item.id;
    if (item.quantity > 1) {
      dispatch(updateQuantityApi({ id: itemId, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeFromCartApi(itemId));
    }
  };

  // Remove Item
  const handleRemove = (item) => {
    const itemId = item._id || item.id;
    dispatch(removeFromCartApi(itemId));
  };

  
  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans-ui text-[#231F1D]">
      {/* Shared Navbar displaying Cart count */}
      <Navbar customer={customer} cartCount={totalItemsCount} onLogout={handleLogout} />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 border-b border-[#EAE4DC] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8377] block">
              Shopping Bag
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#231F1D] tracking-tight mt-1">
              Your Cart ({totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'})
            </h1>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#BA5D38] hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[#EAE4DC] bg-white p-12 text-center shadow-xs">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF7F2] text-[#8C8377] border border-[#EAE4DC]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#231F1D]">Your cart is empty</h3>
            <p className="mt-1 text-xs text-[#78716C]">
              Explore our curated collections to discover objects for your space.
            </p>
            <Link
              to="/products"
              className="mt-6 rounded-full bg-[#1E1B18] hover:bg-[#322D28] px-7 py-3 text-xs font-semibold text-white shadow-xs transition active:scale-95"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          /* Cart Content Layout: Items List + Order Summary */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">

            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free Shipping Progress Indicator (Matching Screen 04) */}
              <div className="rounded-2xl border border-[#EAE4DC] bg-[#F4EFEA] p-4 text-xs">
                <div className="flex justify-between font-semibold text-[#4A443E] mb-1.5">
                  <span>Carbon-Neutral Delivery</span>
                  <span>{subtotalPrice >= 2999 ? '✓ Qualified for Free Shipping' : `Add ₹${Math.max(0, 2999 - subtotalPrice).toLocaleString('en-IN')} for Free Delivery`}</span>
                </div>
                <div className="w-full bg-[#DDD6CC] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#BA5D38] h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotalPrice / 2999) * 100)}%` }}
                  />
                </div>
              </div>

              {cartItems.map((item) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div
                    key={item.id || item._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#EAE4DC] bg-white p-4 sm:p-5 shadow-xs transition hover:border-[#D5CCC0]"
                  >
                    {/* Image & Product Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F2] border border-[#EAE4DC]">
                        <img
                          src={item.image || item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#231F1D]">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs font-bold text-[#696157]">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls, Total Price & Remove Action */}
                    <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-[#F0EAE1] pt-3 sm:pt-0">
                      {/* [-] Qty [+] Controls */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center rounded-xl border border-[#DDD6CC] bg-white">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item)}
                            className="px-3 py-1 text-[#4A443E] hover:text-[#BA5D38] font-bold hover:bg-[#FAF7F2] rounded-l-xl transition"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-bold text-[#231F1D] border-x border-[#DDD6CC]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrease(item)}
                            className="px-3 py-1 text-[#4A443E] hover:text-[#BA5D38] font-bold hover:bg-[#FAF7F2] rounded-r-xl transition"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Action Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:underline transition"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Calculated Item Subtotal */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-[10px] text-[#8C8377] block uppercase font-bold tracking-wider">Subtotal</span>
                        <span className="text-base font-bold text-[#231F1D]">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-[#EAE4DC] bg-white p-6 shadow-xs sticky top-24">
                <h2 className="font-editorial text-2xl font-bold text-[#231F1D] border-b border-[#F0EAE1] pb-3">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex justify-between text-[#696157]">
                    <span>Items Count</span>
                    <span className="font-semibold text-[#231F1D]">{cartItems.length}</span>
                  </div>

                  <div className="flex justify-between text-[#696157]">
                    <span>Total Units</span>
                    <span className="font-semibold text-[#231F1D]">{totalItemsCount}</span>
                  </div>

                  <div className="flex justify-between text-[#696157]">
                    <span>Carbon-Neutral Shipping</span>
                    <span className="font-semibold text-emerald-700">
                      {subtotalPrice >= 2999 ? 'FREE' : '₹149'}
                    </span>
                  </div>

                  <div className="border-t border-[#EAE4DC] pt-3 flex justify-between items-center text-sm font-bold text-[#231F1D]">
                    <span>Estimated Total</span>
                    <span className="font-editorial text-2xl font-bold text-[#BA5D38]">
                      ₹{(subtotalPrice + (subtotalPrice >= 2999 ? 0 : 149)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Proceed to Checkout Primary Action Button (Matching Screen 04 Terracotta Button) */}
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="mt-6 w-full rounded-xl bg-[#BA5D38] hover:bg-[#A34F2E] py-3.5 px-4 text-center text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all active:scale-[0.99]"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
