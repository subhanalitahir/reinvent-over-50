'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  loading?: boolean;
}

export function EmailModal({
  isOpen,
  onClose,
  onSubmit,
  title = 'Enter your email',
  subtitle = 'We\'ll use this to send you order confirmation and access details.',
  ctaLabel = 'Continue to Checkout',
  loading = false,
}: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError = touched && !isValid;

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
      // Reset form state asynchronously to avoid synchronous setState in effect
      setTimeout(() => {
        setEmail('');
        setTouched(false);
      }, 0);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || loading) return;
    onSubmit(email);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-200 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          >
            {/* Top gradient bar */}
            <div className="h-1.5 w-full bg-linear-to-r from-purple-600 via-pink-500 to-orange-400" />

            <div className="p-8">
              {/* Close button */}
              <motion.button
                type="button"
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Icon */}
              <motion.div
                className="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>

              {/* Text */}
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">{subtitle}</p>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="checkout-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                    <input
                      ref={inputRef}
                      id="checkout-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={() => setTouched(true)}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-xl text-gray-900 text-sm transition-all outline-none placeholder:text-gray-300
                        ${showError
                          ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                        }`}
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                  <AnimatePresence>
                    {showError && (
                      <motion.p
                        className="text-red-500 text-xs mt-1.5 font-medium"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        Please enter a valid email address.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-4 rounded-xl text-white font-bold text-base overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}
                  whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 30px rgba(124,58,237,0.45)' } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Redirecting…
                    </>
                  ) : (
                    <>
                      {ctaLabel}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                  {!loading && <div className="btn-shimmer" />}
                </motion.button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                🔒 &nbsp;Secured by Stripe. Your email is never shared or sold.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
