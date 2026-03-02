'use client';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, MapPin, Users, Video, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export function EventsPage() {
  const virtualEvents = [
    {
      title: 'Weekly Community Meetup',
      date: 'Every Monday, 7:00 PM ET',
      duration: '60 minutes',
      type: 'Virtual',
      price: 'Free for Members',
      image: 'https://images.unsplash.com/photo-1764690690771-b4522d66b433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwbWVldGluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjM1MzU4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Connect with fellow members, share your journey, and get support.',
    },
    {
      title: 'Goal Setting Workshop',
      date: 'March 15, 2026, 2:00 PM ET',
      duration: '90 minutes',
      type: 'Virtual',
      price: '$25 ($15 for members)',
      image: 'https://images.unsplash.com/photo-1633158834806-766387547d2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGdyb3d0aCUyMHRyYW5zZm9ybWF0aW9ufGVufDF8fHx8MTc3MjM1MzU4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Learn powerful techniques for setting and achieving meaningful goals.',
    },
    {
      title: 'Finding Your Purpose Masterclass',
      date: 'March 22, 2026, 6:00 PM ET',
      duration: '2 hours',
      type: 'Virtual',
      price: '$35 ($20 for members)',
      image: 'https://images.unsplash.com/photo-1634840542403-1a9b1067aaa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlJTIwY29hY2hpbmclMjBzZXNzaW9ufGVufDF8fHx8MTc3MjM1MzU4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Discover your unique purpose and create a plan to live it.',
    },
  ];

  const inPersonEvents = [
    {
      title: 'Reinvention Retreat - Miami',
      date: 'April 5-7, 2026',
      location: 'Miami, FL',
      type: 'In-Person',
      price: '$497',
      spots: '15 spots left',
      image: 'https://images.unsplash.com/photo-1771340591381-e72f1b148b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBldmVudCUyMGdhdGhlcmluZ3xlbnwxfHx8fDE3NzIzNTM1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Three-day immersive retreat focused on transformation and community.',
    },
    {
      title: 'Monthly Meetup - New York',
      date: 'March 10, 2026, 10:00 AM',
      location: 'New York, NY',
      type: 'In-Person',
      price: '$15 (Free for members)',
      spots: '25 spots available',
      image: 'https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjBhZHVsdHMlMjBjb21tdW5pdHklMjBncm91cHxlbnwxfHx8fDE3NzIzNTM1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Coffee, conversation, and connection with local members.',
    },
    {
      title: 'Monthly Meetup - Los Angeles',
      date: 'March 17, 2026, 11:00 AM',
      location: 'Los Angeles, CA',
      type: 'In-Person',
      price: '$15 (Free for members)',
      spots: '30 spots available',
      image: 'https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjBhZHVsdHMlMjBjb21tdW5pdHklMjBncm91cHxlbnwxfHx8fDE3NzIzNTM1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Meet fellow members for brunch and meaningful conversations.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
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
        <motion.div className="orb orb-purple w-[450px] h-[450px] top-[-80px] right-[-60px]"
          animate={{ scale:[1,1.25,1], x:[0,-40,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div className="orb orb-pink w-[350px] h-[350px] bottom-[-60px] left-[-40px]"
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
            Events & Gatherings
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
            <motion.div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl"
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
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {virtualEvents.map((event, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.03 }}
                className="card-shine bg-white border-2 border-purple-100 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all"
              >
                <div className="relative overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-purple-600">
                    {event.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-3 font-semibold">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span>{event.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-purple-600">{event.price}</span>
                    <motion.button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Register
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* In-Person Events */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-rose-50/60 to-white" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="flex items-center gap-4 mb-14"
            initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ duration:0.6 }}>
            <motion.div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl"
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
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {inPersonEvents.map((event, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.03 }}
                className="card-shine bg-white border-2 border-orange-100 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-orange-300 transition-all"
              >
                <div className="relative overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-orange-600">
                    {event.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-3 font-semibold">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>{event.spots}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-orange-600">{event.price}</span>
                    <motion.button
                      className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Monthly Tour Schedule */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-14"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6 }}>
            <div className="section-label mx-auto mb-6">On the Road</div>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
              <span className="text-gray-900">Monthly Meetup </span>
              <span className="gradient-text-aurora font-display italic">Tour</span>
            </h2>
            <p className="text-xl text-gray-600">
              We&apos;re coming to a city near you! Check our monthly tour schedule.
            </p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { city: 'New York, NY', date: 'March 10' },
              { city: 'Los Angeles, CA', date: 'March 17' },
              { city: 'Chicago, IL', date: 'March 24' },
              { city: 'Houston, TX', date: 'March 31' },
              { city: 'Phoenix, AZ', date: 'April 7' },
              { city: 'Philadelphia, PA', date: 'April 14' },
              { city: 'San Diego, CA', date: 'April 21' },
              { city: 'Dallas, TX', date: 'April 28' },
            ].map((stop, index) => (
              <motion.div key={index} variants={cardVariants} whileHover={{ scale:1.05, y:-6 }}
                className="card-elevated relative overflow-hidden group text-center">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 absolute top-0 left-0 right-0" />
                <div className="pt-3">
                  <div className="font-display text-xl font-bold text-gray-800 mb-2">{stop.city}</div>
                  <div className="text-purple-600 font-semibold text-sm">{stop.date}, 2026</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 animate-aurora" />
        <div className="absolute inset-0 bg-noise opacity-20" />
        {[...Array(12)].map((_,i) => (
          <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
            style={{ left:`${5+i*8}%`, top:`${15+(i%4)*20}%` }}
            animate={{ y:[0,-25,0], opacity:[0.2,0.7,0.2] }}
            transition={{ duration:3+i*0.4, repeat:Infinity, delay:i*0.3 }} />
        ))}
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div className="section-label mx-auto mb-8 border-white/30 text-white"
            style={{ background:'rgba(255,255,255,0.1)' }}
            initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}>
            <Sparkles className="w-4 h-4" />
            Don&apos;t Miss Out
          </motion.div>
          <motion.h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6 }}>
            Be Part of the <br />
            <span className="font-display italic text-yellow-300">Experience</span>
          </motion.h2>
          <motion.p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-2xl mx-auto"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.2 }}>
            Become a member to get free or discounted access to all events
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-5 justify-center"
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.4 }}>
            <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
              <Link href="/membership" className="inline-flex items-center gap-2 bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all">
                Join the Community <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
              <Link href="/booking" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/30 transition-all">
                Book a Session
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}