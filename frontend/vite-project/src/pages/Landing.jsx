import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContent';

const CATEGORIES = [
  {
    name: 'Living',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&auto=format&fit=crop&q=80',
    count: '34 pieces',
  },
  {
    name: 'Tech',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80',
    count: '18 pieces',
  },
  {
    name: 'Lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&auto=format&fit=crop&q=80',
    count: '22 pieces',
  },
  {
    name: 'Wellness',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=700&auto=format&fit=crop&q=80',
    count: '15 pieces',
  },
];

const CURATED_HIGHLIGHTS = [
  {
    id: 1,
    name: 'AURA Ambient Smart Lamp',
    price: 3499,
    rating: 4.8,
    reviews: 124,
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    colors: ['#D7C6B4', '#8E6953', '#2B2724'],
  },
  {
    id: 2,
    name: 'Natural Linen Cushion Cover',
    price: 1299,
    rating: 4.9,
    reviews: 86,
    category: 'Living',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80',
    colors: ['#EAE3D9', '#C2B8AB', '#7B746B'],
  },
  {
    id: 3,
    name: 'Stoneware Pour-Over Carafe',
    price: 2199,
    rating: 4.7,
    reviews: 52,
    category: 'Dining',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    colors: ['#3A3632', '#C9BFAF'],
  },
  {
    id: 4,
    name: 'Tactile Noise-Canceling Headphones',
    price: 7999,
    rating: 4.9,
    reviews: 198,
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    colors: ['#1F1D1B', '#D9D0C5'],
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#231F1D] flex flex-col font-sans-ui selection:bg-[#BA5D38]/20 selection:text-[#BA5D38]">
      {/* 1. Subtle Announcement Bar */}
      <div className="bg-[#F2ECE2] text-[#635B51] text-xs py-2 px-4 text-center tracking-wide border-b border-[#EAE4DC]">
        <span>Complimentary carbon-neutral delivery on all orders over ₹2,999 • 30-Day In-Home Trial</span>
      </div>

      {/* 2. Editorial Minimalist Header (Matching Screen 01) */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Left: Brand Name in Luxury Tracked Serif */}
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex items-center gap-2">
              <span className="font-editorial text-3xl sm:text-4xl font-bold tracking-[0.2em] text-[#231F1D] group-hover:opacity-80 transition">
                OMNIKART
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A443E]">
              <Link to="/products" className="hover:text-[#BA5D38] transition">
                Shop
              </Link>
              <a href="#collections" className="hover:text-[#BA5D38] transition">
                Collections
              </a>
              <a href="#story" className="hover:text-[#BA5D38] transition">
                Our Story
              </a>
              <a href="#sustainability" className="hover:text-[#BA5D38] transition">
                Sustainability
              </a>
            </nav>
          </div>

          {/* Right: Search Pill & Auth CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Pill */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search curated pieces..."
                className="w-60 bg-[#F4EFEA] hover:bg-[#EDE6DD] focus:bg-white text-xs text-[#231F1D] placeholder-[#8E867E] rounded-full pl-9 pr-4 py-2.5 border border-transparent focus:border-[#BA5D38]/50 focus:ring-1 focus:ring-[#BA5D38]/30 outline-none transition-all"
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

            {/* Auth / Profile Link */}
            {customer ? (
              <Link
                to="/home"
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-[#1E1B18] text-white hover:bg-[#322D28] transition"
              >
                <span>Dashboard</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#4A443E] hover:text-[#231F1D] px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold px-4 py-2 rounded-full bg-[#1E1B18] text-white hover:bg-[#322D28] transition shadow-xs"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Matching Screen 01) */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2ECE2] text-[#786D5F] text-[11px] font-semibold tracking-wider uppercase">
                <span>Curated Edition • Autumn 2026</span>
              </div>

              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-[#231F1D]">
                The Art of Living, <br />
                <span className="italic font-normal">Curated.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#696157] max-w-lg leading-relaxed font-normal">
                Thoughtfully designed objects for the modern home, studio, and everyday ritual. 
                Rooted in honest materials, sculptural simplicity, and lasting value.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="rounded-full bg-[#1E1B18] px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#322D28] active:scale-[0.98] transition-all"
                >
                  Shop Now
                </Link>
                <a
                  href="#collections"
                  className="rounded-full border border-[#DED6CC] bg-white px-7 py-3.5 text-sm font-semibold text-[#231F1D] hover:bg-[#F4EFEA] hover:border-[#C4B8A9] active:scale-[0.98] transition-all"
                >
                  Explore Collections
                </a>
              </div>

              {/* Value stats */}
              <div className="pt-6 border-t border-[#EAE4DC] grid grid-cols-3 gap-4 text-left">
                <div>
                  <p className="font-editorial text-2xl font-bold text-[#231F1D]">100%</p>
                  <p className="text-xs text-[#78716C] mt-0.5">Ethically Sourced</p>
                </div>
                <div>
                  <p className="font-editorial text-2xl font-bold text-[#231F1D]">4.9★</p>
                  <p className="text-xs text-[#78716C] mt-0.5">Verified Reviews</p>
                </div>
                <div>
                  <p className="font-editorial text-2xl font-bold text-[#231F1D]">30-Day</p>
                  <p className="text-xs text-[#78716C] mt-0.5">Trial In Your Space</p>
                </div>
              </div>
            </div>

            {/* Right Hero Editorial Visual */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] sm:aspect-[5/4] bg-[#EFE9DF] border border-[#EAE4DC]">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80"
                  alt="Curated modern living interior"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Micro Product Card */}
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-xs rounded-2xl bg-white/90 backdrop-blur-md p-4 border border-white/60 shadow-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=150&auto=format&fit=crop&q=80"
                      alt="AURA Ambient Lamp"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#231F1D]">AURA Ambient Lamp</p>
                      <p className="text-xs font-semibold text-[#BA5D38] mt-0.5">₹3,499 • In Stock</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. As Seen In Press Banner (Matching Screen 01) */}
      <section className="border-y border-[#EAE4DC] bg-[#F7F3EC] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#8C8377]">
              As seen in
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70">
              <span className="font-editorial text-2xl font-bold tracking-widest text-[#231F1D]">
                VOGUE
              </span>
              <span className="font-editorial text-2xl font-bold tracking-widest text-[#231F1D]">
                ARCHITECTURAL DIGEST
              </span>
              <span className="font-sans text-sm font-black tracking-widest uppercase text-[#231F1D]">
                WIRECUTTER
              </span>
              <span className="font-editorial text-2xl font-bold tracking-widest text-[#231F1D]">
                GQ
              </span>
              <span className="font-editorial text-2xl font-bold tracking-widest text-[#231F1D]">
                ELLE DECOR
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Category Showcase Grid (Matching Screen 01 bottom row) */}
      <section id="collections" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C8377]">
                Collections
              </p>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#231F1D] mt-1">
                Explore by Category
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-[#BA5D38] hover:text-[#9C4B29] transition underline underline-offset-4"
            >
              View Full Catalog &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="group relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#EDE6DD] shadow-sm"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="font-editorial text-2xl font-bold">{cat.name}</p>
                  <p className="text-xs text-white/80 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Curated Pieces Highlights (Matching Screen 03 card aesthetic) */}
      <section className="py-16 bg-[#F4EFEA] border-t border-[#EAE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C8377]">
              Handpicked Essentials
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#231F1D] mt-2">
              For Your Space
            </h2>
            <p className="text-sm text-[#78716C] mt-2">
              Signature pieces designed to harmonize with the cadence of daily life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CURATED_HIGHLIGHTS.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl p-4 border border-[#EAE4DC] shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF7F2] mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#665D52] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 text-amber-600 text-xs mb-1">
                    <span>★</span>
                    <span className="font-semibold text-[#231F1D]">{item.rating}</span>
                    <span className="text-[#8C8377]">({item.reviews})</span>
                  </div>

                  <h3 className="font-semibold text-sm text-[#231F1D] line-clamp-1">
                    {item.name}
                  </h3>

                  {/* Color Swatch Dots */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {item.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-black/10"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                  <span className="font-bold text-[#231F1D] text-base">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <Link
                    to="/products"
                    className="text-xs font-semibold rounded-full bg-[#FAF7F2] hover:bg-[#1E1B18] text-[#231F1D] hover:text-white border border-[#EAE4DC] hover:border-[#1E1B18] px-3.5 py-1.5 transition"
                  >
                    + Add to Cart
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex rounded-full bg-[#1E1B18] text-white hover:bg-[#322D28] px-8 py-3 text-sm font-semibold transition"
            >
              Explore Full Catalog &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Sustainability & Story Feature */}
      <section id="story" className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#F0EAE0] border border-[#E5DDD2] p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C8377]">
                  Philosophy
                </span>
                <h2 className="font-editorial text-4xl sm:text-5xl text-[#231F1D] mt-2 leading-tight">
                  Objects made to last generations, not seasons.
                </h2>
                <p className="mt-4 text-[#696157] text-sm sm:text-base leading-relaxed">
                  We believe true luxury is found in intentional living. Every piece in our collection 
                  is commissioned from generational artisans working with renewable timber, untreated linen, 
                  and organic stoneware.
                </p>
                <div className="mt-8 flex gap-4">
                  <Link
                    to="/products"
                    className="rounded-full bg-[#1E1B18] text-white hover:bg-[#322D28] px-7 py-3 text-xs font-bold transition"
                  >
                    Read Our Journal
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden aspect-square bg-[#E8E1D5]">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80"
                    alt="Artisan craftsmanship"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square bg-[#E8E1D5] translate-y-6">
                  <img
                    src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&auto=format&fit=crop&q=80"
                    alt="Natural linen textures"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Minimalist Footer */}
      <footer className="border-t border-[#EAE4DC] bg-[#FAF7F2] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#EAE4DC]">
            
            {/* Brand column */}
            <div className="md:col-span-5 space-y-4">
              <span className="font-editorial text-3xl font-bold tracking-[0.2em] text-[#231F1D]">
                OMNIKART
              </span>
              <p className="text-xs text-[#78716C] max-w-sm leading-relaxed">
                A conscious lifestyle atelier curating everything you need for home, studio, and living well.
              </p>
              <div className="pt-2 text-xs text-[#8C8377]">
                © {new Date().getFullYear()} OmniKart Inc. All rights reserved.
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#231F1D] mb-3">Shop</p>
              <ul className="space-y-2 text-xs text-[#696157]">
                <li><Link to="/products" className="hover:text-[#BA5D38] transition">All Products</Link></li>
                <li><Link to="/products?category=Living" className="hover:text-[#BA5D38] transition">Living</Link></li>
                <li><Link to="/products?category=Lighting" className="hover:text-[#BA5D38] transition">Lighting</Link></li>
                <li><Link to="/products?category=Tech" className="hover:text-[#BA5D38] transition">Tech</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#231F1D] mb-3">Company</p>
              <ul className="space-y-2 text-xs text-[#696157]">
                <li><a href="#story" className="hover:text-[#BA5D38] transition">Our Story</a></li>
                <li><a href="#sustainability" className="hover:text-[#BA5D38] transition">Sustainability</a></li>
                <li><Link to="/orders" className="hover:text-[#BA5D38] transition">Order Tracking</Link></li>
                <li><Link to="/wishlist" className="hover:text-[#BA5D38] transition">Wishlist</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#231F1D] mb-2">Private Journal</p>
              <p className="text-xs text-[#78716C] mb-3">
                Receive intimate seasonal previews and design journals.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full text-xs bg-[#F4EFEA] border border-[#EAE4DC] rounded-l-full px-3 py-2 outline-none focus:border-[#BA5D38]"
                />
                <button
                  type="button"
                  className="bg-[#1E1B18] text-white text-xs font-semibold px-4 rounded-r-full hover:bg-[#322D28] transition"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
