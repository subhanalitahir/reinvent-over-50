'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Eye, EyeOff, Sparkles, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const passwordStrength =
    formData.password.length >= 12 ? 'strong'
    : formData.password.length >= 8 ? 'medium'
    : formData.password.length > 0 ? 'weak'
    : '';

  const strengthColor =
    passwordStrength === 'strong' ? 'bg-green-400'
    : passwordStrength === 'medium' ? 'bg-yellow-400'
    : 'bg-rose-400';

  const strengthLevels = ['weak', 'medium', 'strong'];
  const strengthIndex = strengthLevels.indexOf(passwordStrength);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.');
        return;
      }
      login(data.data.token, data.data.user);
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-fuchsia-50 px-4 pt-20 pb-12 relative overflow-hidden">
      {/* Background orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-purple-400/20 blur-3xl -top-25 -right-25 pointer-events-none"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-pink-400/20 blur-3xl -bottom-20 -left-20 pointer-events-none"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="font-display text-xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Reinvent You Over 50
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-6 font-display">Create Your Account</h1>
          <p className="text-gray-500 mt-2">Start your transformation journey today</p>
        </div>

        {/* Form card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
          {error && (
            <motion.div
              className="flex items-center gap-2 p-3 mb-5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                autoComplete="name"
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordStrength && (
                <div className="flex items-center gap-1.5 mt-2">
                  {strengthLevels.map((level, i) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        strengthIndex >= i ? strengthColor : 'bg-gray-200'
                      }`}
                    />
                  ))}
                  <span
                    className={`text-xs font-medium capitalize ${
                      passwordStrength === 'weak' ? 'text-rose-500'
                      : passwordStrength === 'medium' ? 'text-yellow-600'
                      : 'text-green-600'
                    }`}
                  >
                    {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className={`w-full px-4 py-3 pr-11 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-rose-300'
                      : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="flex items-center gap-1 text-xs text-green-600 mt-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/40 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 hover:text-pink-600 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-purple-600 transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}
