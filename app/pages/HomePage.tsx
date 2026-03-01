'use client';

import Link from 'next/link';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Users, Calendar, BookOpen, Video, Award, Heart, ArrowRight, Star, CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export function HomePage() {
  const features = [
    {
      icon: Users,
      title: 'Vibrant Community',
      description: 'Connect with like-minded individuals on the same journey',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Calendar,
      title: 'Regular Events',
      description: 'Virtual and in-person gatherings to support your growth',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: BookOpen,
      title: 'Transformation Workbook',
      description: 'Guided exercises to help you discover your new path',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Video,
      title: '1-on-1 Coaching',
      description: 'Personalized sessions to accelerate your transformation',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const stats = [
    { value: '5,000+', label: 'Active Members', icon: Users },
    { value: '98%', label: 'Success Rate', icon: TrendingUp },
    { value: '200+', label: 'Monthly Events', icon: Calendar },
    { value: '50+', label: 'Countries', icon: Award },
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      age: 58,
      role: 'Entrepreneur',
      image: 'https://images.unsplash.com/photo-1738943892652-5ac88beb6c35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvbGRlciUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyMzU1NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      text: "This community changed my life. I've discovered passions I didn't know I had and started my own business!",
      rating: 5,
    },
    {
      name: 'David Richardson',
      age: 62,
      role: 'Retired Executive',
      image: 'https://images.unsplash.com/photo-1584940121730-93ffb8aa88b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjBwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzIzNTU1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      text: "The workbook and coaching gave me clarity on my next chapter. Best investment I've made in myself.",
      rating: 5,
    },
    {
      name: 'Linda Kennedy',
      age: 55,
      role: 'Author & Speaker',
      image: 'https://images.unsplash.com/photo-1758686254593-7c4cd55b2621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjB3b21hbiUyMHNtaWxpbmclMjBjb25maWRlbnR8ZW58MXx8fHwxNzcyMzU1NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      text: "I've made incredible friends and found a new sense of purpose. This is more than a community—it's a family.",
      rating: 5,
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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Trust Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-purple-100"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-700">Trusted by 5,000+ Members Worldwide</span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="block text-gray-900">Your Best Years</span>
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Are Still Ahead
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Join a vibrant community of empowered individuals over 50 who are reinventing themselves and creating extraordinary lives.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/membership"
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all overflow-hidden"
                  >
                    <span className="relative z-10">Start Your Journey</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/workbook"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg border-2 border-purple-600 hover:bg-purple-50 transition-all shadow-lg"
                  >
                    Get Free Guide
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex flex-wrap gap-6 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <benefit.icon className="w-5 h-5 text-green-500" />
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1595529056838-5dd92007644d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjB3b21hbiUyMG92ZXIlMjA1MHxlbnwxfHx8fDE3NzIzNTM1ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Confident woman over 50"
                  className="rounded-3xl shadow-2xl w-full relative z-10"
                />
                {/* Floating Stats Cards */}
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-100"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">5,000+</div>
                  <div className="text-sm text-gray-600 font-medium">Active Members</div>
                </motion.div>
                <motion.div
                  className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-100"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">4.9/5 Rating</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
                whileHover={{ y: -10 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-purple-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              Everything You Need
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl mb-6">
              <span className="block text-gray-900">Transform Your Life</span>
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">With Expert Support</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Access world-class tools, resources, and a supportive community designed specifically for your transformation journey.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity`} />
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjBhZHVsdHMlMjBjb21tdW5pdHklMjBncm91cHxlbnwxfHx8fDE3NzIzNTM1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Community gathering"
                className="rounded-3xl shadow-2xl w-full relative z-10"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                Community-Powered
              </motion.div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6">
                <span className="block text-gray-900">You're Not Alone</span>
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">On This Journey</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with hundreds of individuals who understand what you're going through and are committed to growth, support, and celebrating wins together.
              </p>

              <motion.div
                className="space-y-6 mb-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { icon: Award, text: 'Weekly virtual meetups with expert speakers', color: 'from-purple-500 to-pink-500' },
                  { icon: Heart, text: 'Private member forum for 24/7 support', color: 'from-pink-500 to-red-500' },
                  { icon: Users, text: 'Matched with accountability partners', color: 'from-blue-500 to-purple-500' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-4 group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-lg text-gray-700 leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/membership"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  Join the Community
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              Success Stories
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl mb-6">
              <span className="block text-gray-900">Real People,</span>
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Real Transformations</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur opacity-50" />
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white relative z-10"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} • Age {testimonial.age}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl mb-8 font-bold"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Transform Your Life?
          </motion.h2>
          <motion.p
            className="text-2xl md:text-3xl mb-12 text-purple-100 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join 5,000+ people over 50 who are living their best lives
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/50 transition-all"
              >
                Start Your Journey Today
                <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-10 py-5 bg-purple-700 text-white rounded-full font-bold text-xl border-2 border-white hover:bg-purple-800 transition-all"
              >
                Explore Events
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-purple-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <benefit.icon className="w-5 h-5" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
