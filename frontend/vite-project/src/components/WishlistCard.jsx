import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../services/api';

const WishlistCard = ({ product, onRemove }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { _id, id, name, category, price, stock, imageUrl, image } = product;
  const productId = _id || id;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleViewDetails = () => {
    navigate(`/products/${productId}`);
  };

  const handleRemove = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await axiosInstance.delete(`/wishlist/${productId}`);
      if (onRemove) {
        onRemove(productId);
      }
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#DDD6CC] bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md font-sans-ui">
      {/* Product Image */}
      <div className="relative h-56 w-full overflow-hidden bg-[#F4EFEA]">
        <img
          src={imageUrl || image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Quick Remove Button (Top Right) */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={loading}
          aria-label="Remove from wishlist"
          title="Remove from wishlist"
          className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-2xs backdrop-blur-xs transition hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 border border-[#EAE4DC]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-[#BA5D38] stroke-[#BA5D38]"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {isOutOfStock && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-[#1E1B18] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Sold Out
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Category */}
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C8377]">
          {category}
        </span>

        {/* Product Name */}
        <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-[#231F1D]" title={name}>
          {name}
        </h3>

        {/* Price */}
        <div className="mt-2 text-lg font-bold text-[#231F1D]">
          ₹{price?.toLocaleString('en-IN')}
        </div>

        {/* Stock Status */}
        <p
          className={`mt-1 text-[11px] font-medium ${
            isOutOfStock
              ? 'text-rose-600'
              : isLowStock
              ? 'text-amber-700'
              : 'text-emerald-700'
          }`}
        >
          {isOutOfStock
            ? 'Out of Stock'
            : isLowStock
            ? `Only ${stock} units left`
            : `${stock} units left`}
        </p>

        {/* Card Action Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          {/* View Details Button */}
          <button
            type="button"
            onClick={handleViewDetails}
            className="w-full rounded-full bg-[#1E1B18] py-2.5 px-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#BA5D38] active:scale-[0.98]"
          >
            View Details
          </button>

          {/* Remove from Wishlist Button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={loading}
            className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[#DDD6CC] bg-white py-2 px-4 text-xs font-semibold text-[#4A443E] transition hover:bg-[#FAF7F2] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 fill-[#BA5D38] stroke-[#BA5D38]"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span>{loading ? 'Archiving...' : 'Remove'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
