'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useSpring, useTransform, useInView } from 'motion/react';
import {
  User, Calendar, ShoppingBag, Settings, LogOut, Crown,
  AlertCircle, Loader2, CheckCircle, Eye, EyeOff, Clock,
  ChevronRight, Shield, Edit3, Check, X, Bell, LayoutDashboard,
  ChevronLeft, TrendingUp, Activity, Menu, Sparkles, Zap, Star,
  BookOpen, Video, MapPin, Lock, ExternalLink, Users,
} from 'lucide-react';
import { useAuth, IUser } from '@/app/context/AuthContext';

/* ─────────── Types ─────────── */
interface IMembership {
  _id: string;
  plan: 'community' | 'growth' | 'transformation' | 'vip';
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'pending';
  price: number;
  startDate: string;
  endDate?: string;
  trialEndsAt?: string;
}

interface IBooking {
  _id: string;
  sessionType: string;
  scheduledAt: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guestName: string;
  duration: number;
  meetingLink?: string;
}

interface IOrder {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    product: { _id: string; name: string; type: string } | null;
    event: { _id: string; title: string } | null;
    quantity: number;
    price: number;
  }[];
}

interface IEvent {
  _id: string;
  title: string;
  description?: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  startDate: string;
  time?: string;
  location?: string;
  virtualLink?: string;
  price: number;
  isFree: boolean;
  isFreeForMembers: boolean;
  status: string;
  imageUrl?: string;
}

interface IDashboardProduct {
  _id: string;
  name: string;
  description?: string;
  type: string;
  price: number;
  isFreeForMembers: boolean;
  status: string;
  imageUrl?: string;
  downloadLink?: string;
}

type Tab = 'overview' | 'sessions' | 'orders' | 'events' | 'workbooks' | 'settings';

/* ─────────── Helpers ─────────── */
const planColors: Record<string, string> = {
  community: 'from-blue-500 to-cyan-500',
  growth: 'from-green-500 to-emerald-500',
  transformation: 'from-purple-600 to-pink-600',
  vip: 'from-amber-500 to-orange-500',
};

const statusBadge: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-600',
  trial: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-purple-100 text-purple-700',
  paid: 'bg-green-100 text-green-700',
  refunded: 'bg-orange-100 text-orange-700',
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ─────────── Animated Number Counter ─────────── */
function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, v => Math.round(v).toString());

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

/* ─────────── Sidebar ─────────── */
const navSections = [
  { items: [{ id: 'overview' as Tab, label: 'Overview', Icon: LayoutDashboard }] },
  {
    heading: 'COACHING',
    items: [
      { id: 'sessions' as Tab, label: 'My Sessions', Icon: Calendar },
      { id: 'events' as Tab, label: 'Events', Icon: Users },
      { id: 'workbooks' as Tab, label: 'Workbooks', Icon: BookOpen },
      { id: 'orders' as Tab, label: 'Orders', Icon: ShoppingBag },
    ],
  },
  {
    heading: 'ACCOUNT',
    items: [{ id: 'settings' as Tab, label: 'Settings', Icon: Settings }],
  },
];

function Sidebar({
  tab, setTab, user, onLogout, collapsed, setCollapsed, mobileOpen, setMobileOpen,
}: {
  tab: Tab; setTab: (t: Tab) => void; user: IUser; onLogout: () => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
  mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
}) {
  const content = (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-[#0f0720]" />
      {/* Glowing orbs */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-32 h-32 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative flex items-center gap-3 px-4 py-4 border-b border-white/10 overflow-hidden min-h-16">
        <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
          <img src="/img/logo.png" alt="Reinvent You Over 50" className="h-10 w-auto brightness-0 invert" />
        </Link>
        {!collapsed && (
          <motion.div
            className="min-w-0 flex-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[11px] font-bold text-white leading-tight">Reinvent You Over 50</p>
            <p className="text-[9px] text-purple-300/70 uppercase tracking-widest mt-0.5">Transform Your Life</p>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex ml-auto shrink-0 w-6 h-6 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden ml-auto shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-white/40 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navSections.map((section, si) => (
          <div key={si} className={si > 0 ? 'pt-4' : ''}>
            {section.heading && !collapsed && (
              <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.2em] px-3 mb-2">
                {section.heading}
              </p>
            )}
            {section.heading && collapsed && <div className="h-px bg-white/10 mx-2 mb-3" />}
            {section.items.map(({ id, label, Icon }) => (
              <motion.button
                key={id}
                onClick={() => { setTab(id); setMobileOpen(false); }}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all overflow-hidden ${
                  tab === id
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/90 hover:bg-white/5'
                }`}
                whileHover={{ x: tab === id ? 0 : 3 }}
                whileTap={{ scale: 0.97 }}
                title={collapsed ? label : undefined}
              >
                {tab === id && (
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-purple-600/80 to-pink-600/60 rounded-xl"
                    layoutId="activeNav"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {tab === id && (
                  <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 to-pink-500/10 rounded-xl blur-sm" />
                )}
                <Icon className={`relative w-4 h-4 shrink-0 ${tab === id ? 'text-white' : 'text-white/40'}`} />
                {!collapsed && <span className="relative truncate">{label}</span>}
                {tab === id && !collapsed && (
                  <motion.div
                    className="relative ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        ))}
      </nav>

      {/* User card & logout */}
      <div className="relative border-t border-white/10 p-3 space-y-1">
        {!collapsed && (
          <motion.div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10"
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-900/50">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0f0720]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.name.split(' ')[0]}</p>
              <p className="text-[10px] text-white/40 truncate capitalize">{user.role}</p>
            </div>
          </motion.div>
        )}
        {collapsed && (
          <div className="flex justify-center py-1">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0f0720]" />
            </div>
          </div>
        )}
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          whileHover={{ x: 2 }}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Sign Out'}
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        className="fixed top-0 left-0 h-screen z-70 hidden lg:flex flex-col shadow-2xl shadow-black/30"
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {content}
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-75 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 h-screen w-60 z-80 flex flex-col shadow-2xl"
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────── Sessions Activity Chart (SVG — animated draw) ─────────── */
function SessionsChart({ bookings }: { bookings: IBooking[] }) {
  const W = 520, H = 150, padX = 30, padY = 20;
  const [drawn, setDrawn] = useState(false);
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => { if (inView) setTimeout(() => setDrawn(true), 100); }, [inView]);

  const months = useMemo(() => {
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      result.push({ label: d.toLocaleDateString('en-US', { month: 'short' }), year: d.getFullYear(), month: d.getMonth() });
    }
    return result;
  }, []);

  const data = useMemo(() =>
    months.map(m => ({
      label: m.label,
      count: bookings.filter(b => {
        const d = new Date(b.scheduledAt);
        return d.getFullYear() === m.year && d.getMonth() === m.month;
      }).length,
    })),
  [bookings, months]);

  const maxVal = Math.max(...data.map(d => d.count), 4);
  const stepX = (W - padX * 2) / (data.length - 1);
  const pts = data.map((d, i) => ({
    x: padX + i * stepX,
    y: padY + (1 - d.count / maxVal) * (H - padY * 2.5),
    count: d.count,
    label: d.label,
  }));

  // Smooth cubic bezier
  function bezierPath(points: typeof pts) {
    return points.map((p, i) => {
      if (i === 0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `C${cx.toFixed(1)},${prev.y.toFixed(1)} ${cx.toFixed(1)},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');
  }

  const pathD = bezierPath(pts);
  const areaD = `${pathD} L${pts[pts.length - 1].x},${H - padY} L${pts[0].x},${H - padY} Z`;

  // Approximate path length for stroke-dasharray animation
  const pathLen = 600;

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="areaFill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="lineStroke2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Horizontal grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <g key={i}>
          <line
            x1={padX} y1={padY + f * (H - padY * 2.5)}
            x2={W - padX} y2={padY + f * (H - padY * 2.5)}
            stroke="#f3f4f6" strokeWidth={1} strokeDasharray={i === 4 ? '0' : '4 4'}
          />
          <text x={padX - 6} y={padY + f * (H - padY * 2.5) + 3.5} textAnchor="end" fontSize={8} fill="#d1d5db">
            {Math.round(maxVal * (1 - f))}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <motion.path
        d={areaD}
        fill="url(#areaFill2)"
        initial={{ opacity: 0 }}
        animate={{ opacity: drawn ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />

      {/* Animated line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#lineStroke2)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        strokeDasharray={pathLen}
        animate={{ strokeDashoffset: drawn ? 0 : pathLen }}
        initial={{ strokeDashoffset: pathLen }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Data points */}
      {pts.map((p, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0 }}
          transition={{ delay: 1.0 + i * 0.07, type: 'spring', stiffness: 400 }}
        >
          <circle cx={p.x} cy={p.y} r={8} fill="#7c3aed" opacity={0.08} />
          <circle cx={p.x} cy={p.y} r={4} fill="white" stroke="#7c3aed" strokeWidth={2.5} filter="url(#glow)" />
          {p.count > 0 && (
            <text x={p.x} y={p.y - 11} textAnchor="middle" fontSize={9} fill="#7c3aed" fontWeight="700">{p.count}</text>
          )}
        </motion.g>
      ))}

      {/* X labels */}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={H} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight="500">{p.label}</text>
      ))}
    </svg>
  );
}

/* ─────────── Main Dashboard ─────────── */
export default function DashboardPage() {
  const router = useRouter();
  const { user, token, loading: authLoading, logout, updateUser } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Data state
  const [membership, setMembership] = useState<IMembership | null>(null);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [dashProducts, setDashProducts] = useState<IDashboardProduct[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Profile editing
  const [editName, setEditName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState(false);

  // Change password
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setDataLoading(true);
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [memberRes, bookingsRes, ordersRes, eventsRes, productsRes] = await Promise.all([
        fetch('/api/members/me', { headers }),
        fetch('/api/bookings/my', { headers }),
        fetch('/api/orders/my', { headers }),
        fetch('/api/events?limit=50', { headers }),
        fetch('/api/products?limit=50', { headers }),
      ]);
      if (memberRes.ok) setMembership((await memberRes.json()).data);
      if (bookingsRes.ok) setBookings((await bookingsRes.json()).data ?? []);
      if (ordersRes.ok) setOrders((await ordersRes.json()).data ?? []);
      if (eventsRes.ok) {
        const evData = await eventsRes.json();
        setEvents((evData.data ?? evData.events ?? []).filter((e: IEvent) => e.status === 'published'));
      }
      if (productsRes.ok) {
        const prData = await productsRes.json();
        const all: IDashboardProduct[] = prData.data ?? prData.products ?? [];
        setDashProducts(all.filter(p => p.type === 'workbook' || p.type === 'bundle'));
      }
    } catch { /* ignore */ }
    finally { setDataLoading(false); }
  }, [token]);

  useEffect(() => { if (token) fetchData(); }, [token, fetchData]);
  useEffect(() => { if (user) setEditName(user.name); }, [user]);

  const handleSaveName = async () => {
    if (!editName.trim() || editName.trim().length < 2) { setNameError('Name must be at least 2 characters'); return; }
    setNameLoading(true); setNameError('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setNameError(data.message || 'Failed to update name'); return; }
      updateUser(data.data?.user ?? data.data);
      setIsEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch { setNameError('Something went wrong'); }
    finally { setNameLoading(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmNewPassword) { setPwError('New passwords do not match'); return; }
    if (pwForm.newPassword.length < 8) { setPwError('New password must be at least 8 characters'); return; }
    setPwLoading(true); setPwError('');
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.message || 'Failed to change password'); return; }
      setPwSuccess(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setPwSuccess(false), 4000);
    } catch { setPwError('Something went wrong'); }
    finally { setPwLoading(false); }
  };

  const handleLogout = () => { logout(); router.push('/'); };

  if (authLoading) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#0f0720]">
        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
        <motion.div
          className="flex flex-col items-center gap-5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute inset-0 rounded-full bg-linear-to-br from-purple-600 to-pink-600 opacity-20"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl shadow-purple-900/40">
              <Sparkles className="w-9 h-9 text-white" />
            </div>
          </div>
          <div className="text-center">
            <motion.p
              className="text-white font-bold text-lg"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              Loading your dashboard…
            </motion.p>
            <p className="text-purple-300/60 text-sm mt-1">Preparing your experience</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  const tabLabels: Record<Tab, string> = {
    overview: 'Overview',
    sessions: 'My Sessions',
    orders: 'Order History',
    events: 'Events',
    workbooks: 'Workbooks',
    settings: 'Settings',
  };

  const sidebarW = sidebarCollapsed ? 72 : 240;

  const hasNotification = bookings.some(
    b => b.status === 'confirmed' && new Date(b.scheduledAt) > new Date(),
  );

  return (
    /* Fixed overlay covering the global header */
    <div className="fixed inset-0 z-60 bg-gray-50 flex overflow-hidden">
      <Sidebar
        tab={tab}
        setTab={setTab}
        user={user}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content shifts with sidebar */}
      <motion.div
        className="flex flex-col flex-1 min-w-0 overflow-hidden"
        animate={{ marginLeft: sidebarW }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{ marginLeft: sidebarW }}
      >
        {/* ── Top bar ── */}
        <motion.div
          className="shrink-0 px-5 py-3.5 flex items-center justify-between border-b"
          style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(124,58,237,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-[15px] font-bold leading-tight">
                <span className="bg-linear-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">{tabLabels[tab]}</span>
              </h1>
              <p className="text-[11px] text-gray-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-purple-50 text-gray-500 hover:text-purple-600 transition-colors border border-gray-100 shadow-sm"
            >
              <Bell className="w-4 h-4" />
              {hasNotification && (
                <>
                  <motion.span
                    className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-pink-500"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-pink-500" />
                </>
              )}
            </motion.button>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-purple-50 text-gray-500 hover:text-purple-600 transition-colors border border-gray-100 shadow-sm"
            >
              <Activity className="w-4 h-4" />
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-9 h-9 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-purple-200/60 cursor-pointer"
            >
              {user.name.charAt(0).toUpperCase()}
            </motion.div>
          </div>
        </motion.div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 lg:p-6">
            <AnimatePresence mode="wait">
              {tab === 'overview' && (
                <OverviewTab
                  key="overview"
                  user={user}
                  membership={membership}
                  bookings={bookings}
                  orders={orders}
                  loading={dataLoading}
                  setTab={setTab}
                />
              )}
              {tab === 'sessions' && (
                <SessionsTab key="sessions" bookings={bookings} loading={dataLoading} />
              )}
              {tab === 'orders' && (
                <OrdersTab key="orders" orders={orders} loading={dataLoading} />
              )}
              {tab === 'events' && (
                <EventsTab
                  key="events"
                  events={events}
                  orders={orders}
                  userRole={user.role}
                  loading={dataLoading}
                />
              )}
              {tab === 'workbooks' && (
                <WorkbooksTab
                  key="workbooks"
                  products={dashProducts}
                  orders={orders}
                  userRole={user.role}
                  loading={dataLoading}
                />
              )}
              {tab === 'settings' && (
                <SettingsTab
                  key="settings"
                  user={user}
                  editName={editName}
                  setEditName={setEditName}
                  isEditingName={isEditingName}
                  setIsEditingName={setIsEditingName}
                  nameLoading={nameLoading}
                  nameError={nameError}
                  nameSuccess={nameSuccess}
                  onSaveName={handleSaveName}
                  pwForm={pwForm}
                  setPwForm={setPwForm}
                  showPw={showPw}
                  setShowPw={setShowPw}
                  pwLoading={pwLoading}
                  pwError={pwError}
                  pwSuccess={pwSuccess}
                  onChangePassword={handleChangePassword}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════
   Overview Tab
═══════════════════════════════ */
function OverviewTab({
  user, membership, bookings, orders, loading, setTab,
}: {
  user: IUser;
  membership: IMembership | null;
  bookings: IBooking[];
  orders: IOrder[];
  loading: boolean;
  setTab: (t: Tab) => void;
}) {
  if (loading) return <TabSkeleton />;

  const upcomingBookings = bookings.filter(
    b => b.status !== 'cancelled' && new Date(b.scheduledAt) > new Date(),
  );
  const completedSessions = bookings.filter(b => b.status === 'completed').length;

  const stats = [
    {
      label: 'Current Plan',
      value: membership ? membership.plan.charAt(0).toUpperCase() + membership.plan.slice(1) : 'No Plan',
      numericValue: undefined as number | undefined,
      sub: membership ? membership.status : 'Inactive',
      icon: <Crown className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
      trend: membership?.status === 'active' ? 'Active' : undefined,
    },
    {
      label: 'Upcoming Sessions',
      value: String(upcomingBookings.length),
      numericValue: upcomingBookings.length,
      sub: `${completedSessions} completed`,
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      trend: upcomingBookings.length > 0 ? 'Scheduled' : undefined,
    },
    {
      label: 'Total Orders',
      value: String(orders.length),
      numericValue: orders.length,
      sub: orders.length > 0 ? `$${orders.reduce((s, o) => s + (o.total ?? 0), 0).toFixed(0)} spent` : 'No orders yet',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'from-orange-500 to-amber-500',
      bg: 'bg-orange-50',
      trend: undefined,
    },
    {
      label: 'Member Since',
      value: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      numericValue: undefined as number | undefined,
      sub: `${Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      trend: undefined,
    },
  ];

  const recentSessions = bookings.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm overflow-hidden cursor-default group"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            {/* Glow accent on hover */}
            <div className={`absolute inset-0 bg-linear-to-br ${s.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none`} />
            {/* Coloured top border */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${s.color}`} />

            <div className="flex items-start justify-between mb-3">
              <motion.div
                className={`w-10 h-10 rounded-xl bg-linear-to-br ${s.color} flex items-center justify-center text-white`}
                style={{ boxShadow: `0 4px 14px rgba(124,58,237,0.25)` }}
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                {s.icon}
              </motion.div>
              {s.trend && (
                <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> {s.trend}
                </span>
              )}
            </div>

            <p className="text-2xl font-bold text-gray-900 leading-tight tabular-nums">
              {s.numericValue !== undefined ? <AnimatedNumber value={s.numericValue} /> : s.value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">{s.label}</p>
            <p className="text-[11px] text-gray-400 mt-1 capitalize">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Chart + Membership row ── */}
      <div className="grid xl:grid-cols-3 gap-4">
        {/* Sessions chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-purple-500 to-pink-500" />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">Session Activity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Sessions booked over the last 6 months</p>
            </div>
            <motion.button
              onClick={() => setTab('sessions')}
              whileHover={{ x: 2 }}
              className="text-xs font-semibold text-purple-600 hover:text-pink-600 transition-colors flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
          <SessionsChart bookings={bookings} />
        </motion.div>

        {/* Membership card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-amber-400 to-orange-500" />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">Membership</h2>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
            >
              <Crown className="w-4.5 h-4.5 text-amber-500" />
            </motion.div>
          </div>
          {membership ? (
            <>
              <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl bg-linear-to-r ${planColors[membership.plan] ?? 'from-gray-400 to-gray-500'} text-white text-sm font-bold mb-4 self-start shadow-md`}>
                <Sparkles className="w-3.5 h-3.5" />
                {membership.plan.charAt(0).toUpperCase() + membership.plan.slice(1)}
              </div>
              <div className="space-y-3 text-sm flex-1">
                {[
                  { label: 'Status', value: membership.status, isStatus: true },
                  { label: 'Billing', value: membership.billingCycle, isStatus: false },
                  { label: 'Price', value: `$${membership.price}/mo`, isStatus: false },
                  { label: 'Renewed', value: fmt(membership.startDate), isStatus: false },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-400 text-xs font-medium">{row.label}</span>
                    {row.isStatus ? (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusBadge[membership.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {membership.status}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-700 capitalize">{row.value}</span>
                    )}
                  </div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-4">
                <Link
                  href="/membership"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-purple-300/50 transition-shadow"
                >
                  Manage Plan <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <motion.div
                className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-3"
                animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 16px rgba(124,58,237,0.2)', '0 0 0px rgba(124,58,237,0)'] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                <Crown className="w-6 h-6 text-purple-400" />
              </motion.div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No active plan</p>
              <p className="text-xs text-gray-400 mb-4">Unlock coaching, events & more</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/membership"
                  className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Explore Plans
                </Link>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Recent Sessions table ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-cyan-500" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="text-[15px] font-bold text-gray-900">Recent Sessions</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/booking"
              className="text-xs font-semibold px-3 py-1.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-sm"
            >
              + Book New
            </Link>
          </motion.div>
        </div>
        {recentSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-blue-300" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No sessions yet</p>
            <p className="text-xs text-gray-400 mt-1">Book your first coaching session</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/40">
                  {['Session Type', 'Guest', 'Date & Time', 'Duration', 'Status', ''].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <motion.tbody
                variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="show"
              >
                {recentSessions.map((b) => (
                  <motion.tr
                    key={b._id}
                    variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                    whileHover={{ backgroundColor: 'rgba(124,58,237,0.03)' }}
                    className="border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-purple-200/60">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-gray-800 capitalize">{b.sessionType}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{b.guestName}</td>
                    <td className="px-5 py-3.5 text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {fmt(b.scheduledAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{b.duration} min</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${statusBadge[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {b.meetingLink && (
                        <motion.a
                          href={b.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          className="text-xs font-semibold text-purple-600 hover:text-pink-600 transition-colors"
                        >
                          Join →
                        </motion.a>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════
   Sessions Tab
═══════════════════════════════ */
function SessionsTab({ bookings, loading }: { bookings: IBooking[]; loading: boolean }) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  if (loading) return <TabSkeleton />;

  const filtered = filter === 'all' ? bookings
    : filter === 'upcoming' ? bookings.filter(b => b.status !== 'cancelled' && new Date(b.scheduledAt) > new Date())
    : bookings.filter(b => b.status === filter);

  const filters: { id: typeof filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Coaching Sessions</h2>
          <p className="text-xs text-gray-400 mt-0.5">{bookings.length} total sessions</p>
        </div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-200/50 self-start"
          >
            + Book Session
          </Link>
        </motion.div>
      </div>

      {/* Filter tabs — glassmorphism pill container */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(243,244,246,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(124,58,237,0.08)' }}>
        {filters.map(f => (
          <motion.button
            key={f.id}
            onClick={() => setFilter(f.id)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === f.id ? 'text-purple-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {filter === f.id && (
              <motion.div
                layoutId="filterPill"
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{f.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-purple-500 to-pink-500" />
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
              <Calendar className="w-7 h-7 text-blue-300" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No sessions found</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Book your first coaching session</p>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/booking" className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold shadow-md">
                Book a Session
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/40">
                  {['Session', 'Guest Name', 'Date & Time', 'Duration', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <motion.tbody
                variants={{ show: { transition: { staggerChildren: 0.055 } } }}
                initial="hidden"
                animate="show"
              >
                {filtered.map((b) => (
                  <motion.tr
                    key={b._id}
                    variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
                    whileHover={{ backgroundColor: 'rgba(124,58,237,0.025)' }}
                    className="border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-purple-200/50">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-gray-800 capitalize">{b.sessionType}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">
                          {b.guestName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-700 font-medium">{b.guestName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {fmt(b.scheduledAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{b.duration} min</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${statusBadge[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {b.meetingLink ? (
                        <motion.a
                          href={b.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.06 }}
                          className="px-3 py-1.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xs font-semibold shadow-sm shadow-purple-200/40"
                        >
                          Join Meeting
                        </motion.a>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════
   Orders Tab
═══════════════════════════════ */
function OrdersTab({ orders, loading }: { orders: IOrder[]; loading: boolean }) {
  if (loading) return <TabSkeleton />;

  const totalSpent = orders.reduce((s, o) => s + (o.total ?? 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {/* Summary banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-linear-to-r from-orange-500 to-amber-500 text-white relative overflow-hidden shadow-md shadow-orange-200/50"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
          <div>
            <h2 className="text-lg font-bold">Order History</h2>
            <p className="text-orange-100 text-sm mt-0.5">
              {orders.length} orders · <span className="font-bold text-white">${totalSpent.toFixed(2)}</span> total spent
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/workbook"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold border border-white/25 transition-colors"
            >
              Browse Products
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-3"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <ShoppingBag className="w-7 h-7 text-orange-300" />
          </motion.div>
          <p className="text-sm font-semibold text-gray-600">No orders yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Your purchases will appear here</p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/workbook" className="px-4 py-2 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold shadow-md">
              Browse Products
            </Link>
          </motion.div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-orange-400 to-amber-400" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/40">
                  {['Order', 'Date', 'Items', 'Total', 'Status'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <motion.tbody
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                initial="hidden"
                animate="show"
              >
                {orders.map((o) => (
                  <motion.tr
                    key={o._id}
                    variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
                    whileHover={{ backgroundColor: 'rgba(249,115,22,0.025)' }}
                    className="border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white shrink-0 shadow-sm shadow-orange-200/50">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-gray-800 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{fmt(o.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        {o.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-xs text-gray-600">
                            {item.product?.name ?? 'Product'} <span className="text-gray-400">×{item.quantity}</span>
                          </p>
                        ))}
                        {o.items.length > 2 && (
                          <p className="text-[10px] text-gray-400">+{o.items.length - 2} more</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-gray-900">${o.total?.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${statusBadge[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {o.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════
   Events Tab
═══════════════════════════════ */
function EventsTab({
  events, orders, userRole, loading,
}: {
  events: IEvent[];
  orders: IOrder[];
  userRole: string;
  loading: boolean;
}) {
  if (loading) return <TabSkeleton />;

  const isMember = userRole === 'member' || userRole === 'admin';
  const purchasedEventIds = new Set(
    orders.flatMap(o =>
      o.items
        .filter(i => i.event)
        .map(i => i.event!._id)
    )
  );

  const canAccess = (e: IEvent) =>
    e.isFree || (e.isFreeForMembers && isMember) || purchasedEventIds.has(e._id);

  const upcoming = events.filter(e => new Date(e.startDate) >= new Date());
  const accessible = upcoming.filter(canAccess);
  const locked = upcoming.filter(e => !canAccess(e));

  const futureOnly = (e: IEvent) => new Date(e.date) >= new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-purple-500 to-pink-500" />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <Users className="w-3.5 h-3.5" />
              </span>
              Upcoming Events
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {accessible.length} event{accessible.length !== 1 ? 's' : ''} accessible to you
            </p>
          </div>
          <a
            href="/events"
            className="text-xs font-semibold px-3 py-1.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            Browse All <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Accessible events */}
      {accessible.length === 0 && locked.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
            <Calendar className="w-7 h-7 text-purple-300" />
          </div>
          <p className="text-sm font-semibold text-gray-600">No upcoming events</p>
          <p className="text-xs text-gray-400 mt-1">Check back soon for new events</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {accessible.filter(futureOnly).map(event => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {event.imageUrl && (
                <div className="h-36 overflow-hidden">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug">{event.title}</h3>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    event.type === 'virtual'
                      ? 'bg-blue-100 text-blue-700'
                      : event.type === 'hybrid'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                  }`}>
                    {event.type}
                  </span>
                </div>
                {event.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{event.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {fmt(event.startDate)}{event.time ? ` · ${event.time}` : ''}
                  </span>
                  {event.type !== 'virtual' && event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.location}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-green-600">
                    {event.isFree ? 'Free' : event.isFreeForMembers && isMember ? 'Free for Members' : purchasedEventIds.has(event._id) ? 'Purchased' : `$${event.price.toFixed(2)}`}
                  </span>
                  {event.type === 'virtual' && event.meetingLink ? (
                    <a
                      href={event.virtualLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold px-3 py-1.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center gap-1 hover:opacity-90 transition-opacity"
                    >
                      Join <Video className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{event.location ?? 'In-Person'}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Locked events */}
          {locked.map(event => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden opacity-70"
            >
              {event.imageUrl && (
                <div className="h-36 overflow-hidden grayscale">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-700 text-sm leading-snug">{event.title}</h3>
                  <Lock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{fmt(event.startDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">${event.price.toFixed(2)}</span>
                  <a
                    href="/events"
                    className="text-xs font-semibold px-3 py-1.5 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    Register
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════
   Workbooks Tab
═══════════════════════════════ */
function WorkbooksTab({
  products, orders, userRole, loading,
}: {
  products: IDashboardProduct[];
  orders: IOrder[];
  userRole: string;
  loading: boolean;
}) {
  if (loading) return <TabSkeleton />;

  const isMember = userRole === 'member' || userRole === 'admin';
  const purchasedProductIds = new Set(
    orders.flatMap(o =>
      o.items
        .filter(i => i.product)
        .map(i => i.product!._id)
    )
  );

  const canAccess = (p: IDashboardProduct) =>
    p.price === 0 || (p.isFreeForMembers && isMember) || purchasedProductIds.has(p._id);

  const accessible = products.filter(canAccess);
  const locked = products.filter(p => !canAccess(p));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-500 to-purple-500" />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                <BookOpen className="w-3.5 h-3.5" />
              </span>
              My Workbooks
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {accessible.length} workbook{accessible.length !== 1 ? 's' : ''} accessible to you
            </p>
          </div>
          <a
            href="/workbook"
            className="text-xs font-semibold px-3 py-1.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            Browse All <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <BookOpen className="w-7 h-7 text-indigo-300" />
          </div>
          <p className="text-sm font-semibold text-gray-600">No workbooks available yet</p>
          <p className="text-xs text-gray-400 mt-1">Check back soon</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accessible.map(product => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {product.imageUrl ? (
                <div className="h-32 overflow-hidden">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-32 bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-indigo-200" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug">{product.name}</h3>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${product.type === 'bundle' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {product.type}
                  </span>
                </div>
                {product.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-semibold text-green-600">
                    {product.price === 0 ? 'Free' : product.isFreeForMembers && isMember ? 'Free for Members' : `$${product.price.toFixed(2)}`}
                  </span>
                  {product.downloadLink ? (
                    <a
                      href={product.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold px-3 py-1.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg flex items-center gap-1 hover:opacity-90 transition-opacity"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Accessible
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Locked workbooks */}
          {locked.map(product => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden opacity-60"
            >
              {product.imageUrl ? (
                <div className="h-32 overflow-hidden grayscale">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-32 bg-gray-50 flex items-center justify-center">
                  <Lock className="w-10 h-10 text-gray-200" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-600 text-sm leading-snug">{product.name}</h3>
                  <Lock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-semibold text-gray-500">${product.price.toFixed(2)}</span>
                  <a
                    href="/workbook"
                    className="text-xs font-semibold px-3 py-1.5 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    {isMember ? 'Purchase' : product.isFreeForMembers ? 'Upgrade to Access' : 'Purchase'}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════
   Settings Tab
═══════════════════════════════ */
interface SettingsTabProps {
  user: IUser;
  editName: string;
  setEditName: (v: string) => void;
  isEditingName: boolean;
  setIsEditingName: (v: boolean) => void;
  nameLoading: boolean;
  nameError: string;
  nameSuccess: boolean;
  onSaveName: () => void;
  pwForm: { currentPassword: string; newPassword: string; confirmNewPassword: string };
  setPwForm: React.Dispatch<React.SetStateAction<{ currentPassword: string; newPassword: string; confirmNewPassword: string }>>;
  showPw: { current: boolean; new: boolean; confirm: boolean };
  setShowPw: React.Dispatch<React.SetStateAction<{ current: boolean; new: boolean; confirm: boolean }>>;
  pwLoading: boolean;
  pwError: string;
  pwSuccess: boolean;
  onChangePassword: (e: React.FormEvent) => void;
}

function SettingsTab(p: SettingsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 max-w-2xl"
    >
      {/* Profile card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-purple-500 to-pink-500" />
        <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
            <User className="w-3.5 h-3.5" />
          </span>
          Profile Information
        </h2>

        {/* Avatar with animated ring */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{ boxShadow: ['0 0 0 0px rgba(124,58,237,0.4)', '0 0 0 6px rgba(124,58,237,0)', '0 0 0 0px rgba(124,58,237,0)'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut' }}
            />
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-200/50">
              {p.user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-800">{p.user.name}</p>
            <p className="text-sm text-gray-500">{p.user.email}</p>
            <span className="inline-flex items-center gap-1 text-xs text-purple-600 font-medium capitalize mt-1">
              <Shield className="w-3 h-3" /> {p.user.role}
            </span>
          </div>
        </div>

        {/* Name field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={p.editName}
              onChange={e => p.setEditName(e.target.value)}
              disabled={!p.isEditingName}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
            />
            {p.isEditingName ? (
              <>
                <motion.button
                  onClick={p.onSaveName}
                  disabled={p.nameLoading}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium disabled:opacity-60 flex items-center gap-1.5 shadow-sm"
                >
                  {p.nameLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save
                </motion.button>
                <button
                  onClick={() => { p.setIsEditingName(false); p.setEditName(p.user.name); }}
                  className="px-3 py-2.5 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <motion.button
                onClick={() => p.setIsEditingName(true)}
                whileHover={{ scale: 1.04, backgroundColor: '#f5f3ff' }}
                className="px-4 py-2.5 text-gray-600 hover:text-purple-600 bg-gray-100 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </motion.button>
            )}
          </div>
          {p.nameError && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{p.nameError}</p>
          )}
          {p.nameSuccess && (
            <motion.p
              className="text-xs text-green-600 mt-1.5 flex items-center gap-1"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle className="w-3.5 h-3.5" /> Name updated successfully
            </motion.p>
          )}
        </div>

        {/* Email (read-only) */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input
            type="email"
            value={p.user.email}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-cyan-500" />
        <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
            <Shield className="w-3.5 h-3.5" />
          </span>
          Change Password
        </h2>

        {p.pwError && (
          <motion.div
            className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" /> {p.pwError}
          </motion.div>
        )}
        {p.pwSuccess && (
          <motion.div
            className="flex items-center gap-2 p-3 mb-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-4 h-4 shrink-0" /> Password changed successfully!
          </motion.div>
        )}

        <form onSubmit={p.onChangePassword} className="space-y-4">
          {(
            [
              { key: 'currentPassword', label: 'Current Password', showKey: 'current' },
              { key: 'newPassword', label: 'New Password', showKey: 'new' },
              { key: 'confirmNewPassword', label: 'Confirm New Password', showKey: 'confirm' },
            ] as const
          ).map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              <div className="relative">
                <input
                  type={p.showPw[field.showKey] ? 'text' : 'password'}
                  value={p.pwForm[field.key]}
                  onChange={e => p.setPwForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  required
                  minLength={field.key !== 'currentPassword' ? 8 : undefined}
                  autoComplete={field.key === 'currentPassword' ? 'current-password' : 'new-password'}
                  placeholder={field.key === 'currentPassword' ? 'Your current password' : 'Min. 8 characters'}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => p.setShowPw(prev => ({ ...prev, [field.showKey]: !prev[field.showKey] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle visibility"
                >
                  {p.showPw[field.showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          <motion.button
            type="submit"
            disabled={p.pwLoading}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(124,58,237,0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {p.pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Password'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

/* ─────────── Shared helpers ─────────── */
function TabSkeleton() {
  const shimmer = 'relative overflow-hidden before:absolute before:inset-0 before:bg-linear-to-r before:from-gray-100 before:via-white before:to-gray-100 before:animate-[shimmer_1.4s_infinite] bg-gray-100 rounded-2xl';
  return (
    <div className="space-y-4">
      <style>{`@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}} .before\\:animate-\\[shimmer_1\\.4s_infinite\\]::before{background-size:800px 100%;animation:shimmer 1.4s linear infinite;}`}</style>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`${shimmer} h-28`} />
        ))}
      </div>
      <div className="grid xl:grid-cols-3 gap-4">
        <div className={`xl:col-span-2 ${shimmer} h-56`} />
        <div className={`${shimmer} h-56`} />
      </div>
      <div className={`${shimmer} h-64`} />
    </div>
  );
}

