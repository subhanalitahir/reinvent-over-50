'use client';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Target, Heart, Users, Sparkles, Quote, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { BannerStrip } from '../components/BannerStrip';

export function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Confidence',
      description: 'We encourage women to embrace their strength, rediscover their voice, and step forward with renewed self-belief.',
      gradient: 'from-fuchsia-500 to-pink-600',
      glow: 'rgba(217,70,239,0.3)',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Together we support one another through shared experiences, encouragement, and meaningful connections.',
      gradient: 'from-violet-500 to-purple-600',
      glow: 'rgba(139,92,246,0.3)',
    },
    {
      icon: Sparkles,
      title: 'Growth   ',
      description: 'Reinvention means continuing to evolve, learn, and pursue new dreams at every stage of life.',
      gradient: 'from-purple-500 to-fuchsia-500',
      glow: 'rgba(168,85,247,0.3)',
    },
    {
      icon: Target,
      title: 'Purpose',
      description: 'We believe every woman deserves a life filled with purpose, passion, and meaningful impact.',
      gradient: 'from-cyan-500 to-teal-500',
      glow: 'rgba(6,182,212,0.3)',
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
      <BannerStrip placement="about" />
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-linear-to-br from-purple-50 via-pink-50 to-fuchsia-50">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <motion.div className="orb orb-purple w-125 h-125 -top-30 -right-25"
          animate={{ scale:[1,1.25,1], x:[0,-40,0], y:[0,30,0] }}
          transition={{ duration:14, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div className="orb orb-pink w-95 h-95 -bottom-20 -left-15"
          animate={{ scale:[1,1.2,1], y:[0,-40,0], x:[0,30,0] }}
          transition={{ duration:11, repeat:Infinity, ease:'easeInOut', delay:2 }} />
        {[...Array(10)].map((_,i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: 6+i%3*4, height: 6+i%3*4, background:`hsl(${270+i*18},70%,65%)`, left:`${6+i*10}%`, top:`${15+(i%3)*28}%`, opacity:0.45 }}
            animate={{ y:[0,-30,0], x:[0,(i%2===0?12:-12),0], scale:[1,1.5,1], opacity:[0.35,0.7,0.35] }}
            transition={{ duration:4+i*0.6, repeat:Infinity, delay:i*0.35, ease:'easeInOut' }} />
        ))}
        <div className="max-w-5xl mx-auto px-6 py-32 text-center relative z-10 w-full">
          <motion.div className="section-label mx-auto mb-8"
            initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5 }}>
            <Sparkles className="w-4 h-4 text-purple-600" />
            Our Story
          </motion.div>
          <motion.h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-[0.9]"
            initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}>
            <span className="block text-gray-900">Rewriting</span>
            <span className="block gradient-text-aurora font-display italic">What&apos;s Possible</span>
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.25 }}>
Empowering women over 50 to rediscover confidence, purpose, and create a life filled with growth and meaning.
          </motion.p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-25" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease:[0.16,1,0.3,1] }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-3 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-20"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)' }}
                  animate={{ borderRadius:['40% 60% 70% 30% / 40% 50% 60% 50%','60% 40% 30% 70% / 50% 60% 40% 50%','40% 60% 70% 30% / 40% 50% 60% 50%'] }}
                  transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }} />
                <motion.div
                  className="absolute -inset-2 bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl blur-lg opacity-10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <ImageWithFallback
                  src="/img/founder-copy.png"
                  alt="Founder"
                  className="rounded-3xl shadow-2xl w-full max-h-[700px] object-fit object-top relative z-10"
                />
                <motion.div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-2xl border border-purple-100 max-w-50 z-20"
                  initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
                  transition={{ delay:0.5, type:'spring' }}>
                  <Quote className="w-5 h-5 text-purple-400 mb-2" />
                  <p className="text-sm text-gray-700 font-medium italic leading-relaxed">&ldquo;Life after 50 is just the beginning.&rdquo;</p>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease:[0.16,1,0.3,1] }}
            >
              <div className="section-label mb-6">
                <Star className="w-4 h-4 text-purple-600" />
                Meet the Founder
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-8 leading-tight">
                <span className="text-gray-900">A Story of </span>
                <span className="gradient-text-purple font-display italic">Reinvention</span>
              </h2>
              <div className="space-y-5 mb-10">
                <p className="text-lg text-gray-700 leading-relaxed">
                  After turning 50, I realized something powerful &mdash; life wasn&apos;t slowing down, it was opening the door to a brand new chapter filled with growth, opportunity, and self-discovery.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  That realization inspired me to create Reinvent You 50+, a space where women can find encouragement, connection, and the confidence to redefine what life looks like after 50.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Today, this movement continues to grow as women from around the world come together to rediscover their passions, build meaningful connections, and step boldly into their next chapter.
                </p>
              </div>
              <Link href="/membership">
                <motion.div className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold text-lg shadow-2xl relative overflow-hidden group"
                  style={{ background:'linear-gradient(135deg,#7c3aed 0%,#db2777 100%)' }}
                  whileHover={{ scale:1.05, boxShadow:'0 20px 60px rgba(124,58,237,0.4)' }}
                  whileTap={{ scale:0.98 }}>
                  <span className="relative z-10">Join Our Community</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="btn-shimmer" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-pink-50/60 to-fuchsia-50/40" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-16"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6 }}>
            <div className="section-label mx-auto mb-6">Our Foundation</div>
            <h2 className="font-display text-5xl md:text-6xl font-bold">
              <span className="text-gray-900">What Drives </span>
              <span className="gradient-text-purple font-display italic">Us Forward</span>
            </h2>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="card-elevated relative overflow-hidden"
            >
              <div className="h-1.5 bg-linear-to-r from-purple-500 to-pink-600 absolute top-0 left-0 right-0" />
              <div className="px-8 pt-10 pb-8">
                <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-5 bg-linear-to-r from-purple-500 to-pink-500">
                  Our Mission
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-5 text-gray-900">Empower Every Women</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                 Empower women over 50 with the support, inspiration, and resources needed to rediscover purpose, embrace growth, and build a fulfilling next chapter.
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="card-elevated relative overflow-hidden"
            >
              <div className="h-1.5 bg-linear-to-r from-fuchsia-500 to-purple-600 absolute top-0 left-0 right-0" />
              <div className="px-8 pt-10 pb-8">
                <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-5 bg-linear-to-r from-fuchsia-500 to-purple-500">
                  Our Vision
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-5 text-gray-900">Redefine Age</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  A world where turning 50 is celebrated as the beginning of a powerful new season — filled with confidence, opportunity, and personal transformation.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label mx-auto mb-6">Core Values</div>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
              <span className="text-gray-900">The Principles That </span>
              <span className="gradient-text-aurora font-display italic">Guide Us</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Everything we do is built on the belief that reinvention and growth have no age limit.</p>
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
                whileHover={{ y: -12, scale: 1.03 }}
                className="text-center group p-6 card-bordered relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                  style={{ background:`radial-gradient(circle at 50% 0%, ${value.glow ?? 'rgba(124,58,237,0.3)'}, transparent 70%)` }} />
                <motion.div
                  className={`w-20 h-20 bg-linear-to-br ${value.gradient ?? 'from-purple-500 to-pink-500'} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl`}
                  whileHover={{ rotate: 360, scale:1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <value.icon className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="font-display text-xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 animate-aurora" />
        <div className="absolute inset-0 bg-noise opacity-20" />
        <motion.div className="absolute top-0 right-0 w-100 h-100 rounded-full blur-[80px] opacity-25"
          style={{ background:'radial-gradient(circle,rgba(255,255,255,0.3) 0%,transparent 70%)' }}
          animate={{ scale:[1,1.3,1], x:[0,60,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-14"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6 }}>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-3">
              Our Community, <span className="font-display italic">By the Numbers</span>
            </h2>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { value: '300+', label: 'Active Members' },
              { value: '50+', label: 'Monthly Events' },
              { value: '5+', label: 'Countries' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y:-8, scale:1.05 }}
                className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all">
                  <div className="number-display text-5xl md:text-6xl text-white mb-3 font-display">{stat.value}</div>
                  <div className="text-purple-200 text-lg font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label mx-auto mb-6">Real Impact</div>
            <h2 className="font-display text-5xl md:text-6xl font-bold">
              <span className="text-gray-900">Making a </span>
              <span className="gradient-text-aurora font-display italic">Difference</span>
            </h2>
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
                  className="absolute -inset-4 bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20"
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
              <h3 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                Real Stories, <br />
                <span className="gradient-text-purple font-display italic">Real Transformation</span>
              </h3>
              <div className="space-y-5 mb-10">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Every day we see inspiring transformations. Women who once felt uncertain are now starting businesses, building communities, exploring passions, and creating fulfilling lives.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Reinvent You 50+ is more than a community — it’s a movement proving that life after 50 can be powerful, joyful, and full of new possibilities.
                </p>
              </div>
              <motion.div className="card-bordered relative" whileHover={{ y:-6 }}>
                <div className="text-5xl text-purple-200 font-display leading-none mb-3 font-bold">&ldquo;</div>
                <p className="text-lg text-gray-700 italic leading-relaxed mb-4">
                  &ldquo;I found my tribe here. These people helped me launch my second career and discover passions I never knew I had. This community changed my life.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">M</div>
                  <div>
                    <div className="font-bold text-gray-900">Margaret T.</div>
                    <div className="text-sm text-gray-500">Member since 2022 &middot; Age 58</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}