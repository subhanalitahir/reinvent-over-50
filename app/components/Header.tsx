'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setIsOpen(false);
    router.push('/');
  };

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
      <nav className="max-w-7xl mx-auto px-4 py-0">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
          <img src="/img/logo.png" alt="" className='w-33 h-20'/>
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

            {/* Auth buttons */}
            {!authLoading && (
              <motion.div
                className="ml-4 flex items-center gap-2 shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {user ? (
                  /* Authenticated: avatar dropdown */
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(v => !v)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 rounded-full transition-all group"
                    >
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 max-w-24 truncate">{user.name.split(' ')[0]}</span>
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Unauthenticated */
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="relative overflow-hidden inline-flex items-center px-5 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-purple-500/40 hover:shadow-xl transition-all hover:scale-105 whitespace-nowrap"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </motion.div>
            )}
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
                className="mt-4 space-y-2"
              >
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 w-full px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-center transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-center shadow-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}