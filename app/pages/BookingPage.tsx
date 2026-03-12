'use client';

import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, Clock, Video, Check, Star, ArrowRight, Sparkles, Shield, Award, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState<'info' | 'schedule' | 'payment' | 'success'>('info');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Stripe redirect back
  useEffect(() => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');
    if (success === 'true' && sessionId) {
      setStep('success');
      // Verify with backend (fires email)
      fetch(`/api/checkout/verify?session_id=${sessionId}`).catch(() => {});
    }
    if (searchParams.get('canceled') === 'true') {
      setStep('payment');
      setError('Payment was cancelled. You can try again.');
    }
  }, [searchParams]);

  // Pre-fill form for authenticated users
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  const availableDates = [
    'March 5, 2026',
    'March 8, 2026',
    'March 12, 2026',
    'March 15, 2026',
    'March 19, 2026',
    'March 22, 2026',
  ];

  const availableTimes = [
    '9:00 AM ET',
    '10:30 AM ET',
    '1:00 PM ET',
    '2:30 PM ET',
    '4:00 PM ET',
    '6:00 PM ET',
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[45vh] flex items-center bg-linear-to-br from-purple-50 via-pink-50 to-fuchsia-50 overflow-hidden">
        <motion.div className="orb orb-purple w-80 h-80 -top-15 -right-10" animate={{ scale:[1,1.3,1], x:[0,-40,0] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div className="orb orb-pink w-72 h-72 -bottom-10 -left-10" animate={{ scale:[1,1.2,1], y:[0,-30,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut', delay:1 }} />
        {[...Array(6)].map((_,i) => (
          <motion.div key={i} className="absolute w-2.5 h-2.5 rounded-full"
            style={{ background:`hsl(${280+i*15},70%,60%)`, left:`${8+i*16}%`, top:`${15+(i%2)*50}%`, opacity:0.35 }}
            animate={{ y:[0,-25,0], scale:[1,1.5,1], opacity:[0.35,0.7,0.35] }}
            transition={{ duration:3+i*0.7, repeat:Infinity, delay:i*0.4, ease:'easeInOut' }} />
        ))}
        <div className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10 w-full">
          <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-purple-100"
            initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5 }}>
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">Personalized 1-on-1 Coaching</span>
          </motion.div>
          <motion.h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}>
            <span className="block text-gray-900">Book Your</span>
            <span className="block bg-linear-to-r from-purple-600 via-pink-600 to-fuchsia-500 bg-clip-text text-transparent">1-on-1 Session</span>
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.3 }}>
            Get personalized guidance to accelerate your transformation journey
          </motion.p>

          {/* Step indicators */}
          <motion.div className="flex items-center justify-center gap-3 mt-10"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.5 }}>
            {['Session Info', 'Schedule', 'Confirm'].map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  (step === 'info' && i === 0) || (step === 'schedule' && i === 1) || (step === 'payment' && i === 2)
                    ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white/70 text-gray-500 border border-gray-200'
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    (step === 'info' && i === 0) || (step === 'schedule' && i === 1) || (step === 'payment' && i === 2)
                      ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>{i + 1}</span>
                  {label}
                </div>
                {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      {step === 'info' && (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <motion.div initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}>
                <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6"
                  initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}>
                  <Star className="w-4 h-4" />
                  What You'll Get
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  <span className="text-gray-900">Your Complete</span><br />
                  <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Coaching Package</span>
                </h2>
                <div className="space-y-5 mb-10">
                  {[
                    { text: '60-minute personalized coaching session via video call', icon: Video },
                    { text: 'Custom action plan tailored to your goals', icon: Award },
                    { text: 'Pre-session assessment to maximize our time', icon: Calendar },
                    { text: 'Written session summary and next steps', icon: Check },
                    { text: '30 days of follow-up email support', icon: Shield },
                  ].map((item, index) => (
                    <motion.div key={index} className="flex items-start gap-4 group"
                      initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:index*0.1 }}>
                      <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed pt-1">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.div className="relative bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100 mb-8"
                  whileHover={{ scale:1.02 }} transition={{ type:'spring', stiffness:300 }}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-6xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">$150</span>
                    <span className="text-gray-500">/ session</span>
                  </div>
                  <p className="text-gray-600">Includes everything listed above</p>
                </motion.div>
                <motion.button type="button" onClick={() => setStep('schedule')}
                  className="group w-full relative bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 overflow-hidden"
                  whileHover={{ scale:1.02, boxShadow:'0 20px 60px rgba(124,58,237,0.4)' }} whileTap={{ scale:0.98 }}>
                  Schedule Your Session
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>

              <motion.div className="relative" initial={{ opacity:0, x:50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}>
                <motion.div className="absolute -inset-4 bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20"
                  animate={{ scale:[1,1.05,1] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }} />
                <ImageWithFallback
                  src="https://i.pinimg.com/736x/4d/d5/75/4dd575d7358e9cb9869ff0f2c598ea7d.jpg"
                  className="rounded-3xl max-h-[800px] object-fit shadow-2xl w-full relative z-10"
                />
              </motion.div>
            </div>

            {/* Testimonials */}
            <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">What Clients Say</h3>
                <p className="text-gray-500">Join hundreds who've transformed with us</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name:'Patricia M.', role:'Entrepreneur', text:'The 1-on-1 session gave me clarity I had been searching for. Worth every penny!', rating:5 },
                  { name:'James R.', role:'Retired Executive', text:'My coach really listened and understood my unique situation. The action plan was spot-on.', rating:5 },
                  { name:'Carol S.', role:'Author', text:'I was hesitant at first, but this session changed my perspective and gave me hope.', rating:5 },
                ].map((t, index) => (
                  <motion.div key={index} className="card-shine bg-linear-to-br from-gray-50 to-purple-50/30 rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ y:-6, scale:1.02 }}>
                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating)].map((_,i) => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                    </div>
                    <p className="text-gray-700 italic mb-5 leading-relaxed">"{t.text}"</p>
                    <div>
                      <div className="font-bold text-gray-900">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.role}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Scheduling Section */}
      {step === 'schedule' && (
        <section className="py-24 bg-linear-to-br from-gray-50 to-purple-50/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4 }}>
              <button type="button" onClick={() => setStep('info')}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-8 group">
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Back to Session Info
              </button>
            </motion.div>

            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
                <Calendar className="w-4 h-4" />
                Choose Your Date & Time
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-10">
                <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Select Your Slot</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-10 mb-10">
              {/* Date Selection */}
              <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6, delay:0.1 }}>
                <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-gray-900">
                  <div className="w-9 h-9 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  Choose a Date
                </h3>
                <div className="space-y-3">
                  {availableDates.map((date, i) => (
                    <motion.button key={date} type="button" onClick={() => setSelectedDate(date)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left font-medium flex items-center gap-3 ${
                        selectedDate === date ? 'border-purple-600 bg-linear-to-r from-purple-50 to-pink-50 text-purple-700 shadow-lg' : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md text-gray-700'
                      }`}
                      whileHover={{ x:4 }} whileTap={{ scale:0.98 }}
                      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}>
                      <Calendar className={`w-5 h-5 ${selectedDate === date ? 'text-purple-600' : 'text-gray-400'}`} />
                      {date}
                      {selectedDate === date && <Check className="w-5 h-5 text-purple-600 ml-auto" />}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Time Selection */}
              <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6, delay:0.2 }}>
                <h3 className="text-xl font-bold mb-5 flex items-center gap-3 text-gray-900">
                  <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  Choose a Time
                </h3>
                <div className="space-y-3">
                  {availableTimes.map((time, i) => (
                    <motion.button key={time} type="button" onClick={() => setSelectedTime(time)} disabled={!selectedDate}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left font-medium flex items-center gap-3 ${
                        selectedTime === time ? 'border-purple-600 bg-linear-to-r from-purple-50 to-pink-50 text-purple-700 shadow-lg' : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md text-gray-700'
                      } ${!selectedDate ? 'opacity-40 cursor-not-allowed' : ''}`}
                      whileHover={selectedDate ? { x:4 } : {}} whileTap={selectedDate ? { scale:0.98 } : {}}
                      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05+0.1 }}>
                      <Clock className={`w-5 h-5 ${selectedTime === time ? 'text-purple-600' : 'text-gray-400'}`} />
                      {time}
                      {selectedTime === time && <Check className="w-5 h-5 text-purple-600 ml-auto" />}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {selectedDate && selectedTime && (
                <motion.div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100 mb-8 shadow-lg"
                  initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0 }}
                  transition={{ duration:0.4, type:'spring' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Your Selected Session</h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 pl-13">
                    <Video className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold">{selectedDate} at {selectedTime} via Video Call</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button type="button" onClick={() => {
              if (!user || !token) {
                router.push('/signup?redirect=booking');
                return;
              }
              setStep('payment');
            }} disabled={!selectedDate || !selectedTime}
              className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                selectedDate && selectedTime
                  ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-xl hover:shadow-purple-500/40 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={selectedDate && selectedTime ? { scale:1.02 } : {}} whileTap={selectedDate && selectedTime ? { scale:0.98 } : {}}>
              Continue to Confirmation
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </section>
      )}

      {/* Payment Section */}
      {step === 'payment' && (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4 }}>
              <button type="button" onClick={() => { setStep('schedule'); setError(''); }}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-8 group">
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Back to Scheduling
              </button>
            </motion.div>

            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <h2 className="text-4xl font-bold mb-2">
                <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Complete Your Booking</span>
              </h2>
              <p className="text-gray-500 mb-8">Just a few details and you&apos;re all set!</p>
            </motion.div>

            <motion.div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl p-8 mb-8 border border-purple-100 shadow-lg"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}>
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />
                Session Summary
              </h3>
              <div className="space-y-3 text-gray-700">
                {[
                  { label:'Date & Time', value:`${selectedDate} at ${selectedTime}` },
                  { label:'Duration', value:'60 minutes' },
                  { label:'Format', value:'Video Call (Zoom)' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-purple-100 last:border-0">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">$150</span>
                </div>
              </div>
            </motion.div>

            <motion.form className="space-y-6" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.2 }}
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError('');
                try {
                  // Parse selected date + time into an ISO string
                  const dateStr = selectedDate;
                  const timeStr = selectedTime.replace(' ET', '');
                  const parsedDate = new Date(`${dateStr} ${timeStr}`);
                  const scheduledAt = isNaN(parsedDate.getTime())
                    ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                    : parsedDate.toISOString();
                  const res = await fetch('/api/checkout/booking', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({
                      name: formData.name,
                      email: formData.email,
                      phone: formData.phone || undefined,
                      sessionType: 'coaching',
                      preferredDate: scheduledAt,
                      message: formData.notes || undefined,
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data?.message ?? 'Checkout failed. Please try again.');
                  const checkoutUrl: string | undefined = data?.data?.url ?? data?.url;
                  if (!checkoutUrl) throw new Error('Could not create payment session. Please try again.');
                  window.location.assign(checkoutUrl);
                } catch (err: unknown) {
                  setLoading(false);
                  setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
                }
              }}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input type="text" required placeholder="Jane Smith" value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-purple-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.1)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" required placeholder="jane@example.com" value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-purple-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.1)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" placeholder="(555) 123-4567" value={formData.phone}
                  onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-purple-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.1)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">What would you like to focus on?</label>
                <textarea rows={4} placeholder="Tell us about your goals and challenges..." value={formData.notes}
                  onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 resize-none transition-all duration-300 focus:outline-none focus:border-purple-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.1)]" />
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  You&apos;ll be redirected to Stripe for secure payment. A confirmation email with your session details will follow.
                </p>
              </div>
              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
                  <span className="text-rose-500 font-bold text-lg leading-none mt-0.5">!</span>
                  <p className="text-rose-700 text-sm font-medium">{error}</p>
                </div>
              )}
              <motion.button type="submit" disabled={loading}
                className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={loading ? {} : { scale:1.02, boxShadow:'0 20px 60px rgba(124,58,237,0.4)' }} whileTap={loading ? {} : { scale:0.98 }}>
                {loading ? 'Redirecting to payment…' : 'Complete Booking & Pay $150'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </motion.form>
          </div>
        </section>
      )}

      {/* Success Section */}
      {step === 'success' && (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, damping:15 }}>
              <div className="w-24 h-24 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-4" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
              <span className="bg-linear-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Booking Confirmed!</span>
            </motion.h2>
            <motion.p className="text-xl text-gray-600 mb-6" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
              Your 1-on-1 coaching session is booked. Check your email for a confirmation with all the details.
            </motion.p>
            <motion.div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100 shadow-lg inline-block text-left mx-auto"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">What&apos;s next?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-500 mt-0.5" /> Check your inbox for the confirmation email</li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-500 mt-0.5" /> Complete the pre-session assessment (link in email)</li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-500 mt-0.5" /> Join your Zoom session at the scheduled time</li>
              </ul>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-24 bg-linear-to-br from-gray-50 to-purple-50/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-12" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">Have Questions?</div>
            <h2 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-5">
            {[
              { q:"How do I prepare for my session?", a:"After booking, you'll receive a pre-session assessment via email. This helps us make the most of our time together." },
              { q:"What if I need to reschedule?", a:"You can reschedule up to 24 hours before your session at no charge. Contact us via email." },
              { q:"What platform do you use for video calls?", a:"We use Zoom for all video sessions. You'll receive a link in your confirmation email." },
              { q:"Can I book multiple sessions?", a:"Absolutely! Many clients find value in ongoing coaching. Contact us about package pricing." },
            ].map((faq, index) => (
              <motion.div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all"
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:index*0.08 }}
                whileHover={{ x:4 }}>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">Q</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}