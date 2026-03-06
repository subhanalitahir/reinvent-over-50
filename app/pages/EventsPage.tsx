'use client';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, MapPin, Video, Clock, Sparkles, ArrowRight, Ticket, Loader2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmailModal } from '../components/EmailModal';
import { useAuth } from '../context/AuthContext';

interface IEvent {
  _id: string;
  title: string;
  description: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  status: string;
  startDate: string;
  endDate: string;
  location?: string;
  virtualLink?: string;
  maxAttendees?: number;
  attendees: string[];
  price: number;
  isFree: boolean;
  isFreeForMembers: boolean;
  imageUrl?: string;
  hostedBy: string;
  tags: string[];
}

export function EventsPage() {
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState<string | null>(null);
  const [eventError, setEventError] = useState('');
  const [eventSuccess, setEventSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/events?limit=50', { headers });
      const json = await res.json();
      setEvents(json?.data ?? []);
    } catch {
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }, [token]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  useEffect(() => {
    const successParam = searchParams.get('success');
    const sessionId = searchParams.get('session_id');
    if (successParam === 'true') {
      setEventSuccess(true);
      if (sessionId) fetch(`/api/checkout/verify?session_id=${sessionId}`).catch(() => {});
    }
    if (searchParams.get('canceled') === 'true') setEventError('Payment was cancelled. Please try again.');
  }, [searchParams]);

  const getEventPrice = (event: IEvent): string => {
    if (event.isFree) return 'Free';
    if (event.isFreeForMembers) return `$${event.price.toFixed(2)} (Free for Members)`;
    return `$${event.price.toFixed(2)}`;
  };

  const isFreeForCurrentUser = (event: IEvent): boolean => {
    if (event.isFree) return true;
    if (event.isFreeForMembers && (user?.role === 'member' || user?.role === 'admin')) return true;
    return false;
  };

  const doEventCheckout = async (eventId: string, email?: string) => {
    setLoadingEvent(eventId);
    setEventError('');
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const body: Record<string, unknown> = { eventId };
      if (email) body.email = email;
      const res = await fetch('/api/checkout/event', { method: 'POST', headers, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Registration failed');
      if (data.data?.url) window.location.href = data.data.url;
      else if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      setEventError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setModalOpen(false);
    } finally {
      setLoadingEvent(null);
    }
  };

  const handleEventRegister = (event: IEvent) => {
    if (isFreeForCurrentUser(event)) {
      // Redirect to membership page for member-only free events
      if (event.isFreeForMembers && !event.isFree && user?.role !== 'member' && user?.role !== 'admin') {
        window.location.href = '/membership';
        return;
      }
      // Fully free â€” just show success or link
      window.location.href = '/dashboard';
      return;
    }
    setEventError('');
    if (user && token) {
      doEventCheckout(event._id);
    } else {
      setPendingEventId(event._id);
      setModalOpen(true);
    }
  };

  const handleModalSubmit = async (email: string) => {
    if (!pendingEventId) return;
    setModalOpen(false);
    await doEventCheckout(pendingEventId, email);
  };

  const virtualEvents = events.filter(e => e.type === 'virtual' || e.type === 'hybrid');
  const inPersonEvents = events.filter(e => e.type === 'in-person');

  const pendingEvent = events.find(e => e._id === pendingEventId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="pt-20">
      {/* Notifications */}
      <AnimatePresence>
        {eventSuccess && (
          <motion.div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-lg"
            initial={{ opacity:0, y:-40, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-40 }}
            transition={{ type:'spring', stiffness:300, damping:25 }}>
            <Ticket className="w-6 h-6" />
            You&apos;re registered! Check your email for confirmation.
          </motion.div>
        )}
      </AnimatePresence>
      {eventError && (
        <motion.div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl font-semibold"
          initial={{ opacity:0, y:-30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
          {eventError}
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden bg-linear-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <motion.div className="orb orb-purple w-112.5 h-112.5 -top-20 -right-15"
          animate={{ scale:[1,1.25,1], x:[0,-40,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div className="orb orb-pink w-87.5 h-87.5 -bottom-15 -left-10"
          animate={{ scale:[1,1.2,1], y:[0,-30,0] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:2 }} />
        {[...Array(8)].map((_,i) => (
          <motion.div key={i} className="absolute w-2.5 h-2.5 rounded-full"
            style={{ background:`hsl(${270+i*20},70%,65%)`, left:`${7+i*12}%`, top:`${18+(i%3)*26}%`, opacity:0.4 }}
            animate={{ y:[0,-28,0], scale:[1,1.6,1], opacity:[0.3,0.7,0.3] }}
            transition={{ duration:4+i*0.5, repeat:Infinity, delay:i*0.35, ease:'easeInOut' }} />
        ))}
        <div className="max-w-5xl mx-auto px-6 py-28 text-center relative z-10 w-full">
          <motion.div className="section-label mx-auto mb-8"
            initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5 }}>
            <Sparkles className="w-4 h-4 text-purple-600" />
            Events &amp; Gatherings
          </motion.div>
          <motion.h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-[0.9]"
            initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}>
            <span className="block text-gray-900">Upcoming</span>
            <span className="block gradient-text-aurora font-display italic">Events</span>
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.25 }}>
            Join us for virtual meetups, immersive workshops, and inspiring in-person gatherings
          </motion.p>
        </div>
      </section>

      {/* Virtual Events */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="flex items-center gap-4 mb-14"
            initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ duration:0.6 }}>
            <motion.div className="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl"
              whileHover={{ rotate:360 }} transition={{ duration:0.6 }}>
              <Video className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                <span className="text-gray-900">Virtual </span>
                <span className="gradient-text-purple font-display italic">Events</span>
              </h2>
              <p className="text-gray-500 text-sm mt-1">Join from anywhere in the world</p>
            </div>
          </motion.div>
          {eventsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : virtualEvents.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No virtual events scheduled yet</p>
              <p className="text-sm mt-1">Check back soon for upcoming sessions!</p>
            </div>
          ) : (
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {virtualEvents.map((event) => {
                const priceLabel = getEventPrice(event);
                const freeForUser = isFreeForCurrentUser(event);
                const durationMs = new Date(event.endDate).getTime() - new Date(event.startDate).getTime();
                const durationMins = Math.round(durationMs / 60000);
                const durationLabel = durationMins >= 60 ? `${Math.floor(durationMins/60)}h${durationMins%60>0?` ${durationMins%60}m`:''}` : `${durationMins} min`;
                return (
                  <motion.div key={event._id} variants={cardVariants} whileHover={{ y:-10, scale:1.03 }}
                    className="card-shine bg-white border-2 border-purple-100 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all">
                    <div className="relative overflow-hidden">
                      <motion.div whileHover={{ scale:1.1 }} transition={{ duration:0.4 }}>
                        <ImageWithFallback src={event.imageUrl ?? ''} alt={event.title} className="w-full h-48 object-cover" />
                      </motion.div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-purple-600 capitalize">
                        {event.type}
                      </div>
                      {(event.isFree || event.isFreeForMembers) && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {event.isFree ? 'Free' : 'Member Free'}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl mb-3 font-semibold">{event.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span>{new Date(event.startDate).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })}, {new Date(event.startDate).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span>{durationLabel}</span>
                        </div>
                        {event.maxAttendees && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span>{event.maxAttendees - (event.attendees?.length ?? 0)} spots left</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-semibold ${event.isFree ? 'text-green-600' : 'text-purple-600'}`}>{priceLabel}</span>
                        <motion.button
                          onClick={() => handleEventRegister(event)}
                          disabled={loadingEvent === event._id}
                          className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                          whileHover={{ scale: loadingEvent === event._id ? 1 : 1.05 }}
                          whileTap={{ scale: loadingEvent === event._id ? 1 : 0.95 }}>
                          {loadingEvent === event._id ? 'Loadingâ€¦' : freeForUser ? (user ? 'Access Now' : 'Join as Member') : 'Register'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* In-Person Events */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-orange-50 via-rose-50/60 to-white" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="flex items-center gap-4 mb-14"
            initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ duration:0.6 }}>
            <motion.div className="w-14 h-14 bg-linear-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl"
              whileHover={{ rotate:360 }} transition={{ duration:0.6 }}>
              <MapPin className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                <span className="text-gray-900">In-Person </span>
                <span className="font-display italic" style={{ background:'linear-gradient(135deg,#ea580c,#dc2626)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Events</span>
              </h2>
              <p className="text-gray-500 text-sm mt-1">Real connections, real places</p>
            </div>
          </motion.div>
          {eventsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : inPersonEvents.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No in-person events scheduled yet</p>
              <p className="text-sm mt-1">Check back soon â€” we&apos;re planning gatherings near you!</p>
            </div>
          ) : (
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {inPersonEvents.map((event) => {
                const priceLabel = getEventPrice(event);
                const freeForUser = isFreeForCurrentUser(event);
                return (
                  <motion.div key={event._id} variants={cardVariants} whileHover={{ y:-10, scale:1.03 }}
                    className="card-shine bg-white border-2 border-orange-100 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-orange-300 transition-all">
                    <div className="relative overflow-hidden">
                      <motion.div whileHover={{ scale:1.1 }} transition={{ duration:0.4 }}>
                        <ImageWithFallback src={event.imageUrl ?? ''} alt={event.title} className="w-full h-48 object-cover" />
                      </motion.div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-orange-600">
                        In-Person
                      </div>
                      {(event.isFree || event.isFreeForMembers) && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {event.isFree ? 'Free' : 'Member Free'}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl mb-3 font-semibold">{event.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span>{new Date(event.startDate).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.maxAttendees && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span>{event.maxAttendees - (event.attendees?.length ?? 0)} spots left</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-semibold ${event.isFree ? 'text-green-600' : 'text-orange-600'}`}>{priceLabel}</span>
                        <motion.button
                          onClick={() => handleEventRegister(event)}
                          disabled={loadingEvent === event._id}
                          className="bg-linear-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                          whileHover={{ scale: loadingEvent === event._id ? 1 : 1.05 }}
                          whileTap={{ scale: loadingEvent === event._id ? 1 : 0.95 }}>
                          {loadingEvent === event._id ? 'Loadingâ€¦' : freeForUser ? (user ? 'Access Now' : 'Join as Member') : 'Book Now'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #312e81 35%, #4c1d95 65%, #1e1b4b 100%)' }}>
        <div className="absolute -top-28 -left-28 w-120 h-120 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.3) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -right-20 w-100 h-100 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.25) 0%, transparent 70%)' }} />
        {[...Array(12)].map((_,i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width:`${3+(i%3)*2}px`, height:`${3+(i%3)*2}px`, background:'rgba(255,255,255,0.4)', left:`${5+i*8}%`, top:`${10+(i%4)*20}%` }}
            animate={{ y:[0,-28,0], opacity:[0.15,0.75,0.15] }}
            transition={{ duration:3+i*0.4, repeat:Infinity, delay:i*0.3 }} />
        ))}
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-semibold tracking-widest uppercase mb-10"
            initial={{ opacity:0, scale:0.85 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
            <Sparkles className="w-4 h-4 text-yellow-300" />
            Don&apos;t Miss Out
          </motion.div>
          <motion.h2 className="font-display font-extrabold leading-none mb-6"
            initial={{ opacity:0, y:35 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.75, ease:[0.16,1,0.3,1] }}>
            <span className="block text-5xl md:text-7xl lg:text-8xl text-white tracking-tight">Be Part of the</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black italic mt-1" style={{ color:'#fbbf24', textShadow:'0 0 50px rgba(251,191,36,0.55), 0 0 100px rgba(251,191,36,0.3)' }}>Experience</span>
          </motion.h2>
          <motion.p className="text-xl md:text-2xl text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:0.2 }}>
            Become a member and unlock <span className="text-yellow-300 font-bold">free or deeply discounted</span> access to every event we run.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:0.45 }}>
            <motion.div whileHover={{ scale:1.06 }} whileTap={{ scale:0.96 }}>
              <Link href="/membership"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 px-10 py-5 rounded-full font-extrabold text-lg shadow-2xl transition-all"
                style={{ boxShadow:'0 0 40px rgba(255,255,255,0.2)' }}>
                Join the Community <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}>
              <Link href="/booking" className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm text-white border-2 border-white/35 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all" style={{ background:'rgba(255,255,255,0.1)' }}>
                Book a Session
              </Link>
            </motion.div>
          </motion.div>
          <motion.p className="text-indigo-300/60 text-sm mt-8"
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:0.6, delay:0.6 }}>
            Cancel anytime &nbsp;Â·&nbsp; No long-term commitment &nbsp;Â·&nbsp; Instant community access
          </motion.p>
        </div>
      </section>

      <EmailModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setPendingEventId(null); }}
        onSubmit={handleModalSubmit}
        title="Register for event"
        subtitle={pendingEvent ? `Enter your email to reserve your spot for "${pendingEvent.title}".` : 'Enter your email to register.'}
        ctaLabel="Reserve My Spot â†’"
        loading={loadingEvent !== null}
      />
    </div>
  );
}
