'use client';

import Link from 'next/link';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Users, Calendar, BookOpen, Video, Award, Heart, ArrowRight, Star, CheckCircle, TrendingUp, Shield, Zap, Quote, Sparkles, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { BannerStrip } from '../components/BannerStrip';

export function HomePage() {
  const features = [
    {
      icon: Users,
      title: 'Vibrant Community',
      description: 'Connect with like-minded individuals on the same transformative journey',
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'from-blue-50 to-cyan-50',
    },
    {
      icon: Calendar,
      title: 'Regular Events',
      description: 'Virtual and in-person gatherings to fuel your growth and inspire connections',
      gradient: 'from-purple-500 to-pink-500',
      bg: 'from-purple-50 to-pink-50',
    },
    {
      icon: BookOpen,
      title: 'Transformation Workbook',
      description: 'Guided exercises to help you discover your new path with clarity and purpose',
      gradient: 'from-orange-500 to-red-500',
      bg: 'from-orange-50 to-red-50',
    },
    {
      icon: Video,
      title: '1-on-1 Coaching',
      description: 'Personalized sessions to accelerate your transformation and unlock potential',
      gradient: 'from-green-500 to-emerald-500',
      bg: 'from-green-50 to-emerald-50',
    },
  ];

  const stats = [
    { value: '5,000+', label: 'Active Members', icon: Users, color: 'from-purple-500 to-violet-500' },
    { value: '98%', label: 'Success Rate', icon: TrendingUp, color: 'from-pink-500 to-rose-500' },
    { value: '200+', label: 'Monthly Events', icon: Calendar, color: 'from-blue-500 to-indigo-500' },
    { value: '50+', label: 'Countries', icon: Award, color: 'from-amber-500 to-orange-500' },
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      age: 58,
      role: 'Entrepreneur',
      image: 'https://images.unsplash.com/photo-1738943892652-5ac88beb6c35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvbGRlciUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyMzU1NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      text: "This community changed my life. I've discovered passions I didn't know I had and started my own business at 58!",
      rating: 5,
      highlight: 'Changed my life',
    },
    {
      name: 'David Richardson',
      age: 62,
      role: 'Retired Executive',
      image: 'https://images.unsplash.com/photo-1584940121730-93ffb8aa88b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjBwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzIzNTU1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      text: "The workbook and coaching gave me clarity on my next chapter. Best investment I've made in myself.",
      rating: 5,
      highlight: 'Best investment',
    },
    {
      name: 'Linda Kennedy',
      age: 55,
      role: 'Author & Speaker',
      image: 'https://images.unsplash.com/photo-1758686254593-7c4cd55b2621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjB3b21hbiUyMHNtaWxpbmclMjBjb25maWRlbnR8ZW58MXx8fHwxNzcyMzU1NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      text: "I've made incredible friends and found a new sense of purpose. This is more than a community—it's a family.",
      rating: 5,
      highlight: 'More than a community',
    },
  ];

  const benefits = [
    { text: 'Cancel anytime, no questions asked', icon: CheckCircle },
    { text: '30-day money-back guarantee', icon: Shield },
    { text: 'Join 5,000+ transforming lives', icon: Users },
    { text: 'Expert guidance & support', icon: Zap },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <div className="pt-20">
      <BannerStrip placement="home" />

      {/* ===== HERO ===== */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #faf5ff 0%, #fdf2f8 40%, #fff7ed 70%, #f0fdf4 100%)' }}
      >
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <motion.div className="absolute top-10 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />
        <motion.div className="absolute -bottom-20 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none animate-blob-delay-1"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' }} />

        {[...Array(12)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{
              width: `${4 + (i % 4) * 3}px`, height: `${4 + (i % 4) * 3}px`,
              background: i % 3 === 0 ? 'rgba(124,58,237,0.4)' : i % 3 === 1 ? 'rgba(236,72,153,0.35)' : 'rgba(245,158,11,0.35)',
              left: `${5 + i * 8}%`, top: `${15 + (i % 5) * 15}%`,
            }}
            animate={{ y: [0, -(20 + i * 4), 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.4, 1] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
              <motion.div
                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-purple-100"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />)}
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <span className="text-sm font-semibold text-gray-700">Trusted by <span className="text-purple-600">5,000+</span> Members Worldwide</span>
              </motion.div>

              <motion.div className="mb-8" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
                <h1 className="font-display font-bold leading-none">
                  <span className="block text-5xl md:text-7xl lg:text-8xl text-gray-900 tracking-tight">Your Best</span>
                  <span className="block text-5xl md:text-7xl lg:text-8xl text-gray-900 tracking-tight">Years Are</span>
                  <span className="block text-5xl md:text-7xl lg:text-8xl font-black italic" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #f59e0b 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Still Ahead
                  </span>
                </h1>
              </motion.div>

              <motion.p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              >
                Join a vibrant community of empowered individuals over 50 who are{' '}
                <span className="font-semibold text-gray-800">reinventing themselves</span> and creating extraordinary lives.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/membership" className="group relative inline-flex items-center justify-center gap-2 px-9 py-5 text-white rounded-full font-bold text-lg shadow-2xl overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
                  >
                    <span className="relative z-10">Start Your Journey</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    <div className="absolute inset-0 btn-shimmer" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/workbook" className="inline-flex items-center justify-center gap-2 px-9 py-5 bg-white text-purple-700 rounded-full font-bold text-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all shadow-lg">
                    <Play className="w-4 h-4 fill-current" />
                    Get Free Workbook
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div className="grid grid-cols-2 gap-3 text-sm text-gray-600"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}
              >
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/80 shadow-sm">
                    <benefit.icon className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="font-medium text-xs">{benefit.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right */}
            <motion.div className="relative" initial={{ opacity: 0, scale: 0.9, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
              <motion.div className="absolute -inset-6 rounded-[40px] pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))' }}
                animate={{ rotate: [0, 3, -3, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div className="absolute -inset-3 rounded-[36px] pointer-events-none blur-2xl opacity-40"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}
                animate={{ scale: [1, 1.03, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative">
                <ImageWithFallback src="https://images.unsplash.com/photo-1595529056838-5dd92007644d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjB3b21hbiUyMG92ZXIlMjA1MHxlbnwxfHx8fDE3NzIzNTM1ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Confident woman over 50" className="rounded-[32px] shadow-2xl w-full relative z-10 object-cover" />

                <motion.div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-20"
                  initial={{ opacity: 0, x: -40, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} whileHover={{ scale: 1.05 }}
                >
                  <div className="number-display text-4xl mb-1">5,000+</div>
                  <div className="text-sm text-gray-500 font-semibold">Active Members</div>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-5 h-5 rounded-full border-2 border-white bg-linear-to-br ${['from-purple-400 to-pink-400', 'from-blue-400 to-cyan-400', 'from-green-400 to-emerald-400', 'from-orange-400 to-red-400', 'from-violet-400 to-purple-400'][i]}`} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">+more</span>
                  </div>
                </motion.div>

                <motion.div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-20"
                  initial={{ opacity: 0, x: 40, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.8, delay: 1.4 }} whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />)}
                  </div>
                  <div className="number-display text-3xl">4.9/5</div>
                  <div className="text-xs text-gray-500 font-semibold mt-1">Member Rating</div>
                </motion.div>

                <motion.div className="absolute top-1/2 -right-8 bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-4 z-20 text-white"
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1.6 }} whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-black font-display">98%</div>
                  <div className="text-xs font-bold opacity-90">Success Rate</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        >
          <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">Scroll to explore</span>
          <div className="scroll-indicator" />
        </motion.div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
      <div className="py-5 overflow-hidden relative" style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7, #db2777, #f97316, #db2777, #a855f7, #7c3aed)' }}>
        <div className="flex gap-10 animate-marquee whitespace-nowrap font-bold text-sm uppercase tracking-widest text-white">
          {[...Array(3)].map((_, rep) =>
            ['Join 5,000+ Members', '✦ Transform Your Life', '✦ Expert Coaching', '✦ 98% Success Rate', '✦ 30-Day Guarantee', '✦ 50+ Countries', '✦ 200+ Events Monthly', '✦ Start Today Free'].map((item, i) => (
              <span key={`${rep}-${i}`} className="flex items-center gap-3">
                <span className="w-1 h-1 bg-white/60 rounded-full inline-block" />{item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ===== STATS ===== */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="section-label mx-auto w-fit mb-5"><Sparkles className="w-3.5 h-3.5" />Our Impact in Numbers</div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900">
              Transforming Lives <span className="gradient-text-purple italic">Every Day</span>
            </h2>
          </motion.div>
          <motion.div className="grid md:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -12, scale: 1.03 }} className="text-center group relative">
                <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-linear-to-br ${stat.color} rounded-3xl mb-6 shadow-xl group-hover:shadow-2xl transition-all`}>
                  <stat.icon className="w-9 h-9 text-white" />
                  <div className={`absolute inset-0 bg-linear-to-br ${stat.color} rounded-3xl blur-xl opacity-40 -z-10 group-hover:opacity-60 transition-opacity`} />
                </div>
                <div className="number-display text-6xl mb-3">{stat.value}</div>
                <div className="text-gray-600 font-semibold tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-36 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #faf5ff 0%, #fdf2f8 50%, #fff7ed 100%)' }}>
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-20 right-0 w-96 h-96 orb orb-purple opacity-30" />
        <div className="absolute bottom-0 left-10 w-64 h-64 orb orb-pink opacity-25" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="section-label mx-auto w-fit mb-6"><Zap className="w-3.5 h-3.5" />Everything You Need</div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-none">
              <span className="block text-gray-900 tracking-tight">Transform Your Life</span>
              <span className="block gradient-text italic">With Expert Support</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Access world-class tools, resources, and a supportive community designed specifically for your transformation journey after 50.
            </p>
          </motion.div>
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -14, scale: 1.02 }}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-linear-to-br ${feature.bg} opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-3xl`} />
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div className={`relative z-10 w-16 h-16 bg-linear-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="relative z-10 text-2xl font-display font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="relative z-10 text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="relative z-10 mt-6 flex items-center gap-1.5 text-purple-600 text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== COMMUNITY ===== */}
      <section className="py-36 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-purple-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="relative">
              <div className="absolute -inset-8 animate-blob opacity-30" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.2))', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
              <ImageWithFallback src="https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjBhZHVsdHMlMjBjb21tdW5pdHklMjBncm91cHxlbnwxfHx8fDE3NzIzNTM1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Community gathering" className="rounded-[32px] shadow-2xl w-full relative z-10" />
              <motion.div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white z-20"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-gray-900 text-lg">Next Virtual Meetup</p>
                    <p className="text-sm text-gray-500">Thursday, 7PM EST · 200+ attending</p>
                  </div>
                  <Link href="/events" className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full hover:shadow-lg transition-shadow">RSVP Free</Link>
                </div>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
              <div className="section-label mb-6"><Users className="w-3.5 h-3.5" />Community-Powered</div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                <span className="block text-gray-900">You're Not Alone</span>
                <span className="block gradient-text-purple italic">On This Journey</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Connect with hundreds of individuals committed to growth, support, and{' '}
                <span className="font-semibold text-gray-800">celebrating wins together.</span>
              </p>
              <motion.div className="space-y-5 mb-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {[
                  { icon: Award, text: 'Weekly virtual meetups with world-class expert speakers', color: 'from-purple-500 to-pink-500' },
                  { icon: Heart, text: 'Private member forum for 24/7 peer support & connection', color: 'from-pink-500 to-rose-500' },
                  { icon: Users, text: 'Personally matched with accountability partners', color: 'from-blue-500 to-violet-500' },
                ].map((item, index) => (
                  <motion.div key={index} variants={itemVariants}
                    className="flex items-start gap-5 group p-5 rounded-2xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/40 transition-all cursor-default shadow-sm hover:shadow-md"
                  >
                    <div className={`w-12 h-12 bg-linear-to-br ${item.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed pt-1">{item.text}</p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/membership" className="inline-flex items-center gap-2 px-9 py-5 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                  style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}>
                  Join the Community <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-36 relative overflow-hidden" style={{ background: 'linear-gradient(150deg, #faf5ff 0%, #fdf2f8 40%, #fff7ed 100%)' }}>
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-80 h-80 orb orb-purple opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 orb orb-pink opacity-15" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="section-label mx-auto w-fit mb-6"><Quote className="w-3.5 h-3.5" />Success Stories</div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-none">
              <span className="block text-gray-900 tracking-tight">Real People,</span>
              <span className="block gradient-text italic">Real Transformations</span>
            </h2>
          </motion.div>
          <motion.div className="grid md:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -14, scale: 1.02 }}
                className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-purple-500 to-pink-500" />
                <div className="absolute top-6 right-6 text-8xl leading-none font-display italic text-purple-100 select-none">❝</div>
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                </div>
                <div className="inline-block bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
                  {testimonial.highlight}
                </div>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed relative z-10">"{testimonial.text}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-pink-600 rounded-full blur-md opacity-50" />
                    <ImageWithFallback src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-white relative z-10 shadow-lg" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role} · Age {testimonial.age}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0 animate-aurora"
          style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed, #db2777, #ea580c, #db2777, #7c3aed)', backgroundSize: '400% 400%' }}
        />
        <div className="absolute inset-0 bg-noise opacity-40" />
        {[...Array(10)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: `${3 + i % 4}px`, height: `${3 + i % 4}px`, background: `rgba(255,255,255,${0.3 + (i % 4) * 0.1})`, left: `${8 + i * 9}%`, top: `${15 + (i % 5) * 16}%` }}
            animate={{ y: [0, -(30 + i * 5), 0], opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-8"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          >
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Sparkles className="w-4 h-4" />
            </motion.div>
            Limited Time · Join Free Today
          </motion.div>

          <motion.h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-8 leading-none tracking-tight"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            Ready to <span className="italic" style={{ color: '#fde68a' }}>Transform</span>
            <br />Your Life?
          </motion.h2>

          <motion.p className="text-2xl md:text-3xl mb-14 text-white/80 leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
          >
            Join <span className="font-bold text-white">5,000+</span> people over 50 living their absolute best lives
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/membership" className="group inline-flex items-center gap-3 px-12 py-6 bg-white text-purple-700 rounded-full font-black text-xl shadow-2xl hover:shadow-white/30 transition-all relative overflow-hidden">
                <span className="relative z-10">Start Your Journey Today</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-linear-to-r from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/events" className="inline-flex items-center gap-2 px-10 py-6 text-white rounded-full font-bold text-xl border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all">
                Explore Events
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="flex flex-wrap justify-center gap-5 text-sm text-white/70"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.6 }}
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <benefit.icon className="w-4 h-4 text-white/80" />
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
