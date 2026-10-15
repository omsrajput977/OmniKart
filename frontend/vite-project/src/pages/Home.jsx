import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContent';
import { useDispatch } from 'react-redux';
import { addToCartApi } from '../redux/cartSlice';

const FOR_YOUR_SPACE_ITEMS = [
  {
    id: '6ac152146b3c029fc19a883c',
    name: 'AURA Ambient Smart Lamp',
    price: 3499,
    rating: 4.8,
    reviews: 124,
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    colors: ['#D7C6B4', '#8E6953', '#2B2724'],
  },
  {
    id: 'space-2',
    name: 'Natural Linen Cushion Cover',
    price: 1299,
    rating: 4.9,
    reviews: 86,
    category: 'Living',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80',
    colors: ['#EAE3D9', '#C2B8AB'],
  },
  {
    id: 'space-3',
    name: 'Minimalist Japandi Accent Armchair',
    price: 8499,
    rating: 4.9,
    reviews: 42,
    category: 'Living',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
    colors: ['#3A3632', '#C9BFAF', '#7B746B'],
  },
];

const PICK_UP_ITEMS = [
  {
    id: 'pick-1',
    name: 'Handcrafted Ceramic Vase',
    price: 1899,
    discount: '10% OFF for you',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'pick-2',
    name: 'Stoneware Pour-Over Carafe',
    price: 2199,
    discount: 'Member Special',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'pick-3',
    name: 'Sculptural Ceramic Bookends',
    price: 2499,
    discount: 'Trending',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'pick-4',
    name: 'Minimalist Leather Desk Pad',
    price: 1599,
    discount: '15% OFF for you',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
  },
];

function Home() {
  const { customer, setCustomer, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.fullName || customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
      });
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setCustomer({ ...customer, ...formData });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleQuickAdd = async (item) => {
    try {
      await dispatch(
        addToCartApi({
          _id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
        })
      ).unwrap();
    } catch {
      // Fallback
    }
  };

  const displayName = customer?.fullName || customer?.name || 'Customer';

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#231F1D] font-sans-ui flex flex-col">
      <Navbar customer={customer} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* 1. Welcome Member Banner (Matching Screen 03) */}
        <section className="rounded-3xl bg-[#F2ECE2] border border-[#E4DDD0] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#231F1D] tracking-tight">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-sm text-[#78716C]">
              Here's what we handpicked for you today based on your design taste.
            </p>
          </div>

          {/* Member Tier Status Badge (Matching Screen 03) */}
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-[#DDD6CC] rounded-2xl px-4 py-2.5 shadow-xs shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#BA5D38]/10 text-[#BA5D38] flex items-center justify-center text-sm font-bold">
              ★
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8377] block">
                Tier Status
              </span>
              <span className="text-xs font-bold text-[#231F1D]">
                Omni Circle: <span className="text-[#BA5D38]">Gold Member</span> • 1,240 pts
              </span>
            </div>
          </div>
        </section>

        {/* 2. "For Your Space" Section (Matching Screen 03) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#231F1D]">
                For Your Space
              </h2>
              <p className="text-xs text-[#8C8377]">
                Objects designed to elevate everyday rituals.
              </p>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-[#BA5D38] hover:underline"
            >
              See all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FOR_YOUR_SPACE_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#FAF7F2] mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-amber-600 text-xs mb-1">
                    <span>★</span>
                    <span className="font-bold text-[#231F1D]">{item.rating}</span>
                    <span className="text-[#8C8377]">({item.reviews} reviews)</span>
                  </div>

                  <h3 className="font-semibold text-base text-[#231F1D]">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg text-[#231F1D]">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#F0EAE1]">
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(item)}
                    className="w-full py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#322D28] text-white text-xs font-semibold transition active:scale-[0.99]"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. "Pick up where you left off" Section (Matching Screen 03) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#231F1D]">
                Pick up where you left off
              </h2>
              <p className="text-xs text-[#8C8377]">
                Items recently viewed and member-exclusive offers.
              </p>
            </div>
            <Link to="/products" className="text-xs font-semibold text-[#BA5D38] hover:underline">
              Browse More &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {PICK_UP_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl border border-[#EAE4DC] p-3.5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF7F2] mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {/* Discount badge */}
                    <span className="absolute top-2 left-2 bg-[#BA5D38] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                      {item.discount}
                    </span>
                    {/* Wishlist Heart */}
                    <button
                      type="button"
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs text-[#8C8377] hover:text-rose-600 transition"
                      aria-label="Wishlist"
                    >
                      ♥
                    </button>
                  </div>

                  <h3 className="font-semibold text-xs sm:text-sm text-[#231F1D] line-clamp-1">
                    {item.name}
                  </h3>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-sm sm:text-base text-[#231F1D]">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <Link
                    to="/products"
                    className="text-[11px] font-semibold text-[#BA5D38] hover:underline"
                  >
                    View &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Customer Profile & Account Details Section */}
        <section className="bg-white rounded-3xl border border-[#EAE4DC] p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-4 mb-6">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#231F1D]">Customer Profile</h2>
              <p className="text-xs text-[#78716C]">Your personal contact and account details</p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  name: customer?.fullName || customer?.name || '',
                  email: customer?.email || '',
                  phone: customer?.phone || '',
                });
                setIsEditing(!isEditing);
              }}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-[#DDD6CC] hover:border-[#1E1B18] text-[#231F1D] transition"
            >
              {isEditing ? 'Cancel' : 'Edit Details'}
            </button>
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DC]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8377]">
                  Full Name
                </span>
                <p className="text-base font-semibold text-[#231F1D] mt-1">
                  {displayName}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DC] overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8377]">
                  Email Address
                </span>
                <p className="text-base font-semibold text-[#231F1D] mt-1 truncate">
                  {customer?.email || 'N/A'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DC]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8377]">
                  Phone Number
                </span>
                <p className="text-base font-semibold text-[#231F1D] mt-1">
                  {customer?.phone || 'N/A'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-[#DDD6CC] rounded-xl text-sm focus:outline-none focus:border-[#BA5D38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-[#DDD6CC] rounded-xl text-sm focus:outline-none focus:border-[#BA5D38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443E] mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-[#DDD6CC] rounded-xl text-sm focus:outline-none focus:border-[#BA5D38]"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#665D52] hover:text-[#231F1D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-[#1E1B18] text-white rounded-full hover:bg-[#322D28] transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </section>

      </main>
    </div>
  );
}

export default Home;