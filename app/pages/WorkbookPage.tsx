'use client';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Check, BookOpen, Video, ArrowRight, Star, Sparkles, Shield, Award, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmailModal } from '../components/EmailModal';
import { useAuth } from '../context/AuthContext';

interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
  isFreeForMembers: boolean;
  includesBooking: boolean;
  isDigital: boolean;
  status: string;
}

export function WorkbookPage() {
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products?type=workbook');
      const json = await res.json();
      // Also fetch bundles
      const res2 = await fetch('/api/products?type=bundle');
      const json2 = await res2.json();
      const combined = [...(json?.data ?? []), ...(json2?.data ?? [])];
      setProducts(combined);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    const successParam = searchParams.get('success');
    const sessionId = searchParams.get('session_id');
    if (successParam === 'true') {
      setPurchaseSuccess(true);
      if (sessionId) fetch(`/api/checkout/verify?session_id=${sessionId}`).catch(() => {});
    }
    if (searchParams.get('canceled') === 'true') setCheckoutError('Payment was cancelled. You can try again.');
  }, [searchParams]);

  const isFreeForCurrentUser = (product: IProduct): boolean => {
    if (product.price === 0) return true;
    if (product.isFreeForMembers && (user?.role === 'member' || user?.role === 'admin')) return true;
    return false;
  };

  const doCheckout = async (productId: string, email?: string) => {
    setLoadingPlan(productId);
    setCheckoutError('');
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const body: Record<string, string> = { productId };
      if (email) body.email = email;
      const res = await fetch('/api/checkout/workbook', { method: 'POST', headers, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Checkout failed');
      if (data.data?.url) window.location.href = data.data.url;
      else if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setModalOpen(false);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleWorkbookCheckout = (product: IProduct) => {
    if (isFreeForCurrentUser(product)) {
      if (product.isFreeForMembers && product.price > 0 && user?.role !== 'member' && user?.role !== 'admin') {
        window.location.href = '/membership';
        return;
      }
      window.location.href = '/dashboard';
      return;
    }
    setCheckoutError('');
    if (user && token) {
      doCheckout(product._id);
    } else {
      setPendingProductId(product._id);
      setModalOpen(true);
    }
  };

  const handleModalSubmit = async (email: string) => {
    if (!pendingProductId) return;
    setModalOpen(false);
    await doCheckout(pendingProductId, email);
  };

  const pendingProduct = products.find(p => p._id === pendingProductId);

  return (
    <div className="pt-20">
      {/* Success Banner */}
      <AnimatePresence>
        {purchaseSuccess && (
          <motion.div
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-lg"
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <CheckCircle className="w-6 h-6" />
            Purchase complete! Check your email for your download link.
          </motion.div>
        )}
      </AnimatePresence>
      {checkoutError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-rose-500 text-white px-8 py-4 rounded-2xl shadow-2xl font-semibold">
          {checkoutError}
        </div>
      )}
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-linear-to-br from-purple-50 via-pink-50 to-fuchsia-50 overflow-hidden">
        <motion.div className="orb orb-purple w-96 h-96 -top-25 -right-15" animate={{ scale:[1,1.3,1], x:[0,-50,0] }} transition={{ duration:14, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div className="orb orb-pink w-80 h-80 -bottom-20 -left-10" animate={{ scale:[1,1.2,1], y:[0,-40,0] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:2 }} />
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
                <span className="block bg-linear-to-r from-purple-600 via-pink-600 to-fuchsia-500 bg-clip-text text-transparent">Workbook</span>
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
                <motion.a href="#pricing" className="group inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-2xl" whileHover={{ scale:1.05, boxShadow:'0 20px 60px rgba(124,58,237,0.4)' }} whileTap={{ scale:0.95 }}>
                  Get the Workbook
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.a>
                <motion.a href="#preview" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg border-2 border-purple-600 hover:bg-purple-50 transition-all shadow-lg" whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
                  Preview Inside
                </motion.a>
              </motion.div>
            </motion.div>
            <motion.div className="relative" initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.4 }}>
              <motion.div className="absolute -inset-4 bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20" animate={{ scale:[1,1.05,1] }} transition={{ duration:5, repeat:Infinity }} />
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
              <span className="block bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">the Workbook</span>
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
                className="card-shine group flex items-center gap-4 bg-linear-to-br from-purple-50 to-pink-50/50 rounded-2xl p-5 border border-purple-100/50 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all"
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.4, delay:index*0.04 }}
                whileHover={{ y:-4, scale:1.02 }}>
                <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-shadow">
                  {module.num}
                </div>
                <span className="text-gray-800 font-medium group-hover:text-purple-700 transition-colors">{module.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Options */}
      <section className="py-24 bg-linear-to-br from-gray-50 to-purple-50/20 relative overflow-hidden" id="pricing">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">Simple Pricing</div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">Choose Your </span>
              <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Option</span>
            </h2>
          </motion.div>
          {productsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No products available yet.</p>
              <p className="text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className={`grid gap-8 ${products.length === 1 ? 'max-w-md mx-auto' : products.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {products.map((product, index) => {
                const isFeatured = product.type === 'bundle' || product.includesBooking;
                const freeForUser = isFreeForCurrentUser(product);
                const priceDisplay = freeForUser ? (product.isFreeForMembers && product.price > 0 ? 'Free for Members' : 'Free') : `$${product.price.toFixed(2)}`;
                return (
                  <motion.div key={product._id}
                    className={`relative card-shine rounded-3xl shadow-2xl p-10 overflow-hidden ${isFeatured ? 'bg-linear-to-br from-purple-600 via-pink-600 to-purple-700 text-white' : 'bg-white border border-gray-100 hover:border-purple-200 hover:shadow-purple-100'}`}
                    initial={{ opacity:0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                    transition={{ duration:0.6, delay: index * 0.1 }}
                    whileHover={{ y:-8 }}>
                    {isFeatured && (
                      <>
                        <motion.div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" animate={{ scale:[1,1.3,1] }} transition={{ duration:8, repeat:Infinity }} />
                        <motion.div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full" animate={{ scale:[1,1.2,1] }} transition={{ duration:6, repeat:Infinity, delay:1 }} />
                        <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-1.5 rounded-full text-sm font-bold shadow-lg"
                          animate={{ y:[0,-4,0] }} transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}>
                          Most Popular
                        </motion.div>
                      </>
                    )}
                    {(freeForUser || product.isFreeForMembers) && (
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${isFeatured ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                        {product.price === 0 ? 'Free' : 'Member Free'}
                      </div>
                    )}
                    <div className="relative z-10">
                      {product.imageUrl ? (
                        <div className="rounded-2xl overflow-hidden mb-6 h-40 shadow-lg">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${isFeatured ? 'bg-white/20' : 'bg-linear-to-br from-purple-500 to-pink-500'}`}>
                          {product.includesBooking ? <Video className="w-8 h-8 text-white" /> : <BookOpen className="w-8 h-8 text-white" />}
                        </div>
                      )}
                      <h3 className={`text-2xl font-bold mb-1 ${isFeatured ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
                      <p className={`mb-6 text-sm line-clamp-2 ${isFeatured ? 'text-purple-100' : 'text-gray-500'}`}>{product.description}</p>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-5xl font-bold ${isFeatured ? 'text-white' : 'bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'}`}>
                          {priceDisplay}
                        </span>
                        {product.price > 0 && !freeForUser && <span className={isFeatured ? 'text-purple-200' : 'text-gray-500'}>one-time</span>}
                      </div>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <p className={`text-sm line-through mb-4 ${isFeatured ? 'text-purple-200' : 'text-gray-400'}`}>${product.compareAtPrice.toFixed(2)} value</p>
                      )}
                      <motion.button
                        onClick={() => handleWorkbookCheckout(product)}
                        disabled={loadingPlan !== null}
                        className={`w-full mt-8 py-5 rounded-2xl font-bold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed ${isFeatured ? 'bg-white text-purple-600 shadow-xl hover:bg-purple-50' : 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'}`}
                        whileHover={{ scale: loadingPlan ? 1 : 1.02 }}
                        whileTap={{ scale: loadingPlan ? 1 : 0.98 }}>
                        {loadingPlan === product._id ? 'Redirectingâ€¦' : freeForUser ? (user ? 'Access Now' : 'Get Free Access') : `Get ${product.name}`}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
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
              <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Exercises</span>
            </h2>
            <p className="text-xl text-gray-600">Get a glimpse of what's inside</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num:'01', title:'Values Discovery', desc:'Identify your core values and how they align with your current life.', quote:'This exercise helped me realize what truly matters to me at this stage of life.', gradient:'from-purple-500 to-pink-500' },
              { num:'02', title:'Life Vision Board', desc:'Create a visual representation of your ideal future.', quote:'Seeing my goals visually made them feel so much more achievable!', gradient:'from-blue-500 to-cyan-500' },
              { num:'03', title:'90-Day Action Plan', desc:'Break down your goals into manageable steps with clear milestones.', quote:'The action plan made my transformation feel doable, not overwhelming.', gradient:'from-fuchsia-500 to-purple-500' },
            ].map((ex, index) => (
              <motion.div key={index} className="card-shine group bg-linear-to-br from-gray-50 to-purple-50/20 rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all"
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:index*0.1 }}
                whileHover={{ y:-8, scale:1.02 }}>
                <div className={`w-12 h-12 bg-linear-to-br ${ex.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-sm mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}>
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
      <section className="py-24 bg-linear-to-br from-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">Real Results</div>
            <h2 className="text-5xl font-bold">
              <span className="text-gray-900">What Customers </span>
              <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Say</span>
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
                  <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role} â€¢ Age {t.age}</div>
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
          <motion.div className="relative bg-linear-to-br from-green-50 to-emerald-50 rounded-3xl p-12 border border-green-100 shadow-2xl text-center overflow-hidden"
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
            whileHover={{ scale:1.01 }}>
            <motion.div className="absolute -top-20 -right-20 w-60 h-60 bg-green-100 rounded-full opacity-50" animate={{ scale:[1,1.2,1] }} transition={{ duration:6, repeat:Infinity }} />
            <motion.div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-100 rounded-full opacity-50" animate={{ scale:[1,1.15,1] }} transition={{ duration:5, repeat:Infinity, delay:1 }} />
            <div className="relative z-10">
              <motion.div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                animate={{ rotate:[0,10,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}>
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">30-Day Money-Back Guarantee</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We're confident this workbook will transform your life. If you're not completely satisfied within 30 days, we'll refund your purchase â€” no questions asked.
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

      <EmailModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setPendingProductId(null); }}
        onSubmit={handleModalSubmit}
        title="One last step!"
        subtitle={pendingProduct ? `Enter your email to get "${pendingProduct.name}". Your download link will be sent there instantly.` : 'Enter your email to proceed to checkout.'}
        ctaLabel="Proceed to Checkout "
        loading={loadingPlan !== null}
      />
    </div>
  );
}
