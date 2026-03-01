'use client';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Target, Heart, Users, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We believe in supporting each other with empathy and understanding',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Together, we are stronger and can achieve more',
    },
    {
      icon: Sparkles,
      title: 'Transformation',
      description: 'Growth and change are possible at any age',
    },
    {
      icon: Target,
      title: 'Purpose',
      description: 'Everyone deserves to live a meaningful and fulfilling life',
    },
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
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-20 relative overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Story
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Empowering individuals over 50 to discover their purpose and live with passion
          </motion.p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20"
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
                  src="https://images.unsplash.com/photo-1580938223816-e4061844d6ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXBvd2VyZWQlMjBzZW5pb3IlMjB3b21hbnxlbnwxfHx8fDE3NzIzNTM1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Founder"
                  className="rounded-3xl shadow-2xl w-full relative z-10"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Meet the Founder</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                After turning 50, our founder experienced a profound realization: this wasn't the 
                end of anything—it was a new beginning. But finding support and resources for this 
                unique life stage was challenging.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                That's why Reinvent You Over 50 was created. We wanted to build a community where 
                people could find the guidance, support, and inspiration they needed to create the 
                life they've always wanted.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, we serve thousands of members worldwide, helping them discover new passions, 
                build meaningful connections, and live with purpose and joy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white p-10 rounded-3xl shadow-xl border border-purple-100"
            >
              <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To provide a supportive community and practical resources that empower individuals 
                over 50 to reinvent themselves, pursue their passions, and create a life filled with 
                purpose, joy, and meaningful connections.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white p-10 rounded-3xl shadow-xl border border-purple-100"
            >
              <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                A world where turning 50 is celebrated as the beginning of the best years of life—
                where age is seen as an advantage, and every individual has the support and resources 
                to thrive.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center group"
              >
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <value.icon className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl mb-2 font-semibold">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 text-white relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="grid md:grid-cols-4 gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { value: '5,000+', label: 'Active Members' },
              { value: '200+', label: 'Monthly Events' },
              { value: '50+', label: 'Countries' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="text-5xl md:text-6xl mb-2 font-bold">{stat.value}</div>
                <div className="text-purple-100 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Making a Difference</h2>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20"
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
                  src="https://images.unsplash.com/photo-1771340591381-e72f1b148b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBldmVudCUyMGdhdGhlcmluZ3xlbnwxfHx8fDE3NzIzNTM1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Community event"
                  className="rounded-3xl shadow-2xl w-full relative z-10"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl md:text-4xl mb-4 font-semibold">Real Stories, Real Transformation</h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Every day, we witness incredible transformations. Members who thought their best years 
                were behind them are starting new businesses, finding love, pursuing creative passions, 
                traveling the world, and building deep friendships.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                This isn't just a community—it's a movement of people proving that life after 50 can 
                be the most vibrant, fulfilling, and exciting chapter yet.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}