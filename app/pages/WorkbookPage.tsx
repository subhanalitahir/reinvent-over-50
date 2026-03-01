'use client';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Check, BookOpen, Video, ArrowRight, Star, Sparkles, Shield, Award, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export function WorkbookPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 overflow-hidden">
        <motion.div className="orb orb-purple w-96 h-96 top-[-100px] right-[-60px]" animate={{ scale:[1,1.3,1], x:[0,-50,0] }} transition={{ duration:14, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div className="orb orb-pink w-80 h-80 bottom-[-80px] left-[-40px]" animate={{ scale:[1,1.2,1], y:[0,-40,0] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:2 }} />
        {[...Array(6)].map((_,i) => (
          <motion.div key={i} className="absolute w-3 h-3 rounded-full"
            style={{ background:`hsl(${260+i*18},70%,65%)`, left:`${5+i*17}%`, top:`${15+(i%3)*30}%`, opacity:0.4 }}
            animate={{ y:[0,-30,0], scale:[1,1.5,1], opacity:[0.3,0.7,0.3] }}
            transition={{ duration:4+i*0.8, repeat:Infinity, delay:i*0.4, ease:'easeInOut' }} />
        ))}
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity:0, x:-50 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, delay:0.2 }}>
              <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-purple-100"
                initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">150+ Pages of Pure Transformation</span>
              </motion.div>
              <motion.h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.3 }}>
                <span className="block text-gray-900">The Reinvention</span>
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">Workbook</span>
              </motion.h1>
              <motion.p className="text-xl text-gray-600 mb-10 leading-relaxed" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.5 }}>
                A comprehensive guide to discovering your purpose, setting meaningful goals, and creating an action plan for the life you've always dreamed of.
              </motion.p>
              <motion.div className="flex flex-wrap gap-4 mb-10" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.6 }}>
                {[{ icon:BookOpen, label:'150+ Pages' }, { icon:Award, label:'12 Modules' }, { icon:Zap, label:'Digital & Print' }].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-purple-100 shadow-sm text-gray-700 font-medium">
                    <item.icon className="w-4 h-4 text-purple-500" />
                    {item.label}
                  </div>
                ))}
              </motion.div>
              <motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.7 }}>
                <motion.a href="#pricing" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-2xl" whileHover={{ scale:1.05, boxShadow:'0 20px 60px rgba(124,58,237,0.4)' }} whileTap={{ scale:0.95 }}>
                  Get the Workbook
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.a>
                <motion.a href="#preview" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg border-2 border-purple-600 hover:bg-purple-50 transition-all shadow-lg" whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
                  Preview Inside
                </motion.a>
              </motion.div>
            </motion.div>
            <motion.div className="relative" initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.4 }}>
              <motion.div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20" animate={{ scale:[1,1.05,1] }} transition={{ duration:5, repeat:Infinity }} />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1654542645844-590f5b8c146a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsJTIwbm90ZWJvb2slMjB3cml0aW5nfGVufDF8fHx8MTc3MjI4ODE1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Reinvention workbook"
                className="rounded-3xl shadow-2xl w-full relative z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-24 bg-white relative overflow-hidden" id="preview">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">12 Transformative Modules</div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block text-gray-900">What's Inside</span>
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">the Workbook</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">12 comprehensive modules designed to guide you through every step of your transformation</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { num:'01', title:'Self-Discovery & Values Assessment' },
              { num:'02', title:'Life Audit & Reflection' },
              { num:'03', title:'Identifying Your Passions' },
              { num:'04', title:'Goal Setting Framework' },
              { num:'05', title:'Overcoming Limiting Beliefs' },
              { num:'06', title:'Building New Habits' },
              { num:'07', title:'Creating Your Action Plan' },
              { num:'08', title:'Time Management Strategies' },
              { num:'09', title:'Building Meaningful Relationships' },
              { num:'10', title:'Financial Planning for Your New Chapter' },
              { num:'11', title:'Health & Wellness Goals' },
              { num:'12', title:'Progress Tracking & Celebration' },
            ].map((module, index) => (
              <motion.div key={index}
                className="card-shine group flex items-center gap-4 bg-gradient-to-br from-purple-50 to-pink-50/50 rounded-2xl p-5 border border-purple-100/50 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all"
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.4, delay:index*0.04 }}
                whileHover={{ y:-4, scale:1.02 }}>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-shadow">
                  {module.num}
                </div>
                <span className="text-gray-800 font-medium group-hover:text-purple-700 transition-colors">{module.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Options */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/20 relative overflow-hidden" id="pricing">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">Simple Pricing</div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">Choose Your </span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Option</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Workbook Only */}
            <motion.div className="card-shine bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 hover:border-purple-200 hover:shadow-purple-100 transition-all"
              initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
              whileHover={{ y:-8 }}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Workbook Only</h3>
              <p className="text-gray-500 mb-6">Perfect for self-guided transformation</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">$47</span>
                <span className="text-gray-500">one-time</span>
              </div>
              <ul className="space-y-4 mb-10">
                {['Digital PDF workbook (150+ pages)', 'Printable worksheets & templates', '12 comprehensive modules', 'Lifetime access & updates', 'Bonus: Goal-setting templates'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <motion.button className="w-full border-2 border-purple-600 text-purple-600 py-5 rounded-2xl font-bold text-lg hover:bg-purple-600 hover:text-white transition-all"
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>
                Purchase Workbook
              </motion.button>
            </motion.div>

            {/* Bundle */}
            <motion.div className="relative card-shine bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white rounded-3xl shadow-2xl p-10 overflow-hidden"
              initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:0.1 }}
              whileHover={{ y:-8 }}>
              <motion.div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" animate={{ scale:[1,1.3,1] }} transition={{ duration:8, repeat:Infinity }} />
              <motion.div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full" animate={{ scale:[1,1.2,1] }} transition={{ duration:6, repeat:Infinity, delay:1 }} />
              <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-1.5 rounded-full text-sm font-bold shadow-lg"
                animate={{ y:[0,-4,0] }} transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}>
                Most Popular
              </motion.div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-1">Workbook + Coaching Bundle</h3>
                <p className="text-purple-100 mb-6">Accelerate your transformation with expert guidance</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-bold">$197</span>
                  <span className="text-purple-200">one-time</span>
                </div>
                <p className="text-sm text-purple-200 line-through mb-8">$247 value — save $50</p>
                <ul className="space-y-4 mb-10">
                  {['Everything in Workbook Only', '60-minute personalized coaching session', 'Custom action plan creation', 'Follow-up email support (30 days)', 'Priority scheduling', 'Bonus: Accountability check-ins'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white">{item}</span>
                    </li>
                  ))}
                </ul>
                <motion.button className="w-full bg-white text-purple-600 py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-purple-50 transition-all"
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>
                  Get the Bundle
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sample Preview */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">Sneak Peek</div>
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-gray-900">Sample </span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Exercises</span>
            </h2>
            <p className="text-xl text-gray-600">Get a glimpse of what's inside</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num:'01', title:'Values Discovery', desc:'Identify your core values and how they align with your current life.', quote:'This exercise helped me realize what truly matters to me at this stage of life.', gradient:'from-purple-500 to-pink-500' },
              { num:'02', title:'Life Vision Board', desc:'Create a visual representation of your ideal future.', quote:'Seeing my goals visually made them feel so much more achievable!', gradient:'from-blue-500 to-cyan-500' },
              { num:'03', title:'90-Day Action Plan', desc:'Break down your goals into manageable steps with clear milestones.', quote:'The action plan made my transformation feel doable, not overwhelming.', gradient:'from-orange-500 to-red-500' },
            ].map((ex, index) => (
              <motion.div key={index} className="card-shine group bg-gradient-to-br from-gray-50 to-purple-50/20 rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all"
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:index*0.1 }}
                whileHover={{ y:-8, scale:1.02 }}>
                <div className={`w-12 h-12 bg-gradient-to-br ${ex.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-sm mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  {ex.num}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{ex.title}</h3>
                <p className="text-gray-600 mb-5 leading-relaxed">{ex.desc}</p>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-600 italic">&#34;{ex.quote}&#34;</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">Real Results</div>
            <h2 className="text-5xl font-bold">
              <span className="text-gray-900">What Customers </span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Say</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name:'Margaret T.', age:56, role:'Teacher', text:"This workbook changed my life. I've discovered passions I didn't know I had and have a clear path forward.", rating:5 },
              { name:'Robert K.', age:61, role:'Retired Executive', text:"The bundle with coaching was worth every penny. Having that personalized guidance made all the difference.", rating:5 },
              { name:'Susan L.', age:53, role:'Entrepreneur', text:"I've tried other self-help books, but this one is specifically for people like me. It really gets it.", rating:5 },
            ].map((t, index) => (
              <motion.div key={index} className="card-shine bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100"
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:index*0.1 }}
                whileHover={{ y:-8, scale:1.02 }}>
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_,i) => <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">&#34;{t.text}&#34;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role} • Age {t.age}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 border border-green-100 shadow-2xl text-center overflow-hidden"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
            whileHover={{ scale:1.01 }}>
            <motion.div className="absolute -top-20 -right-20 w-60 h-60 bg-green-100 rounded-full opacity-50" animate={{ scale:[1,1.2,1] }} transition={{ duration:6, repeat:Infinity }} />
            <motion.div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-100 rounded-full opacity-50" animate={{ scale:[1,1.15,1] }} transition={{ duration:5, repeat:Infinity, delay:1 }} />
            <div className="relative z-10">
              <motion.div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                animate={{ rotate:[0,10,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}>
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">30-Day Money-Back Guarantee</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We're confident this workbook will transform your life. If you're not completely satisfied within 30 days, we'll refund your purchase — no questions asked.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-gray-600">
                {['No questions asked', 'Full refund within 24hrs', '100% risk-free'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}