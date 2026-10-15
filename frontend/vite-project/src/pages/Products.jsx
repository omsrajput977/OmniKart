import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { axiosInstance } from '../services/api';
import { useAuth } from '../context/AuthContent';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Books',
    'Home',
];

const Products = () => {
    const navigate = useNavigate();
    const { customer, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [category, setCategory] = useState('All Categories');

    // Fetch user wishlist IDs to highlight heart icons on product cards
    useEffect(() => {
        axiosInstance.get('/wishlist')
            .then((res) => {
                const list = res.data?.wishlist || [];
                const ids = new Set(list.map((item) => String(item._id || item.id)));
                setWishlistIds(ids);

                // console.log('Wishlist items fetched:', list);
                // console.log('Created wishlist IDs Set:', ids);
            })
            .catch((err) => {
                console.error('Failed to fetch user wishlist:', err);
            });
    }, []);

    // Debounce search input by 400ms to prevent spamming the backend
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    // Fetch products with search & category query params
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query params
            const params = {};
            if (debouncedSearch) {
                params.search = debouncedSearch;
            }
            if (category && category !== 'All Categories') {
                params.category = category;
            }

            // Sends: GET /products?search=...&category=...
            const response = await axiosInstance.get('/products', { params });

            const payload = response.data;
            setProducts(Array.isArray(payload) ? payload : payload.products || payload.data || []);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                'Failed to fetch products. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, category]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleClearFilters = () => {
        setSearch('');
        setCategory('All Categories');
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#231F1D] font-sans-ui flex flex-col">
            <Navbar customer={customer} onLogout={handleLogout} />
            <section className="py-10 px-4 sm:px-6 lg:px-8 flex-1">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 border-b border-[#EAE4DC] pb-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8377] block">
                        Curated Catalog
                    </span>
                    <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[#231F1D] tracking-tight mt-1">
                        All Pieces
                    </h1>
                    <p className="mt-1 text-xs text-[#78716C]">
                        {loading ? 'Searching curated catalog...' : `Displaying ${products.length} timeless objects`}
                    </p>
                </div>

                {/* Filter Bar (Search + Category Dropdown) */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Search Input */}
                    <div className="relative sm:col-span-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8C8377]">
                            <svg
                                className="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by piece title or material..."
                            className="w-full rounded-xl border border-[#DDD6CC] bg-white py-2.5 pl-10 pr-10 text-xs text-[#231F1D] shadow-2xs placeholder-[#9E958A] focus:border-[#BA5D38] focus:outline-none focus:ring-1 focus:ring-[#BA5D38] transition"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8C8377] hover:text-[#231F1D]"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Category Dropdown */}
                    <div className="relative sm:col-span-1">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-[#DDD6CC] bg-white py-2.5 pl-4 pr-10 text-xs font-semibold text-[#4A443E] shadow-2xs focus:border-[#BA5D38] focus:outline-none focus:ring-1 focus:ring-[#BA5D38] cursor-pointer transition"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#8C8377]">
                            <svg
                                className="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Loading Skeletons */}
                {loading && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                            >
                                <div className="h-48 w-full rounded-lg bg-gray-200" />
                                <div className="mt-4 h-3 w-1/4 rounded bg-gray-200" />
                                <div className="mt-2 h-5 w-3/4 rounded bg-gray-200" />
                                <div className="mt-3 h-6 w-1/3 rounded bg-gray-200" />
                                <div className="mt-4 h-10 w-full rounded-lg bg-gray-200" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
                        <p className="font-semibold">Unable to load products</p>
                        <p className="mt-1 text-sm text-rose-600">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
                        <p className="text-lg font-medium text-gray-700">No matching products found</p>
                        <p className="mt-1 text-sm">
                            Try adjusting your search query or selecting a different category.
                        </p>
                        {(search || category !== 'All Categories') && (
                            <button
                                onClick={handleClearFilters}
                                className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => {
                            const productId = product._id || product.id;
                            return (
                                <ProductCard
                                    key={productId}
                                    product={product}
                                    initialWishlisted={wishlistIds.has(String(productId))}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    </div>
    );
};

export default Products;