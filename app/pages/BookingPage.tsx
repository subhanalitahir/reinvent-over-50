'use client';

import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, Clock, Video, Check } from 'lucide-react';
import { motion } from 'motion/react';

export function BookingPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState<'info' | 'schedule' | 'payment'>('info');

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
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">Book Your 1-on-1 Session</h1>
          <p className="text-xl text-gray-600">
            Get personalized guidance to accelerate your transformation journey
          </p>
        </div>
      </section>

      {/* Info Section */}
      {step === 'info' && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl mb-6">What You'll Get</h2>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <span className="text-lg">60-minute personalized coaching session via video call</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <span className="text-lg">Custom action plan tailored to your goals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <span className="text-lg">Pre-session assessment to maximize our time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <span className="text-lg">Written session summary and next steps</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <span className="text-lg">30 days of follow-up email support</span>
                  </li>
                </ul>
                <div className="bg-purple-50 p-6 rounded-xl mb-6">
                  <div className="text-3xl mb-2">$150</div>
                  <p className="text-gray-600">Single session</p>
                </div>
                <button
                  onClick={() => setStep('schedule')}
                  className="w-full bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Schedule Your Session
                </button>
              </div>
              <div>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1634840542403-1a9b1067aaa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlJTIwY29hY2hpbmclMjBzZXNzaW9ufGVufDF8fHx8MTc3MjM1MzU4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Coaching session"
                  className="rounded-2xl shadow-xl w-full"
                />
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h3 className="text-2xl text-center mb-8">What Clients Say</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Patricia M.',
                    text: 'The 1-on-1 session gave me clarity I had been searching for. Worth every penny!',
                  },
                  {
                    name: 'James R.',
                    text: 'My coach really listened and understood my unique situation. The action plan was spot-on.',
                  },
                  {
                    name: 'Carol S.',
                    text: 'I was hesitant at first, but this session changed my perspective and gave me hope.',
                  },
                ].map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl">
                    <p className="text-gray-700 mb-3 italic">"{testimonial.text}"</p>
                    <div className="text-sm">- {testimonial.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Scheduling Section */}
      {step === 'schedule' && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <button
                onClick={() => setStep('info')}
                className="text-purple-600 hover:text-purple-700"
              >
                ← Back to Session Info
              </button>
            </div>

            <h2 className="text-3xl mb-8">Select Your Date & Time</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Date Selection */}
              <div>
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Choose a Date
                </h3>
                <div className="space-y-3">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                        selectedDate === date
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Choose a Time
                </h3>
                <div className="space-y-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      disabled={!selectedDate}
                      className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                        selectedTime === time
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      } ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedDate && selectedTime && (
              <div className="bg-purple-50 p-6 rounded-xl mb-6">
                <h3 className="text-xl mb-3">Your Selected Session</h3>
                <div className="flex items-center gap-2 text-gray-700">
                  <Video className="w-5 h-5" />
                  <span>{selectedDate} at {selectedTime}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep('payment')}
              disabled={!selectedDate || !selectedTime}
              className={`w-full py-4 rounded-lg transition-colors ${
                selectedDate && selectedTime
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Payment
            </button>
          </div>
        </section>
      )}

      {/* Payment Section */}
      {step === 'payment' && (
        <section className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="mb-8">
              <button
                onClick={() => setStep('schedule')}
                className="text-purple-600 hover:text-purple-700"
              >
                ← Back to Scheduling
              </button>
            </div>

            <h2 className="text-3xl mb-8">Complete Your Booking</h2>

            <div className="bg-purple-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl mb-4">Session Details</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{selectedDate} at {selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>60 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span>Video Call</span>
                </div>
                <div className="border-t border-purple-200 my-4"></div>
                <div className="flex justify-between text-xl">
                  <span>Total:</span>
                  <span>$150</span>
                </div>
              </div>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block mb-2">What would you like to focus on in this session?</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us about your goals and challenges..."
                ></textarea>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Payment will be processed securely. You will receive a confirmation email with 
                  your video call link and pre-session assessment.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Complete Booking & Pay $150
              </button>
            </form>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'How do I prepare for my session?',
                a: 'After booking, you\'ll receive a pre-session assessment via email. This helps us make the most of our time together.',
              },
              {
                q: 'What if I need to reschedule?',
                a: 'You can reschedule up to 24 hours before your session at no charge. Contact us via email.',
              },
              {
                q: 'What platform do you use for video calls?',
                a: 'We use Zoom for all video sessions. You\'ll receive a link in your confirmation email.',
              },
              {
                q: 'Can I book multiple sessions?',
                a: 'Absolutely! Many clients find value in ongoing coaching. Contact us about package pricing.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}