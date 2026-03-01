'use client';

import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowRight, Heart, Star, Users, Calendar, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) { setSubscribed(true); setTimeout(() => setSubscribed(false), 3000); setEmail(''); }
  };

  const stats = [
    { icon: Users, value: '5,000+', label: 'Members' },
    { icon: Calendar, value: '200+', label: 'Monthly Events' },
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
    { to: '#', label: 'Blog & Insights' },
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

      {/* Newsletter Section */}
      <div className="relative z-10">
        <motion.div
          className="border-b border-white/5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(236,72,153,0.15) 50%, rgba(99,102,241,0.1) 100%)', border: '1px solid rgba(167,139,250,0.2)' }}>
              {/* Glowing inner orb */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(167,139,250,0.2)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#c4b5fd' }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Weekly Transformation Tips
              </motion.div>
              <motion.h3
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                  Stay Inspired
                </span>
              </motion.h3>
              <motion.p
                className="text-gray-400 text-lg mb-10 max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Get weekly insights, success stories, and transformation tips delivered to your inbox
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(167,139,250,0.25)' }}
                />
                <motion.button
                  onClick={handleSubscribe}
                  className="px-8 py-4 rounded-full font-bold text-white flex items-center justify-center gap-2 shadow-2xl relative overflow-hidden group"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #6d28d9, #db2777)' }}
                  />
                  <span className="relative z-10">{subscribed ? '✓ Subscribed!' : 'Subscribe'}</span>
                  {!subscribed && <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

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
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">
            {/* Brand Column */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Link href="/" className="flex items-center gap-3 group mb-6 w-fit">
                <motion.div className="relative" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <div className="absolute inset-0 rounded-2xl blur-lg opacity-60 group-hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }} />
                  <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                <div>
                  <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Reinvent You Over 50
                  </div>
                  <div className="text-xs text-gray-500 font-medium tracking-wide">Transform Your Life</div>
                </div>
              </Link>
              <p className="text-gray-500 leading-relaxed mb-8 text-sm">
                Empowering individuals over 50 to discover their purpose, build meaningful connections, and create the extraordinary life they deserve.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
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
                      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
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
                        className="w-1 h-1 rounded-full bg-purple-500 flex-shrink-0"
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
                        className="w-1 h-1 rounded-full bg-pink-500 flex-shrink-0"
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
                  { Icon: Mail, text: 'info@reinventyou.com', sub: 'Email us anytime' },
                  { Icon: Phone, text: '(555) 123-4567', sub: 'Mon–Fri, 9am–6pm' },
                  { Icon: MapPin, text: '123 Transformation St', sub: 'City, State 12345' },
                ].map(({ Icon, text, sub }, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3 group"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
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
                Made with <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}><Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" /></motion.span> for those over 50
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
