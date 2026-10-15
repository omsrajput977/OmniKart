import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../services/api';
import WishlistCard from '../components/WishlistCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContent';

const Wishlist = () => {
  const navigate = useNavigate();
  const { customer, logout } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);

        // withCredentials sends the cookie automatically
        const response = await axiosInstance.get('/wishlist');
        const resData = response.data;

        // Unpack whatever format your backend returns
        let rawList = [];
        if (Array.isArray(resData)) {
          rawList = resData;
        } else if (Array.isArray(resData?.wishlist)) {
          rawList = resData.wishlist;
        } else if (Array.isArray(resData?.items)) {
          rawList = resData.items;
        } else if (Array.isArray(resData?.products)) {
          rawList = resData.products;
        } else if (Array.isArray(resData?.data)) {
          rawList = resData.data;
        } else if (resData?.data && Array.isArray(resData.data.wishlist)) {
          rawList = resData.data.wishlist;
        }

        // Normalize populated product objects vs plain documents
        const normalized = rawList
          .map((item) => {
            if (!item) return null;
            if (item.product && typeof item.product === 'object') {
              return item.product;
            }
            if (typeof item === 'object') {
              return item;
            }
            return null;
          })
          .filter(Boolean);

        if (isMounted) {
          setWishlistItems(normalized);
        }
      } catch (err) {
        console.error('Fetch wishlist error:', err);

        // If the cookie is expired or missing, redirect to login
        if (err?.response?.status === 401) {
          navigate('/login', { state: { from: '/wishlist' } });
          return;
        }

        if (isMounted) {
          setError(
            err.response?.data?.message ||
            err.message ||
            'Failed to load wishlist.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWishlist();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleRemoveFromWishlist = (productId) => {
    setWishlistItems((prev) =>
      prev.filter((item) => (item._id || item.id) !== productId)
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans-ui text-[#231F1D]">
      {/* Header / Navbar */}
      <Navbar customer={customer} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-[#EAE4DC] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8377] block">
              Curated Registry
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#231F1D] mt-1">
              Saved Pieces
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#8C8377]">
            {wishlistItems.length}{' '}
            {wishlistItems.length === 1 ? 'object saved' : 'objects saved'}
          </p>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E1B18] border-t-transparent" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlistItems.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[#EAE4DC] bg-white p-12 text-center shadow-xs">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF7F2] text-[#BA5D38] border border-[#EAE4DC]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#231F1D]">Your saved collection is empty</h3>
            <p className="mt-1 text-xs text-[#78716C] max-w-sm">
              Discover timeless furniture, objects, and tactile pieces to archive for your interior.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="mt-6 rounded-full bg-[#1E1B18] px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-xs transition hover:bg-[#BA5D38]"
            >
              Explore Objects
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product) => {
              const productId = product._id || product.id;
              return (
                <WishlistCard
                  key={productId}
                  product={product}
                  onRemove={handleRemoveFromWishlist}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;