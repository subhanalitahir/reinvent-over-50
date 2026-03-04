'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/membership', label: 'Membership' },
    { to: '/workbook', label: 'Workbook' },
    { to: '/events', label: 'Events' },
    { to: '/booking', label: 'Book Session' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-2xl border-b border-gray-200 shadow-xl'
          : 'bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <nav className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-9 h-9 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
            </motion.div>
            <div className="leading-tight">
              <span className="block font-display text-base font-bold bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                Reinvent You Over 50
              </span>
              <span className="block text-[10px] text-gray-400 font-medium tracking-widest uppercase">Transform Your Life</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  href={link.to}
                  className="relative px-2.5 py-2 text-[13px] text-gray-600 hover:text-purple-600 transition-colors group font-medium whitespace-nowrap"
                >
                  {link.label}
                  <span className="absolute bottom-0.5 left-2.5 right-2.5 h-0.5 bg-linear-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                </Link>
              </motion.div>
            ))}
            <motion.div
              className="ml-4 shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/membership"
                className="relative overflow-hidden inline-flex items-center px-5 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-purple-500/40 hover:shadow-xl transition-all hover:scale-105 group whitespace-nowrap"
              >
                <span className="relative z-10">Get Started</span>
                <div className="btn-shimmer" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="xl:hidden pt-4 pb-2 border-t border-gray-100 mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={link.to}
                    className="block py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4"
              >
                <Link
                  href="/membership"
                  className="block w-full px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-center shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}