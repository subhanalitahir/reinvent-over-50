'use client';

import { Mail, Phone, MapPin, Send, Clock, MessageCircle, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');
    try {
      const res = await fetch(`/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Failed to send message');
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 4000);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactCards = [
    { icon: Mail, title: 'Email Us', detail: 'info@reinventyou50.com', sub: 'Response within 24 hours', gradient: 'from-purple-500 to-pink-500', bg: 'from-purple-50 to-pink-50' },
    { icon: Phone, title: 'Call Us', detail: '(555) 123-4567', sub: 'Mon–Fri: 9 AM – 5 PM', gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50' },
    { icon: MapPin, title: 'Visit Us', detail: 'Community Events & Meetups', sub: 'Various Locations', gradient: 'from-fuchsia-500 to-purple-500', bg: 'from-fuchsia-50 to-purple-50' },
    { icon: Clock, title: 'Office Hours', detail: 'Mon–Fri: 9 AM – 5 PM', sub: 'Sat: 10 AM – 2 PM', gradient: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50' },
  ];

  const faqs = [
    { q: 'How quickly will I get a response?', a: 'We usually reply to messages within 24 hours during business days. ' },
    { q: 'Can I schedule a call?', a: "Yes. You can book a one-on-one session directly through our website." },
    { q: 'Do you offer refunds?', a: 'Please contact us regarding refund requests and we’ll review your situation.' },
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center bg-linear-to-br from-purple-50 via-pink-50 to-fuchsia-50 overflow-hidden">
        <motion.div className="orb orb-purple w-96 h-96 -top-20 -left-20" animate={{ scale: [1,1.3,1], x:[0,40,0], y:[0,30,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div className="orb orb-pink w-80 h-80 -bottom-15 -right-15" animate={{ scale:[1,1.2,1], x:[0,-30,0], y:[0,-20,0] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:2 }} />
        {[...Array(8)].map((_,i) => (
          <motion.div key={i} className="absolute w-3 h-3 rounded-full" style={{ background:`hsl(${270+i*20},70%,60%)`, left:`${10+i*11}%`, top:`${20+(i%3)*25}%`, opacity:0.4 }}
            animate={{ y:[0,-30,0], x:[0,(i%2===0?15:-15),0], scale:[1,1.4,1], opacity:[0.4,0.8,0.4] }}
            transition={{ duration:4+i*0.5, repeat:Infinity, delay:i*0.3, ease:'easeInOut' }} />
        ))}
        <div className="max-w-5xl mx-auto px-6 py-24 text-center relative z-10 w-full">
          <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-purple-100" initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5 }}>
            <MessageCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">We&apos;d love to hear from you</span>
          </motion.div>
          <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}>
            <span className="block text-gray-900">Get In</span>
            <span className="block bg-linear-to-r from-purple-600 via-pink-600 to-fuchsia-500 bg-clip-text text-transparent">Touch</span>
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.3 }}>
Have a question about events, membership, or the workbook? Our team is happy to help and will respond as soon as possible.

          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      {/* <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once:true }}>
            {contactCards.map((card, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y:-8, scale:1.02 }}
                className={`card-shine group relative bg-linear-to-br ${card.bg} rounded-3xl p-8 border border-white shadow-xl hover:shadow-2xl transition-all glow-border-purple`}>
                <motion.div className={`w-14 h-14 bg-linear-to-br ${card.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg`} whileHover={{ rotate:360 }} transition={{ duration:0.6 }}>
                  <card.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-gray-800 font-semibold mb-1">{card.detail}</p>
                <p className="text-sm text-gray-500">{card.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Form + Side */}
      <section className="py-24 bg-linear-to-br from-gray-50 via-purple-50/20 to-pink-50/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            {/* Form */}
            <motion.div className="lg:col-span-3" initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}>
              <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-purple-100 to-pink-100 rounded-bl-[120px] opacity-50" />
                <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6" initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}>
                  <Sparkles className="w-4 h-4" />
                  Send Us a Message
                </motion.div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Let&apos;s Talk</h2>
                <p className="text-gray-500 mb-8">Fill in the form and we&apos;ll get back to you within 24 hours.</p>
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div className="flex flex-col items-center justify-center py-16 text-center" initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} key="success">
                      <motion.div className="w-24 h-24 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl" animate={{ scale:[0.8,1.1,1], rotate:[0,10,-10,0] }} transition={{ duration:0.6 }}>
                        <CheckCircle className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-3">Message Sent!</h3>
                      <p className="text-gray-500 text-lg">We'll be in touch within 24 hours</p>
                    </motion.div>
                  ) : (
                    <motion.form onSubmit={handleSubmit} className="space-y-6" key="form">
                      <div className="grid sm:grid-cols-2 gap-6">
                        {[
                          { id:'name', label:'Your Name', type:'text', placeholder:'Jane Smith' },
                          { id:'email', label:'Email Address', type:'email', placeholder:'jane@example.com' },
                        ].map((field) => (
                          <motion.div key={field.id} animate={{ scale: focusedField===field.id ? 1.01 : 1 }} transition={{ duration:0.2 }}>
                            <label htmlFor={field.id} className={`block text-sm font-semibold mb-2 transition-colors ${focusedField===field.id ? 'text-purple-600' : 'text-gray-700'}`}>{field.label} *</label>
                            <input type={field.type} id={field.id} name={field.id} value={formData[field.id as keyof typeof formData]} onChange={handleChange}
                              onFocus={() => setFocusedField(field.id)} onBlur={() => setFocusedField(null)} required
                              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-purple-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.1)]"
                              placeholder={field.placeholder} />
                          </motion.div>
                        ))}
                      </div>
                      <motion.div animate={{ scale: focusedField==='subject' ? 1.01 : 1 }} transition={{ duration:0.2 }}>
                        <label htmlFor="subject" className={`block text-sm font-semibold mb-2 transition-colors ${focusedField==='subject' ? 'text-purple-600' : 'text-gray-700'}`}>Subject *</label>
                        <select id="subject" name="subject" value={formData.subject} onChange={handleChange}
                          onFocus={() => setFocusedField('subject')} onBlur={() => setFocusedField(null)} required
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 transition-all duration-300 focus:outline-none focus:border-purple-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.1)]">
                          <option value="">Select a topic…</option>
                          <option value="membership">Membership Question</option>
                          <option value="workbook">Workbook Question</option>
                          <option value="events">Events Question</option>
                          <option value="coaching">Coaching Session</option>
                          <option value="technical">Technical Support</option>
                          <option value="other">Other</option>
                        </select>
                      </motion.div>
                      <motion.div animate={{ scale: focusedField==='message' ? 1.01 : 1 }} transition={{ duration:0.2 }}>
                        <label htmlFor="message" className={`block text-sm font-semibold mb-2 transition-colors ${focusedField==='message' ? 'text-purple-600' : 'text-gray-700'}`}>Your Message *</label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleChange}
                          onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)} required rows={5}
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 resize-none transition-all duration-300 focus:outline-none focus:border-purple-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.1)]"
                          placeholder="Tell us how we can help you…" />
                      </motion.div>
                      {submitError && (
                        <p className="text-rose-500 text-sm text-center font-medium">{submitError}</p>
                      )}
                      <motion.button type="submit" disabled={loading} className="w-full relative overflow-hidden bg-linear-to-r from-purple-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        whileHover={loading ? {} : { scale:1.02, boxShadow:'0 20px 60px rgba(124,58,237,0.4)' }} whileTap={loading ? {} : { scale:0.98 }}>
                        <Send className="w-5 h-5" />
                        {loading ? 'Sending…' : 'Send Message'}
                        {!loading && <motion.div className="absolute inset-0 bg-white/20" initial={{ x:'-100%', skewX:-20 }} whileHover={{ x:'200%' }} transition={{ duration:0.5 }} />}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Side */}
            <motion.div className="lg:col-span-2 space-y-8" initial={{ opacity:0, x:50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.8, delay:0.2 }}>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Common Questions</h3>
                <motion.div className="space-y-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once:true }}>
                  {faqs.map((faq, index) => (
                    <motion.div key={index} variants={itemVariants} whileHover={{ x:4 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">Q</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <motion.div className="relative bg-linear-to-br from-purple-600 via-pink-600 to-purple-700 rounded-3xl p-8 text-white overflow-hidden" whileHover={{ scale:1.02 }} transition={{ type:'spring', stiffness:300 }}>
                <motion.div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" animate={{ scale:[1,1.3,1] }} transition={{ duration:6, repeat:Infinity }} />
                <motion.div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/10 rounded-full" animate={{ scale:[1,1.2,1] }} transition={{ duration:5, repeat:Infinity, delay:1 }} />
                <Sparkles className="w-8 h-8 mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-3">Ready to Reinvent?</h3>
                <p className="text-purple-100 mb-6 text-sm leading-relaxed">Join a powerful community of women over 50 who are embracing growth, confidence, and new possibilities.</p>
                <Link href="/membership">
                  <motion.div className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors" whileHover={{ x:4 }}>
                    Join Now <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-600 via-pink-600 to-purple-700" />
        <motion.div className="absolute inset-0" animate={{ backgroundPosition:['0% 0%','100% 100%'] }} transition={{ duration:20, repeat:Infinity, repeatType:'reverse' }}
          style={{ backgroundImage:'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.12) 0%, transparent 50%)' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2 className="text-5xl md:text-6xl font-bold text-white mb-6" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            Ready to Start Your Next Chapter?
          </motion.h2>
          <motion.p className="text-2xl text-purple-100 mb-12" initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:0.2 }}>
            Don’t wait to create the life you truly deserve.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-5 justify-center" initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:0.4 }}>
            <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
              <Link href="/membership" className="inline-flex items-center gap-2 bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all">
                Join the Community <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
              <Link href="/workbook" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/30 transition-all">
                Get the Workbook
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
