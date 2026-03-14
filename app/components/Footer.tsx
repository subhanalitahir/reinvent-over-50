'use client';

import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Heart, Star, Users, Calendar, Award } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const stats = [
    { icon: Users, value: '300+', label: 'Members' },
    { icon: Calendar, value: '50+', label: 'Monthly Events' },
    { icon: Award, value: '98%', label: 'Success Rate' },
    { icon: Star, value: '4.9/5', label: 'Rating' },
  ];

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/membership', label: 'Membership' },
    { to: '/workbook', label: 'Workbook' },
    { to: '/events', label: 'Events' },
  ];

  const resourceLinks = [
    { to: '/booking', label: 'Book a Session' },
    { to: '/contact', label: 'Contact Us' },
    { to: '#', label: 'Privacy Policy' },
    { to: '#', label: 'Terms of Service' },
  ];

  const socials = [
    { Icon: Facebook, label: 'Facebook', color: 'from-blue-600 to-blue-700' },
    { Icon: Instagram, label: 'Instagram', color: 'from-pink-500 to-purple-600' },
    { Icon: Twitter, label: 'Twitter', color: 'from-sky-400 to-blue-500' },
    { Icon: Linkedin, label: 'LinkedIn', color: 'from-blue-700 to-blue-800' },
  ];

  return (
    <footer className="relative bg-[#0a0612] text-white overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{
            background: i % 2 === 0 ? 'rgba(167,139,250,0.6)' : 'rgba(244,114,182,0.6)',
            left: `${8 + i * 12}%`,
            top: `${10 + (i % 3) * 30}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10">
        {/* Stats Bar */}
        <motion.div
          className="border-b border-white/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center gap-2 group cursor-default"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.3))', border: '1px solid rgba(167,139,250,0.2)' }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <stat.icon className="w-5 h-5 text-purple-300" />
                  </motion.div>
                  <div className="text-2xl font-bold bg-linear-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            {/* Brand Column */}
            <motion.div
              className="lg:col-span-2 -mt-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Link href="/" className="flex items-center gap-3 group mb-1 w-fit">
                <img src="/img/logo.png" alt="Reinvent You Logo" className='w-40 h-32' />
              </Link>
              <p className="text-gray-500 leading-relaxed mb-2 text-sm">
                Empowering individuals over 50 to discover their purpose, build meaningful connections, and create the extraordinary life they deserve.
              </p>
              {/* Social Icons */}
              <div className="flex gap-2">
                {socials.map(({ Icon, label, color }, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    aria-label={label}
                    className="group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    <Icon className="w-4 h-4 relative z-10 text-gray-400 group-hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-300 mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2, type: 'spring', stiffness: 400 }}
                  >
                    <Link href={link.to} className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                      <motion.span
                        className="w-1 h-1 rounded-full bg-purple-500 shrink-0"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.15 }}
                      />
                      <span className="group-hover:text-purple-300 transition-colors">{link.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-300 mb-6">Resources</h3>
              <ul className="space-y-3">
                {resourceLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2, type: 'spring', stiffness: 400 }}
                  >
                    <Link href={link.to} className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                      <motion.span
                        className="w-1 h-1 rounded-full bg-pink-500 shrink-0"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.15 }}
                      />
                      <span className="group-hover:text-pink-300 transition-colors">{link.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-300 mb-6">Contact Us</h3>
              <ul className="space-y-5">
                {[
                  { Icon: Mail, text: 'erikab@reinventedover50.com', sub: 'Email us anytime' },
                ].map(({ Icon, text, sub }, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3 group"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all"
                      style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
                      whileHover={{ scale: 1.1, background: 'rgba(124,58,237,0.3)' }}
                    >
                      <Icon className="w-4 h-4 text-purple-400" />
                    </motion.div>
                    <div>
                      <div className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">{text}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{sub}</div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Divider with gradient */}
          <motion.div
            className="h-px mb-8 rounded-full"
            style={{ background: 'linear-gradient(to right, transparent, rgba(167,139,250,0.3), rgba(244,114,182,0.3), transparent)' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />

          {/* Bottom Bar */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>© {currentYear} Reinvent You Over 50. All rights reserved.</span>
              <span className="hidden md:inline-flex items-center gap-1 ml-2 text-gray-700">
                Designed and developed with <Heart className="w-3 h-3 text-pink-500" /> by <Link target='_blank' href="https://www.fiverr.com/kamranumer838?public_mode=true" className="text-purple-400 hover:text-purple-300 transition-colors">Zubair Umar</Link>
              </span>
            </div>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Cookies'].map((label, i) => (
                <motion.div key={i} whileHover={{ y: -2 }}>
                  <Link href="#" className="text-sm text-gray-600 hover:text-purple-400 transition-colors">{label}</Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
