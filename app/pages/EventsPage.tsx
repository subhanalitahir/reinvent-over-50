'use client';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, MapPin, Users, Video, Clock } from 'lucide-react';
import { motion } from 'motion/react';

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
            Upcoming Events
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join us for virtual meetups, workshops, and in-person gatherings
          </motion.p>
        </div>
      </section>

      {/* Virtual Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Video className="w-6 h-6 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Virtual Events
            </h2>
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
                className="bg-white border-2 border-purple-100 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
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
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <MapPin className="w-6 h-6 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              In-Person Events
            </h2>
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
                className="bg-white border-2 border-orange-100 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Monthly Meetup Tour
            </h2>
            <p className="text-xl text-gray-600">
              We're coming to a city near you! Check our monthly tour schedule.
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
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl text-center shadow-lg cursor-pointer border-2 border-purple-200"
              >
                <div className="text-2xl mb-2 font-semibold text-gray-800">{stop.city}</div>
                <div className="text-purple-600 font-medium">{stop.date}, 2026</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white relative overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            className="text-4xl md:text-6xl mb-6 font-bold"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Don't Miss Out
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-purple-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Become a member to get free or discounted access to all events
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
            Join the Community
          </motion.button>
        </div>
      </section>
    </div>
  );
}