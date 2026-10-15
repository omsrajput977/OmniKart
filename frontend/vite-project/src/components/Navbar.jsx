import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../redux/cartSlice.js';
import { useAuth } from '../context/AuthContent';

function Navbar({ customer, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { cartItems } = useSelector((state) => state.cart);

  // Automatically fetch cart items on initial page mount across all pages
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      await logout();
      navigate('/', { replace: true });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const displayName = customer?.fullName || customer?.name || 'Customer';

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE4DC] font-sans-ui text-[#231F1D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Left: Brand Logo in Luxury Tracked Typography */}
          <div className="flex items-center gap-8 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#231F1D] group-hover:opacity-85 transition">
                OMNIKART
              </span>
            </Link>

            {/* Desktop Navigation Links (Matching Mockups) */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#635B51]">
              <Link to="/products" className="hover:text-[#BA5D38] transition">
                Shop
              </Link>
              <Link to="/wishlist" className="hover:text-[#BA5D38] transition">
                Wishlist
              </Link>
              <Link to="/orders" className="hover:text-[#BA5D38] transition">
                Orders
              </Link>
            </nav>
          </div>

          {/* Center Search Pill */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-xs items-center relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search curated pieces..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F4EFEA] hover:bg-[#EDE6DD] focus:bg-white text-[#231F1D] placeholder-[#8E867E] border border-transparent rounded-full focus:border-[#BA5D38]/50 focus:ring-1 focus:ring-[#BA5D38]/30 transition outline-none"
            />
            <svg
              className="w-4 h-4 text-[#8E867E] absolute left-3 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>

          {/* Right Actions: Wishlist, Cart, Profile, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 text-[#4A443E] hover:text-[#BA5D38] hover:bg-[#F2ECE2] rounded-full transition"
              title="View Wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            {/* Cart Icon with Terracotta Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-[#4A443E] hover:text-[#BA5D38] hover:bg-[#F2ECE2] rounded-full transition"
              title="View Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#BA5D38] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Pill */}
            {customer && (
              <div className="flex items-center gap-2 border-l border-[#EAE4DC] pl-3">
                <Link
                  to="/home"
                  className="h-8 w-8 rounded-full bg-[#EAE3D9] text-[#231F1D] font-bold flex items-center justify-center text-xs border border-[#DDD5C9] shadow-2xs hover:scale-105 transition"
                  title="My Profile"
                >
                  {displayName.charAt(0).toUpperCase()}
                </Link>
                <div className="hidden sm:block text-left">
                  <Link to="/home" className="text-xs font-semibold text-[#231F1D] hover:text-[#BA5D38] block leading-tight">
                    {displayName}
                  </Link>
                  <p className="text-[10px] text-[#8C8377] font-medium">Gold Member</p>
                </div>
              </div>
            )}

            {/* Desktop Logout Button */}
            {customer && (
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#78716C] hover:text-rose-600 bg-white hover:bg-rose-50 border border-[#DDD6CC] hover:border-rose-200 rounded-full transition duration-150"
                title="Sign Out"
              >
                <span>Logout</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#4A443E] hover:text-[#231F1D] rounded-lg hover:bg-[#F2ECE2] focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EAE4DC] py-4 space-y-2 bg-[#FAF7F2]">
            <Link to="/" className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#231F1D] hover:bg-[#F2ECE2]">
              Landing
            </Link>
            <Link to="/products" className="block px-3 py-2 rounded-lg text-sm font-medium text-[#4A443E] hover:bg-[#F2ECE2]">
              Shop Catalog
            </Link>
            <Link to="/wishlist" className="block px-3 py-2 rounded-lg text-sm font-medium text-[#4A443E] hover:bg-[#F2ECE2]">
              Wishlist
            </Link>
            <Link to="/orders" className="block px-3 py-2 rounded-lg text-sm font-medium text-[#4A443E] hover:bg-[#F2ECE2]">
              My Orders
            </Link>
            <Link to="/cart" className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#BA5D38] bg-[#BA5D38]/10">
              Cart ({cartCount})
            </Link>

            {/* Mobile Logout Button */}
            {customer && (
              <div className="pt-2 border-t border-[#EAE4DC] mt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;