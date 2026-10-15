import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../services/api';

function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axiosInstance.post('/customers/register', form);
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Invalid details provided. Please try again.');
      } else {
        setError('Failed to connect to the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#231F1D] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans-ui">
      {/* Main Container matching AURA theme split card */}
      <div className="w-full max-w-5xl bg-[#FAF7F2] rounded-3xl border border-[#EAE4DC] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
        
        {/* Left Column: Japandi Sunlit Visual */}
        <div className="hidden md:block md:col-span-5 relative p-6 bg-[#FAF7F2]">
          <div className="relative h-full w-full rounded-2xl overflow-hidden border border-[#EAE4DC] bg-[#EFE9DF]">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80"
              alt="Warm Japandi living space"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-editorial text-2xl font-bold tracking-[0.15em] block">
                OMNIKART
              </span>
              <p className="text-xs text-white/90 mt-1">
                Join our circle for curated collections & private previews.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="col-span-1 md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          
          <div className="mb-4">
            <Link
              to="/"
              className="text-xs font-semibold text-[#8C8377] hover:text-[#231F1D] transition inline-flex items-center gap-1"
            >
              ← Back to store
            </Link>
          </div>

          <div className="space-y-1.5">
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#231F1D] font-bold tracking-tight">
              Create an Account.
            </h1>
            <p className="text-sm text-[#78716C]">
              Become a member to track orders, save wishlists, and earn points.
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-[#4A443E] mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Aarav Sharma"
                required
                className="w-full px-4 py-2.5 bg-white text-sm text-[#231F1D] placeholder-[#A8A096] border border-[#DDD6CC] rounded-xl focus:outline-none focus:border-[#BA5D38] focus:ring-1 focus:ring-[#BA5D38] transition-all shadow-2xs"
              />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#4A443E] mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="aarav@example.com"
                required
                className="w-full px-4 py-2.5 bg-white text-sm text-[#231F1D] placeholder-[#A8A096] border border-[#DDD6CC] rounded-xl focus:outline-none focus:border-[#BA5D38] focus:ring-1 focus:ring-[#BA5D38] transition-all shadow-2xs"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#4A443E] mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                className="w-full px-4 py-2.5 bg-white text-sm text-[#231F1D] placeholder-[#A8A096] border border-[#DDD6CC] rounded-xl focus:outline-none focus:border-[#BA5D38] focus:ring-1 focus:ring-[#BA5D38] transition-all shadow-2xs"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-[#4A443E] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                className="w-full px-4 py-2.5 bg-white text-sm text-[#231F1D] placeholder-[#A8A096] border border-[#DDD6CC] rounded-xl focus:outline-none focus:border-[#BA5D38] focus:ring-1 focus:ring-[#BA5D38] transition-all shadow-2xs"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 px-4 bg-[#1E1B18] hover:bg-[#322D28] text-white font-semibold text-sm rounded-xl transition duration-150 shadow-sm active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-[#78716C]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#BA5D38] hover:underline">
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;