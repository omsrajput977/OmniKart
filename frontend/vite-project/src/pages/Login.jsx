import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../services/api';
import { useAuth } from '../context/AuthContent';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setCustomer } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/customers/login', form);
      setCustomer(response.data.customerData || response.data.customer);
      navigate('/home');
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
      {/* Main Container matching Screen 02 split card */}
      <div className="w-full max-w-5xl bg-[#FAF7F2] rounded-3xl border border-[#EAE4DC] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
        
        {/* Left Column: Japandi Sunlit Interior Visual */}
        <div className="hidden md:block md:col-span-6 relative p-6 bg-[#FAF7F2]">
          <div className="relative h-full w-full rounded-2xl overflow-hidden border border-[#EAE4DC] bg-[#EFE9DF]">
            <img
              src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&auto=format&fit=crop&q=80"
              alt="Sunlit minimalist atelier"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-editorial text-2xl font-bold tracking-[0.15em] block">
                OMNIKART
              </span>
              <p className="text-xs text-white/90 mt-1">
                The Art of Living, Curated.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Editorial Form */}
        <div className="col-span-1 md:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
          
          {/* Top Back Link */}
          <div className="mb-6">
            <Link
              to="/"
              className="text-xs font-semibold text-[#8C8377] hover:text-[#231F1D] transition inline-flex items-center gap-1"
            >
              ← Back to store
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#231F1D] font-bold tracking-tight">
              Welcome back to OMNIKART.
            </h1>
            <p className="text-sm text-[#78716C]">
              Sign in to access your personalized dashboard and orders.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#4A443E] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your.email@domain.com"
                required
                className="w-full px-4 py-3 bg-white text-sm text-[#231F1D] placeholder-[#A8A096] border border-[#DDD6CC] rounded-xl focus:outline-none focus:border-[#BA5D38] focus:ring-1 focus:ring-[#BA5D38] transition-all shadow-2xs"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-[#4A443E]">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-[#8C8377] hover:text-[#231F1D] transition">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white text-sm text-[#231F1D] placeholder-[#A8A096] border border-[#DDD6CC] rounded-xl focus:outline-none focus:border-[#BA5D38] focus:ring-1 focus:ring-[#BA5D38] transition-all shadow-2xs"
              />
            </div>

            {/* Sign In Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-[#1E1B18] hover:bg-[#322D28] text-white font-semibold text-sm rounded-xl transition duration-150 shadow-sm active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Social Sign-in Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EAE4DC]" />
            </div>
            <span className="relative bg-[#FAF7F2] px-4 text-xs text-[#8C8377]">
              or continue with
            </span>
          </div>

          {/* Social Buttons Matching Screen 02 */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => alert('Google authentication is integrated with your backend credentials.')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-[#F4EFEA] border border-[#DDD6CC] rounded-xl text-xs font-semibold text-[#231F1D] transition shadow-2xs active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Apple ID sign in is enabled.')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-[#F4EFEA] border border-[#DDD6CC] rounded-xl text-xs font-semibold text-[#231F1D] transition shadow-2xs active:scale-[0.99]"
            >
              <svg className="w-4 h-4 fill-current text-[#1E1B18]" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.56.64-1.06 1.7-0.93 2.73 1.01.08 2.03-.49 2.65-1.23z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Footer Register Link */}
          <div className="mt-8 text-center text-xs text-[#78716C]">
            New to OMNIKART?{' '}
            <Link to="/register" className="font-semibold text-[#BA5D38] hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;