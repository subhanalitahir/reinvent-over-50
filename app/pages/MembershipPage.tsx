'use client';

import { Check, Star } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

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
    },
    {
      name: 'Transformation',
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
    },
    {
      name: 'VIP',
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
      gradient: 'from-orange-500 to-red-500',
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
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-20 relative overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
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
            Join Our Community
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose the membership level that's right for your journey
          </motion.p>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex justify-center items-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-full transition-all font-medium ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Monthly
            </motion.button>
            <motion.button
              onClick={() => setBillingCycle('annual')}
              className={`px-8 py-3 rounded-full transition-all font-medium flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Annual
              <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                Save 17%
              </span>
            </motion.button>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`card-shine relative bg-white rounded-3xl shadow-2xl p-8 ${
                  plan.popular ? 'border-4 border-purple-600' : 'border-2 border-gray-200'
                }`}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </motion.div>
                )}

                <div className="text-center mb-6">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="text-2xl text-white font-bold">{plan.name[0]}</span>
                  </motion.div>
                  <h3 className="text-3xl mb-2 font-bold">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <motion.span
                      className={`text-6xl bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent font-bold`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                    </motion.span>
                    <span className="text-gray-600 text-lg">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-sm text-gray-500">
                      ${(plan.annualPrice / 12).toFixed(2)}/month billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <Check className={`w-5 h-5 bg-gradient-to-br ${plan.gradient} bg-clip-text text-transparent flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  className={`w-full py-4 rounded-xl transition-all font-medium text-lg shadow-lg ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-2xl`
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              What You Get as a Member
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
              },
              {
                title: 'Weekly Virtual Meetups',
                description: 'Join live video sessions with expert speakers and discussions',
              },
              {
                title: 'Monthly Events',
                description: 'In-person gatherings in cities nationwide',
              },
              {
                title: 'Expert Resources',
                description: 'Access our library of guides, videos, and worksheets',
              },
              {
                title: 'Accountability Partners',
                description: 'Get matched with someone to support your goals',
              },
              {
                title: 'Member Discounts',
                description: 'Special pricing on workshops, events, and products',
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.05 }}
                className="card-shine bg-white p-8 rounded-3xl shadow-xl border border-purple-100 hover:shadow-2xl hover:border-purple-200 transition-all"
              >
                <h3 className="text-xl mb-3 font-semibold">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h2>
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
              <motion.div
                key={index}
                className="border-b border-gray-200 pb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <h3 className="text-xl mb-2 font-semibold">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl mb-6 font-bold"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Join?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 text-purple-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Start your transformation journey today with our supportive community
          </motion.p>
          <motion.button
            className="bg-white text-purple-600 px-10 py-4 rounded-full hover:bg-gray-100 transition-all shadow-2xl text-lg font-medium"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Choose Your Plan
          </motion.button>
        </div>
      </section>
    </div>
  );
}