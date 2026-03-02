'use client';

import { Check, Star, Sparkles, ArrowRight, Zap, Crown, Users } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export function MembershipPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Community',
      monthlyPrice: 29,
      annualPrice: 290,
      description: 'Perfect for getting started',
      features: [
        'Access to community forum',
        'Weekly virtual meetups',
        'Monthly newsletter',
        'Resource library access',
        'Member directory',
      ],
      popular: false,
      gradient: 'from-blue-500 to-cyan-500',
      icon: Users,
      glow: 'rgba(59,130,246,0.25)',
      cta: 'Get Started',
    },
    {
      name: 'Transformation',
      icon: Sparkles,
      monthlyPrice: 59,
      annualPrice: 590,
      description: 'Our most popular plan',
      features: [
        'Everything in Community',
        'Monthly in-person events',
        'Exclusive workshops',
        'Priority event registration',
        'Transformation workbook (digital)',
        'Group coaching sessions',
      ],
      popular: true,
      gradient: 'from-purple-600 to-pink-600',
      icon: Sparkles,
      glow: 'rgba(124,58,237,0.35)',
      cta: 'Start Transforming',
    },
    {
      name: 'VIP',
      icon: Crown,
      monthlyPrice: 99,
      annualPrice: 990,
      description: 'Complete transformation package',
      features: [
        'Everything in Transformation',
        'Quarterly 1-on-1 coaching session',
        'VIP event access',
        'Physical workbook delivered',
        'Personalized action plan',
        'Direct founder access',
      ],
      popular: false,
      gradient: 'from-amber-500 to-orange-500',
      icon: Crown,
      glow: 'rgba(245,158,11,0.25)',
      cta: 'Go VIP',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      <section className="relative min-h-[55vh] flex items-center overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <motion.div className="orb orb-purple w-[450px] h-[450px] top-[-80px] left-[-80px]"
          animate={{ scale:[1,1.25,1], x:[0,50,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div className="orb orb-pink w-[380px] h-[380px] bottom-[-60px] right-[-60px]"
          animate={{ scale:[1,1.2,1], y:[0,-40,0] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:2 }} />
        {[...Array(8)].map((_,i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width:8, height:8, background:`hsl(${270+i*20},70%,65%)`, left:`${8+i*12}%`, top:`${18+(i%3)*26}%`, opacity:0.4 }}
            animate={{ y:[0,-28,0], scale:[1,1.6,1], opacity:[0.3,0.7,0.3] }}
            transition={{ duration:4+i*0.5, repeat:Infinity, delay:i*0.35, ease:'easeInOut' }} />
        ))}
        <div className="max-w-5xl mx-auto px-6 py-28 text-center relative z-10 w-full">
          <motion.div className="section-label mx-auto mb-8"
            initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5 }}>
            <Sparkles className="w-4 h-4 text-purple-600" />
            Choose Your Plan
          </motion.div>
          <motion.h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-[0.9]"
            initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}>
            <span className="block text-gray-900">Join Our</span>
            <span className="block gradient-text-aurora font-display italic">Community</span>
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.25 }}>
            Choose the membership level that&apos;s right for your transformation journey
          </motion.p>
        </div>
      </section>

      {/* Billing Toggle + Pricing */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="flex justify-center items-center gap-4 mb-16"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <div className="relative flex items-center bg-gray-100 rounded-full p-1.5 shadow-inner">
              {(['monthly','annual'] as const).map((cycle) => (
                <motion.button key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`relative px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 z-10 ${billingCycle===cycle ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                  whileTap={{ scale:0.97 }}>
                  {billingCycle===cycle && (
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg"
                      layoutId="billingPill"
                      transition={{ type:'spring', stiffness:400, damping:30 }} />
                  )}
                  <span className="relative z-10 capitalize">{cycle}</span>
                  {cycle==='annual' && (
                    <span className={`relative z-10 text-xs px-2 py-0.5 rounded-full font-bold ${billingCycle==='annual' ? 'bg-white/25 text-white' : 'bg-green-100 text-green-700'}`}>Save 17%</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants} initial="hidden" animate="visible">
            {plans.map((plan, index) => (
              <motion.div key={index} variants={itemVariants}
                whileHover={{ y:-12, scale:1.02 }}
                className="relative"
                style={{ zIndex: plan.popular ? 10 : 1 }}>
                {plan.popular && (
                  <motion.div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20"
                    initial={{ scale:0, y:10 }} animate={{ scale:1, y:0 }}
                    transition={{ delay:0.5, type:'spring' }}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-60" />
                      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-xl">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Most Popular
                      </div>
                    </div>
                  </motion.div>
                )}
                <div className={`relative h-full rounded-3xl overflow-hidden shadow-2xl ${plan.popular ? 'border-2 border-purple-600 ring-4 ring-purple-100' : 'border-2 border-gray-100'}`}>
                  <div className={`h-1.5 bg-gradient-to-r ${plan.gradient}`} />
                  <div className={`p-8 h-full ${plan.popular ? 'bg-gradient-to-b from-purple-50/50 to-white' : 'bg-white'}`}>
                    <div className="flex items-start gap-4 mb-6">
                      <motion.div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0`}
                        whileHover={{ rotate:15, scale:1.1 }}>
                        <plan.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-gray-500 text-sm">{plan.description}</p>
                      </div>
                    </div>
                    <div className="mb-7">
                      <AnimatePresence mode="wait">
                        <motion.div key={billingCycle}
                          initial={{ opacity:0, y:10, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-10 }}
                          transition={{ duration:0.3 }}>
                          <div className="flex items-baseline gap-1">
                            <span className={`text-6xl font-bold font-display bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                              ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                            </span>
                            <span className="text-gray-400 text-lg">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                          </div>
                          {billingCycle === 'annual' && (
                            <p className="text-sm text-gray-400 mt-1">${(plan.annualPrice/12).toFixed(0)}/month billed annually</p>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <ul className="space-y-3.5 mb-8">
                      {plan.features.map((feature, idx) => (
                        <motion.li key={idx} className="flex items-start gap-3"
                          initial={{ opacity:0, x:-15 }} animate={{ opacity:1, x:0 }}
                          transition={{ duration:0.4, delay:idx*0.06+index*0.1 }}>
                          <div className={`w-5 h-5 bg-gradient-to-br ${plan.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                      <Link href="/booking" className={`relative w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 overflow-hidden ${
                        plan.popular ? 'text-white shadow-xl' : 'border-2 border-gray-200 text-gray-800 hover:border-purple-400 hover:text-purple-600'
                      }`}
                        style={plan.popular ? { background:'linear-gradient(135deg,#7c3aed,#db2777)' } : {}}>
                        {plan.cta ?? 'Get Started'}
                        <ArrowRight className="w-4 h-4" />
                        {plan.popular && <div className="btn-shimmer" />}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50/60 to-white" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-20"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6 }}>
            <div className="section-label mx-auto mb-6">Member Benefits</div>
            <h2 className="font-display text-5xl md:text-6xl font-bold">
              <span className="text-gray-900">What You Get as a </span>
              <span className="gradient-text-aurora font-display italic">Member</span>
            </h2>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Private Community Forum',
                description: 'Connect 24/7 with members in a safe, supportive space',
                gradient: 'from-violet-500 to-purple-600',
              },
              {
                title: 'Weekly Virtual Meetups',
                description: 'Join live video sessions with expert speakers and discussions',
                gradient: 'from-pink-500 to-rose-500',
              },
              {
                title: 'Monthly Events',
                description: 'In-person gatherings in cities nationwide',
                gradient: 'from-amber-500 to-orange-500',
              },
              {
                title: 'Expert Resources',
                description: 'Access our library of guides, videos, and worksheets',
                gradient: 'from-cyan-500 to-teal-500',
              },
              {
                title: 'Accountability Partners',
                description: 'Get matched with someone to support your goals',
                gradient: 'from-emerald-500 to-green-500',
              },
              {
                title: 'Member Discounts',
                description: 'Special pricing on workshops, events, and products',
                gradient: 'from-blue-500 to-indigo-500',
              },
            ].map((benefit, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y:-10, scale:1.02 }}
                className="card-elevated relative overflow-hidden group">
                <div className={`h-1 bg-linear-to-r ${benefit.gradient} absolute top-0 left-0 right-0`} />
                <div className="px-7 pt-8 pb-7">
                  <div className={`w-12 h-12 bg-linear-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2.5 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-16"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6 }}>
            <div className="section-label mx-auto mb-6">Questions</div>
            <h2 className="font-display text-5xl md:text-6xl font-bold">
              <span className="text-gray-900">Frequently </span>
              <span className="gradient-text-purple font-display italic">Asked</span>
            </h2>
          </motion.div>
          <div className="space-y-6">
            {[
              {
                q: 'Can I change my membership level?',
                a: 'Yes! You can upgrade or downgrade your membership at any time.',
              },
              {
                q: 'Is there a free trial?',
                a: 'We offer a 14-day money-back guarantee on all memberships.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. You can cancel your membership at any time with no penalties.',
              },
              {
                q: 'Are the virtual events recorded?',
                a: 'Yes, all virtual events are recorded and available to members for 30 days.',
              },
            ].map((faq, index) => (
              <motion.div key={index}
                className="card-bordered relative overflow-hidden group"
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ duration:0.5, delay:index*0.1 }}
                whileHover={{ x:6 }}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-display text-lg font-bold mb-2 text-gray-900">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 animate-aurora" />
        <div className="absolute inset-0 bg-noise opacity-20" />
        {[...Array(14)].map((_,i) => (
          <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
            style={{ left:`${4+i*7}%`, top:`${15+(i%5)*18}%` }}
            animate={{ y:[0,-25,0], opacity:[0.2,0.7,0.2] }}
            transition={{ duration:3+i*0.35, repeat:Infinity, delay:i*0.25 }} />
        ))}
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div className="section-label mx-auto mb-8 border-white/30 text-white"
            style={{ background:'rgba(255,255,255,0.1)' }}
            initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}>
            <Sparkles className="w-4 h-4" />
            Ready to Transform?
          </motion.div>
          <motion.h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.7 }}>
            Start Your Journey
            <br />
            <span className="relative inline-block">
              <span className="font-display italic" style={{ color:'#fde68a', textShadow:'0 0 40px rgba(253,230,138,0.5), 0 0 80px rgba(251,191,36,0.3)' }}>Today</span>
            </span>
          </motion.h2>
          <motion.p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.2 }}>
            Join thousands transforming their lives with our warm, supportive community
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-5 justify-center"
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.4 }}>
            <motion.a href="#" className="inline-flex items-center gap-2 bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all"
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
              Choose Your Plan <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
              <Link href="/about" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/30 transition-all">
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}