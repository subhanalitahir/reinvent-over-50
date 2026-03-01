'use client';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Check, BookOpen, Video, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';

export function WorkbookPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl mb-6">
                The Reinvention Workbook
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A comprehensive guide to discovering your purpose, setting meaningful goals, 
                and creating an action plan for the life you've always dreamed of.
              </p>
              <div className="flex items-center gap-4 text-gray-700 mb-6">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  150+ Pages
                </span>
                <span>•</span>
                <span>12 Modules</span>
                <span>•</span>
                <span>Digital & Print</span>
              </div>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1654542645844-590f5b8c146a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsJTIwbm90ZWJvb2slMjB3cml0aW5nfGVufDF8fHx8MTc3MjI4ODE1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Reinvention workbook"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">What's Inside the Workbook</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              12 comprehensive modules designed to guide you through every step of your transformation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Self-Discovery & Values Assessment',
              'Life Audit & Reflection',
              'Identifying Your Passions',
              'Goal Setting Framework',
              'Overcoming Limiting Beliefs',
              'Building New Habits',
              'Creating Your Action Plan',
              'Time Management Strategies',
              'Building Meaningful Relationships',
              'Financial Planning for Your New Chapter',
              'Health & Wellness Goals',
              'Progress Tracking & Celebration',
            ].map((module, index) => (
              <div key={index} className="flex items-start gap-3 bg-purple-50 p-4 rounded-lg">
                <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{module}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Options */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">Choose Your Option</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Workbook Only */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl mb-2">Workbook Only</h3>
                <p className="text-gray-600 mb-4">Perfect for self-guided transformation</p>
                <div className="mb-4">
                  <span className="text-5xl">$47</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Digital PDF workbook (150+ pages)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Printable worksheets & templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>12 comprehensive modules</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Lifetime access & updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Bonus: Goal-setting templates</span>
                </li>
              </ul>
              <button className="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 transition-colors">
                Purchase Workbook
              </button>
            </div>

            {/* Bundle with Coaching */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm">
                  Best Value
                </div>
              </div>
              <div className="text-center mb-6">
                <Video className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl mb-2">Workbook + 1-on-1 Session</h3>
                <p className="text-purple-100 mb-4">Accelerate your transformation</p>
                <div className="mb-2">
                  <span className="text-5xl">$197</span>
                </div>
                <p className="text-sm text-purple-100 line-through">$247 value</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Everything in Workbook Only</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>60-minute personalized coaching session</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Custom action plan creation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Follow-up email support (30 days)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Priority scheduling</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Bonus: Accountability check-ins</span>
                </li>
              </ul>
              <button className="w-full bg-white text-purple-600 py-4 rounded-lg hover:bg-gray-100 transition-colors">
                Get the Bundle
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">Sample Exercises</h2>
            <p className="text-xl text-gray-600">Get a glimpse of what's inside</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl mb-3">Values Discovery</h3>
              <p className="text-gray-600 mb-4">
                Identify your core values and how they align with your current life.
              </p>
              <div className="bg-white p-4 rounded-lg text-sm text-gray-700">
                "This exercise helped me realize what truly matters to me at this stage of life."
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl mb-3">Life Vision Board</h3>
              <p className="text-gray-600 mb-4">
                Create a visual representation of your ideal future.
              </p>
              <div className="bg-white p-4 rounded-lg text-sm text-gray-700">
                "Seeing my goals visually made them feel so much more achievable!"
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl mb-3">90-Day Action Plan</h3>
              <p className="text-gray-600 mb-4">
                Break down your goals into manageable steps.
              </p>
              <div className="bg-white p-4 rounded-lg text-sm text-gray-700">
                "The action plan made my transformation feel doable, not overwhelming."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Margaret T.',
                age: 56,
                text: "This workbook changed my life. I've discovered passions I didn't know I had and have a clear path forward.",
              },
              {
                name: 'Robert K.',
                age: 61,
                text: "The bundle with coaching was worth every penny. Having that personalized guidance made all the difference.",
              },
              {
                name: 'Susan L.',
                age: 53,
                text: "I've tried other self-help books, but this one is specifically for people like me. It really gets it.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div>{testimonial.name}</div>
                  <div className="text-sm text-gray-500">Age {testimonial.age}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-purple-50 rounded-2xl p-8">
            <h2 className="text-3xl mb-4">30-Day Money-Back Guarantee</h2>
            <p className="text-lg text-gray-600">
              We're confident this workbook will transform your life. If you're not completely satisfied 
              within 30 days, we'll refund your purchase—no questions asked.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}