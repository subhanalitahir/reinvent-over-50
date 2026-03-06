'use client';

import { Check, Star, Sparkles, ArrowRight, Zap, Crown, Users, Shield, TrendingUp, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { EmailModal } from '../components/EmailModal';
import { useAuth } from '../context/AuthContext';

interface ApiMembershipPrices {
  community?: { monthly?: number; annual?: number };
  growth?: { monthly?: number; annual?: number };
  transformation?: { monthly?: number; annual?: number };
  vip?: { monthly?: number; annual?: number };
}

export function MembershipPage() {
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [apiPrices, setApiPrices] = useState<ApiMembershipPrices | null>(null);

  useEffect(() => {
    fetch('/api/pricing')
      .then(r => r.json())
      .then(j => { if (j?.data?.membership) setApiPrices(j.data.membership); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const successParam = searchParams.get('success');
    const sessionId = searchParams.get('session_id');
    if (successParam === 'true') {
      setSuccess(true);
      // Verify with backend so the welcome email is sent
      if (sessionId) {
        fetch(`/api/checkout/verify?session_id=${sessionId}`).catch(() => {});
      }
    }
    if (searchParams.get('canceled') === 'true') setError('Payment was cancelled. You can try again.');
  }, [searchParams]);

  const doCheckout = async (planKey: string, email?: string) => {
    setLoadingPlan(planKey);
    setError('');
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const body: Record<string, string> = { plan: planKey, billingCycle };
      if (email) body.email = email;
      const res = await fetch('/api/checkout/membership', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Checkout failed');
      if (data.data?.url) window.location.href = data.data.url;
      else if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setModalOpen(false);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCheckout = (planKey: string) => {
    setError('');
    if (user && token) {
      // Authenticated: call API directly with the Bearer token
      doCheckout(planKey);
    } else {
      // Guest: collect email via modal
      setPendingPlan(planKey);
      setModalOpen(true);
    }
  };

  const handleModalSubmit = async (email: string) => {
    if (!pendingPlan) return;
    setModalOpen(false);
    await doCheckout(pendingPlan, email);
  };

  const plans = [
    {
      name: 'Community',
      key: 'community',
      monthlyPrice: apiPrices?.community?.monthly != null ? apiPrices.community.monthly / 100 : 29,
      annualPrice: apiPrices?.community?.annual != null ? apiPrices.community.annual / 100 : 290,
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
      key: 'transformation',
      icon: Sparkles,
      monthlyPrice: apiPrices?.transformation?.monthly != null ? apiPrices.transformation.monthly / 100 : 59,
      annualPrice: apiPrices?.transformation?.annual != null ? apiPrices.transformation.annual / 100 : 590,
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
      glow: 'rgba(124,58,237,0.35)',
      cta: 'Start Transforming',
    },
    {
      name: 'VIP',
      key: 'vip',
      icon: Crown,
      monthlyPrice: apiPrices?.vip?.monthly != null ? apiPrices.vip.monthly / 100 : 99,
      annualPrice: apiPrices?.vip?.annual != null ? apiPrices.vip.annual / 100 : 990,
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
      {/* Success Banner */}
      {success && (
        <motion.div className="bg-linear-to-r from-green-500 to-emerald-500 text-white py-6 text-center"
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-3">
            <CheckCircle className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Welcome to the Community!</h2>
            <p className="text-green-100">Your membership is active. Check your email for details and next steps.</p>
          </div>
        </motion.div>
      )}
      {/* Error Banner */}
      {error && !success && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 py-4 text-center text-sm font-medium">
          {error}
        </div>
      )}
      {/* Hero Section */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden bg-linear-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <motion.div className="orb orb-purple w-112.5 h-112.5 -top-20 -left-20"
          animate={{ scale:[1,1.25,1], x:[0,50,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div className="orb orb-pink w-95 h-95 -bottom-15 -right-15"
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
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #fdf2f8 40%, #fff7ed 80%, #ffffff 100%)' }}>
        <div className="absolute inset-0 bg-dot-pattern opacity-25" />
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.5), transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(219,39,119,0.4), transparent 70%)' }} />
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
                    <motion.div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-full shadow-lg"
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
          <motion.div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-end"
            variants={containerVariants} initial="hidden" animate="visible">
            {plans.map((plan, index) => (
              <motion.div key={index} variants={itemVariants}
                whileHover={{ y: plan.popular ? -8 : -14, scale: plan.popular ? 1.01 : 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative"
                style={{ zIndex: plan.popular ? 10 : 1 }}>

                {/* Glow blob behind card */}
                <div className="absolute -inset-1 rounded-[28px] blur-2xl opacity-30 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse, ${plan.glow}, transparent 70%)`, transform: 'translateY(12px) scale(0.92)' }} />

                {/* Popular badge */}
                {plan.popular && (
                  <motion.div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30"
                    initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 400 }}>
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full blur-lg opacity-80"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)' }} />
                      <div className="relative text-white px-6 py-2 rounded-full text-sm font-black flex items-center gap-1.5 shadow-2xl tracking-wide"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)' }}>
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Most Popular
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Card */}
                <div className={`relative h-full rounded-3xl overflow-hidden ${
                  plan.popular
                    ? 'shadow-[0_32px_80px_rgba(124,58,237,0.40)]'
                    : 'shadow-[0_8px_40px_rgba(0,0,0,0.10)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.16)]'
                } transition-shadow duration-300`}>

                  {/* Popular = dark gradient card; others = white card with coloured top bar */}
                  {plan.popular ? (
                    <div className="relative h-full" style={{ background: 'linear-gradient(160deg,#1e0a3c 0%,#3b0764 45%,#6d1d5a 100%)' }}>
                      {/* Mesh noise overlay */}
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(219,39,119,0.2) 0%, transparent 50%)' }} />
                      {/* Top accent line */}
                      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777,#f59e0b)' }} />

                      <div className="p-8 relative z-10">
                        {/* Icon + name */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)' }}>
                            <plan.icon className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="font-display text-2xl font-bold text-white">{plan.name}</h3>
                            <p className="text-purple-300 text-sm">{plan.description}</p>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.15),transparent)' }} />

                        {/* Price */}
                        <div className="mb-7">
                          <AnimatePresence mode="wait">
                            <motion.div key={billingCycle}
                              initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-7xl font-black font-display text-white tracking-tight">
                                  ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                                </span>
                                <span className="text-purple-300 text-xl font-semibold">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                              </div>
                              {billingCycle === 'annual' && (
                                <p className="text-purple-300 text-sm mt-1">${(plan.annualPrice / 12).toFixed(0)}/mo billed annually</p>
                              )}
                            </motion.div>
                          </AnimatePresence>
                          <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-white/80 font-semibold">14-day free trial</span>
                          </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3.5 mb-8">
                          {plan.features.map((feature, idx) => (
                            <motion.li key={idx} className="flex items-start gap-3"
                              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: idx * 0.06 + 0.2 }}>
                              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)' }}>
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-purple-100 text-sm leading-relaxed">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <motion.button
                          onClick={() => handleCheckout(plan.name.toLowerCase())}
                          disabled={loadingPlan === plan.name.toLowerCase()}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          className="relative w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-2xl"
                          style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777,#f59e0b)' }}>
                          <span className="relative z-10">{loadingPlan === plan.name.toLowerCase() ? 'Redirecting…' : (plan.cta ?? 'Get Started')}</span>
                          {loadingPlan !== plan.name.toLowerCase() && <ArrowRight className="w-4 h-4 relative z-10" />}
                          <div className="btn-shimmer" />
                        </motion.button>

                        <p className="text-center text-purple-400 text-xs mt-3 font-medium">Cancel anytime · No lock-in</p>
                      </div>
                    </div>

                  ) : (
                    /* Light card for Community & VIP */
                    <div className="relative h-full bg-white">
                      {/* Coloured top bar */}
                      <div className={`h-1.5 bg-linear-to-r ${plan.gradient}`} />

                      {/* Subtle coloured wash in top area */}
                      <div className="absolute top-1.5 left-0 right-0 h-32 opacity-5"
                        style={{ background: `linear-gradient(180deg, ${plan.glow}, transparent)` }} />

                      <div className="p-8 relative z-10 h-full flex flex-col">
                        {/* Icon + name */}
                        <div className="flex items-center gap-4 mb-6">
                          <motion.div className={`w-14 h-14 bg-linear-to-br ${plan.gradient} rounded-2xl flex items-center justify-center shadow-lg shrink-0`}
                            whileHover={{ rotate: 10, scale: 1.1 }}>
                            <plan.icon className="w-7 h-7 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="font-display text-2xl font-bold text-gray-900">{plan.name}</h3>
                            <p className="text-gray-400 text-sm">{plan.description}</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mb-7">
                          <AnimatePresence mode="wait">
                            <motion.div key={billingCycle}
                              initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}>
                              <div className="flex items-baseline gap-1">
                                <span className={`text-6xl font-black font-display bg-linear-to-r ${plan.gradient} bg-clip-text text-transparent tracking-tight`}>
                                  ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                                </span>
                                <span className="text-gray-400 text-lg font-semibold">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                              </div>
                              {billingCycle === 'annual' && (
                                <p className="text-sm text-gray-400 mt-1">${(plan.annualPrice / 12).toFixed(0)}/mo billed annually</p>
                              )}
                            </motion.div>
                          </AnimatePresence>
                          <div className="mt-3 inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                            <Zap className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 font-semibold">14-day free trial</span>
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="h-px bg-gray-100 mb-6" />

                        {/* Features */}
                        <ul className="space-y-3.5 mb-8 flex-1">
                          {plan.features.map((feature, idx) => (
                            <motion.li key={idx} className="flex items-start gap-3"
                              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: idx * 0.06 + index * 0.1 }}>
                              <div className={`w-5 h-5 bg-linear-to-br ${plan.gradient} rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-gray-600 text-sm leading-relaxed">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <motion.button
                          onClick={() => handleCheckout(plan.name.toLowerCase())}
                          disabled={loadingPlan === plan.name.toLowerCase()}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          className={`relative w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed transition-all group`}
                          style={{ background: `linear-gradient(135deg, ${plan.glow.replace('0.25','0.08').replace('0.35','0.08')}, transparent)`, border: `2px solid ${plan.glow.replace('0.25','0.4').replace('0.35','0.6')}` }}>
                          <span className={`bg-linear-to-r ${plan.gradient} bg-clip-text text-transparent font-black text-base`}>
                            {loadingPlan === plan.name.toLowerCase() ? 'Redirecting…' : (plan.cta ?? 'Get Started')}
                          </span>
                          {loadingPlan !== plan.name.toLowerCase() && (
                            <ArrowRight className={`w-4 h-4 bg-linear-to-r ${plan.gradient} bg-clip-text text-transparent`} style={{ color: index === 0 ? '#3b82f6' : '#f59e0b' }} />
                          )}
                        </motion.button>
                        <p className="text-center text-gray-400 text-xs mt-3 font-medium">Cancel anytime · No lock-in</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-pink-50/60 to-white" />
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
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-purple-500 to-pink-500 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-display text-lg font-bold mb-2 text-gray-900">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 30%, #9d174d 70%, #be185d 100%)' }}>
        {/* Animated glow orbs */}
        <div className="absolute -top-32 -left-32 w-125 h-125 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -right-24 w-105 h-105 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-75 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.08) 0%, transparent 70%)' }} />
        {/* Floating dots */}
        {[...Array(14)].map((_,i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width:`${3+(i%3)*2}px`, height:`${3+(i%3)*2}px`, background:'rgba(255,255,255,0.45)', left:`${4+i*7}%`, top:`${10+(i%5)*18}%` }}
            animate={{ y:[0,-28,0], opacity:[0.2,0.8,0.2] }}
            transition={{ duration:3+i*0.35, repeat:Infinity, delay:i*0.25 }} />
        ))}

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          {/* Label */}
          <motion.div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-semibold tracking-widest uppercase mb-10"
            initial={{ opacity:0, scale:0.85 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
            transition={{ duration:0.5 }}>
            <Sparkles className="w-4 h-4 text-yellow-300" />
            Ready to Transform?
          </motion.div>

          {/* Headline */}
          <motion.h2 className="font-display font-extrabold leading-none mb-6"
            initial={{ opacity:0, y:35 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.75, ease:[0.16,1,0.3,1] }}>
            <span className="block text-5xl md:text-7xl lg:text-8xl text-white tracking-tight">Start Your Journey</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black italic mt-1" style={{ color:'#fde68a', textShadow:'0 0 50px rgba(253,230,138,0.6), 0 0 100px rgba(251,191,36,0.35)' }}>Today</span>
          </motion.h2>

          {/* Sub-copy */}
          <motion.p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.2 }}>
            Join <span className="text-yellow-300 font-bold">5,000+</span> people over 50 who are reinventing themselves — and loving every step.
          </motion.p>

          {/* Trust strip */}
          <motion.div className="flex flex-wrap justify-center gap-6 mb-12"
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.3 }}>
            {[
              { icon: Star, label:'4.9/5 Rating', sub:'From 2,400+ reviews' },
              { icon: Shield, label:'30-Day Guarantee', sub:'No questions asked' },
              { icon: TrendingUp, label:'98% Success Rate', sub:'Member-reported' },
              { icon: Users, label:'5,000+ Members', sub:'In 50+ countries' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-yellow-300" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-sm leading-tight">{label}</div>
                  <div className="text-purple-200 text-xs">{sub}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.45 }}>
            <motion.a href="#plans"
              className="inline-flex items-center gap-2 bg-white text-purple-700 px-10 py-5 rounded-full font-extrabold text-lg shadow-2xl"
              style={{ boxShadow:'0 0 40px rgba(255,255,255,0.25)' }}
              whileHover={{ scale:1.06, boxShadow:'0 0 60px rgba(255,255,255,0.4)' }} whileTap={{ scale:0.96 }}>
              Choose Your Plan <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}>
              <Link href="/about" className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white border-2 border-white/40 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/25 transition-all">
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          {/* Micro trust line */}
          <motion.p className="text-purple-200/70 text-sm mt-8"
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.6 }}>
            Cancel anytime &nbsp;·&nbsp; No credit card required to browse &nbsp;·&nbsp; Instant access
          </motion.p>
        </div>
      </section>
      <EmailModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setPendingPlan(null); }}
        onSubmit={handleModalSubmit}
        title="Almost there!"
        subtitle="Enter your email to activate your membership. We'll send your welcome package here."
        ctaLabel="Join Now →"
        loading={loadingPlan !== null}
      />
    </div>
  );
}