import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../services/api';

import { useDispatch, useSelector } from 'react-redux';
import { addToCartApi } from '../redux/cartSlice.js';


const ProductCard = ({ product, onToggleWishlist, initialWishlisted = false, initialInCart = false }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { _id, id, name, category, price, stock, imageUrl, image } = product;

  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Cart UI States according to specification
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(initialInCart);

  // Keep local state in sync when initialWishlisted updates asynchronously
  useEffect(() => {
    setIsWishlisted(initialWishlisted);
  }, [initialWishlisted]);

  const productId = _id || id;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleViewDetails = () => {
    navigate(`/products/${productId}`);
  };

  // Add to Cart handler connected to Database via Redux async thunk
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isOutOfStock || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await dispatch(addToCartApi(product)).unwrap();
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (loadingWishlist) return;

    const previousState = isWishlisted;
    const nextState = !previousState;

    setIsWishlisted(nextState);
    setLoadingWishlist(true);

    try {
      if (nextState) {
        await axiosInstance.post(`/wishlist/${productId}`);
      } else {
        await axiosInstance.delete(`/wishlist/${productId}`);
      }

      if (onToggleWishlist) {
        onToggleWishlist(productId, nextState);
      }
    } catch (error) {
      setIsWishlisted(previousState);

      if (error?.response?.status === 401) {
        navigate('/login', { state: { from: window.location.pathname } });
        return;
      }

      console.error('Wishlist toggle failed:', error?.response?.data || error.message);
    } finally {
      setLoadingWishlist(false);
    }
  };

  // Determine button text according to specification
  const getCartButtonText = () => {
    if (isOutOfStock) return 'Sold Out';
    if (isAddingToCart) return 'Adding...';
    if (itemInCart) return 'Add Another'; // 🟢 Reads real-time Redux state!
    return 'Add to Cart';
  };



  const { cartItems } = useSelector((state) => state.cart);
  const itemInCart = cartItems.some(item => (item._id || item.id) === productId);


  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#EAE4DC] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#D5CCC0] font-sans-ui">
      {/* Product Image */}
      <div className="relative h-52 w-full overflow-hidden bg-[#FAF7F2]">
        <img
          src={imageUrl || image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Top-Right Wishlist Floating Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={loadingWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-2xs backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`h-4 w-4 transition-colors ${isWishlisted
              ? 'fill-rose-500 stroke-rose-500'
              : 'fill-transparent stroke-gray-500 hover:stroke-rose-500'
              }`}
            strokeWidth="1.8"
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

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C8377]">
          {category}
        </span>

        <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-[#231F1D]" title={name}>
          {name}
        </h3>

        <div className="mt-2 text-lg font-bold text-[#231F1D]">
          ₹{price?.toLocaleString('en-IN')}
        </div>

        <p
          className={`mt-1 text-[11px] font-medium ${isOutOfStock
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

        {/* Action Buttons Section */}
        <div className="mt-4 flex flex-col gap-2">
          {/* Primary Action: Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold transition-all duration-150 shadow-2xs ${isOutOfStock
              ? 'bg-[#EAE4DC] text-[#8C8377] cursor-not-allowed'
              : isAddingToCart
                ? 'bg-[#BA5D38]/80 text-white cursor-wait'
                : itemInCart
                  ? 'bg-[#BA5D38] hover:bg-[#A34F2E] active:scale-[0.99] text-white'
                  : 'bg-[#1E1B18] hover:bg-[#322D28] active:scale-[0.99] text-white'
              }`}
          >
            {isAddingToCart && (
              <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{getCartButtonText()}</span>
          </button>

          {/* Secondary Action: View Details Button */}
          <button
            type="button"
            onClick={handleViewDetails}
            className="w-full rounded-xl border border-[#DDD6CC] bg-white py-2 px-4 text-xs font-semibold text-[#4A443E] transition hover:bg-[#FAF7F2] hover:text-[#231F1D]"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;