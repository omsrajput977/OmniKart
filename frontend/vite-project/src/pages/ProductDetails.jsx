import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { axiosInstance } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContent';
import { useDispatch } from 'react-redux';
import { addToCartApi } from '../redux/cartSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customer, logout } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedQty, setSelectedQty] = useState(1);

  const colors = ['#D7C6B4', '#8E6953', '#2B2724'];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data.product || response.data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Failed to load product details.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || isAdding) return;
    setIsAdding(true);
    try {
      await dispatch(
        addToCartApi({
          _id: product._id || product.id,
          name: product.name,
          price: product.price,
          image: product.image || product.imageUrl,
          quantity: selectedQty,
        })
      ).unwrap();
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] font-sans-ui text-[#231F1D]">
        <Navbar customer={customer} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="h-96 w-full rounded-3xl bg-[#EFE9DF]" />
            <div className="space-y-4">
              <div className="h-4 w-24 bg-[#EFE9DF] rounded" />
              <div className="h-10 w-3/4 bg-[#EFE9DF] rounded" />
              <div className="h-8 w-1/3 bg-[#EFE9DF] rounded" />
              <div className="h-24 w-full bg-[#EFE9DF] rounded" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] font-sans-ui text-[#231F1D]">
        <Navbar customer={customer} onLogout={handleLogout} />
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="rounded-3xl border border-[#EAE4DC] bg-white p-8 shadow-xs">
            <h2 className="font-editorial text-2xl font-bold text-[#231F1D]">Piece Not Found</h2>
            <p className="mt-2 text-sm text-[#78716C]">{error || 'The requested piece is no longer available.'}</p>
            <div className="mt-6">
              <Link
                to="/products"
                className="rounded-full bg-[#1E1B18] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#322D28] transition"
              >
                Return to Catalog
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans-ui text-[#231F1D] flex flex-col">
      <Navbar customer={customer} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        {/* Breadcrumb Navigation (Matching Screen 04) */}
        <div className="mb-8 flex items-center gap-2 text-xs text-[#8C8377]">
          <Link to="/" className="hover:text-[#231F1D] transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#231F1D] transition">{product.category || 'Catalog'}</Link>
          <span>/</span>
          <span className="text-[#231F1D] font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Gallery & Visuals */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#EAE4DC] aspect-[4/3] sm:aspect-[5/4] shadow-xs">
              <img
                src={product.imageUrl || product.image || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover transition duration-500 hover:scale-105"
              />
              {isOutOfStock && (
                <span className="absolute top-4 left-4 rounded-full bg-[#1E1B18] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Sold Out
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden aspect-square border border-[#EAE4DC] bg-white cursor-pointer hover:border-[#1E1B18] transition"
                >
                  <img
                    src={product.imageUrl || product.image || 'https://via.placeholder.com/150'}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details (Matching Screen 04) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Rating Stars */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex text-amber-600">
                {'★★★★★'}
              </div>
              <span className="font-bold text-[#231F1D]">4.8</span>
              <span className="text-[#8C8377]">(124 verified reviews)</span>
            </div>

            {/* Title & Price */}
            <div>
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8C8377]">
                {product.category}
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl text-[#231F1D] font-bold mt-1 tracking-tight leading-snug">
                {product.name}
              </h1>
              <div className="mt-3 text-3xl font-bold text-[#231F1D]">
                ₹{product.price?.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Color Swatch Selector */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443E]">
                Finish / Color
              </label>
              <div className="flex items-center gap-2.5">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedColor(i)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      selectedColor === i ? 'ring-2 ring-offset-2 ring-[#1E1B18] scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="pt-2 text-sm text-[#696157] leading-relaxed border-t border-[#EAE4DC]">
              <p>
                {product.description ||
                  'Designed with natural restraint, using durable honest materials that patina gracefully with time.'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443E]">
                Quantity
              </label>
              <div className="inline-flex items-center rounded-xl border border-[#DDD6CC] bg-white">
                <button
                  type="button"
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                  className="px-3.5 py-2 text-sm font-bold text-[#4A443E] hover:bg-[#FAF7F2] rounded-l-xl transition"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold text-[#231F1D]">
                  {selectedQty}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedQty(selectedQty + 1)}
                  className="px-3.5 py-2 text-sm font-bold text-[#4A443E] hover:bg-[#FAF7F2] rounded-r-xl transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons (Matching Screen 04) */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={isOutOfStock || isAdding}
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-xl bg-[#1E1B18] hover:bg-[#322D28] text-white text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
              >
                {isOutOfStock
                  ? 'Sold Out'
                  : isAdding
                  ? 'Adding to Cart...'
                  : 'Add to Cart'}
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-xl bg-[#BA5D38] hover:bg-[#A34F2E] text-white text-sm font-semibold transition active:scale-[0.99] shadow-xs"
              >
                Instant Checkout
              </button>
            </div>

            {/* Value Guarantees Strip */}
            <div className="pt-4 border-t border-[#EAE4DC] grid grid-cols-2 gap-3 text-xs text-[#78716C]">
              <div className="flex items-center gap-2">
                <span>📦</span>
                <span>Carbon-Neutral Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span>30-Day Home Trial</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;