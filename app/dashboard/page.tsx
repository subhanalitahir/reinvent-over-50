'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Calendar, ShoppingBag, Settings, LogOut, Crown, Sparkles,
  AlertCircle, Loader2, CheckCircle, Eye, EyeOff, Star, Clock,
  Package, ChevronRight, Shield, Edit3, Check, X,
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
  items: { product: { name: string; type: string } | null; quantity: number; price: number }[];
}

/* ─────────── Tab type ─────────── */
type Tab = 'overview' | 'sessions' | 'orders' | 'settings';

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
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ─────────── Main Dashboard ─────────── */
export default function DashboardPage() {
  const router = useRouter();
  const { user, token, loading: authLoading, logout, updateUser } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');

  // Data state
  const [membership, setMembership] = useState<IMembership | null>(null);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
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

  /* ── Redirect if not authenticated ── */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  /* ── Fetch dashboard data ── */
  const fetchData = useCallback(async () => {
    if (!token) return;
    setDataLoading(true);
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [memberRes, bookingsRes, ordersRes] = await Promise.all([
        fetch('/api/members/me', { headers }),
        fetch('/api/bookings/my', { headers }),
        fetch('/api/orders/my', { headers }),
      ]);
      if (memberRes.ok) {
        const d = await memberRes.json();
        setMembership(d.data);
      }
      if (bookingsRes.ok) {
        const d = await bookingsRes.json();
        setBookings(d.data ?? []);
      }
      if (ordersRes.ok) {
        const d = await ordersRes.json();
        setOrders(d.data ?? []);
      }
    } catch {
      // silently ignore partial failures
    } finally {
      setDataLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  useEffect(() => {
    if (user) setEditName(user.name);
  }, [user]);

  /* ── Handlers ── */
  const handleSaveName = async () => {
    if (!editName.trim() || editName.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }
    setNameLoading(true);
    setNameError('');
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
    } catch {
      setNameError('Something went wrong');
    } finally {
      setNameLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters');
      return;
    }
    setPwLoading(true);
    setPwError('');
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
    } catch {
      setPwError('Something went wrong');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  /* ── Loading state ── */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-orange-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'sessions', label: 'Sessions', icon: <Calendar className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 pt-20 pb-16">
      {/* BG decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-purple-300/10 blur-3xl top-0 right-0" />
        <div className="absolute w-80 h-80 rounded-full bg-pink-300/10 blur-3xl bottom-20 left-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Header Bar ── */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Welcome back,</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
                {user.name} <span className="text-purple-600">✦</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur rounded-full border border-white/50 text-xs text-gray-600 font-medium">
                <Shield className="w-3.5 h-3.5 text-purple-500" />
                <span className="capitalize">{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-red-600 bg-white/70 hover:bg-red-50 backdrop-blur rounded-full border border-white/50 transition-all font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div
          className="flex gap-1 p-1 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm mb-8 w-fit"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-white/80'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </motion.div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          {tab === 'overview' && (
            <OverviewTab
              key="overview"
              user={user}
              membership={membership}
              bookings={bookings}
              orders={orders}
              loading={dataLoading}
            />
          )}
          {tab === 'sessions' && (
            <SessionsTab key="sessions" bookings={bookings} loading={dataLoading} />
          )}
          {tab === 'orders' && (
            <OrdersTab key="orders" orders={orders} loading={dataLoading} />
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
  );
}

/* ═══════════════════════════════
   Overview Tab
═══════════════════════════════ */
function OverviewTab({
  user, membership, bookings, orders, loading,
}: {
  user: IUser;
  membership: IMembership | null;
  bookings: IBooking[];
  orders: IOrder[];
  loading: boolean;
}) {
  if (loading) return <TabSkeleton />;

  const upcomingBookings = bookings.filter(
    b => b.status !== 'cancelled' && new Date(b.scheduledAt) > new Date(),
  );

  const stats = [
    {
      label: 'Plan',
      value: membership ? membership.plan.charAt(0).toUpperCase() + membership.plan.slice(1) : 'No Plan',
      icon: <Crown className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Upcoming Sessions',
      value: String(upcomingBookings.length),
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Orders',
      value: String(orders.length),
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'from-orange-500 to-amber-500',
    },
    {
      label: 'Member Since',
      value: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      icon: <Star className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-sm"
          >
            <div className={`inline-flex w-10 h-10 rounded-xl bg-linear-to-br ${s.color} items-center justify-center text-white mb-3 shadow-md`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Membership card */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-600" /> Membership
          </h2>
          {membership ? (
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r ${planColors[membership.plan] ?? 'from-gray-400 to-gray-500'} text-white font-semibold text-sm mb-4`}>
                <Crown className="w-4 h-4" />
                {membership.plan.charAt(0).toUpperCase() + membership.plan.slice(1)} Plan
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusBadge[membership.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {membership.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Billing</span>
                  <span className="capitalize font-medium text-gray-800">{membership.billingCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price</span>
                  <span className="font-medium text-gray-800">${membership.price}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Started</span>
                  <span className="font-medium text-gray-800">{fmt(membership.startDate)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">You don&apos;t have an active membership yet.</p>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-purple-500/30 hover:scale-105 transition-all"
              >
                Explore Plans <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Recent bookings quick view */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Upcoming Sessions
          </h2>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No upcoming sessions scheduled.</p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm shadow-md hover:scale-105 transition-all"
              >
                Book a Session <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.slice(0, 3).map(b => (
                <div key={b._id} className="flex items-center justify-between p-3 bg-blue-50/60 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800 text-sm capitalize">{b.sessionType} Session</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {fmt(b.scheduledAt)}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusBadge[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Book a Session', desc: 'Schedule 1-on-1 coaching', href: '/booking', color: 'from-purple-500 to-pink-500', icon: <Calendar className="w-5 h-5" /> },
          { label: 'Browse Events', desc: 'Discover upcoming events', href: '/events', color: 'from-orange-500 to-amber-500', icon: <Star className="w-5 h-5" /> },
          { label: 'Get Workbook', desc: 'Download transformation tools', href: '/workbook', color: 'from-green-500 to-teal-500', icon: <Package className="w-5 h-5" /> },
        ].map(c => (
          <Link key={c.href} href={c.href}>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className={`inline-flex w-10 h-10 rounded-xl bg-linear-to-br ${c.color} items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                {c.icon}
              </div>
              <p className="font-semibold text-gray-800">{c.label}</p>
              <p className="text-sm text-gray-500 mt-0.5">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════
   Sessions Tab
═══════════════════════════════ */
function SessionsTab({ bookings, loading }: { bookings: IBooking[]; loading: boolean }) {
  if (loading) return <TabSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Your Sessions</h2>
        <Link
          href="/booking"
          className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-purple-500/30 hover:scale-105 transition-all"
        >
          + Book New
        </Link>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-12 h-12 text-gray-300" />}
          title="No sessions yet"
          desc="Book your first coaching session to get started."
          action={{ label: 'Book a Session', href: '/booking' }}
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800 capitalize">{b.sessionType} Session</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusBadge[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {b.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {fmt(b.scheduledAt)}</span>
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {b.guestName}</span>
                  <span>{b.duration} min</span>
                </div>
              </div>
              {b.meetingLink && (
                <a
                  href={b.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-colors shrink-0"
                >
                  Join Meeting
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════
   Orders Tab
═══════════════════════════════ */
function OrdersTab({ orders, loading }: { orders: IOrder[]; loading: boolean }) {
  if (loading) return <TabSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12 text-gray-300" />}
          title="No orders yet"
          desc="Your purchases will appear here."
          action={{ label: 'Browse Products', href: '/workbook' }}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((o, i) => (
            <motion.div
              key={o._id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Order #{o._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{fmt(o.createdAt)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">${o.total?.toFixed(2)}</p>
                  <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${statusBadge[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {o.status}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                {o.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <span>{item.product?.name ?? 'Product'} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
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
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-600" /> Profile Information
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {p.user.name.charAt(0).toUpperCase()}
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
                <button
                  onClick={p.onSaveName}
                  disabled={p.nameLoading}
                  className="px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium hover:scale-105 transition-all disabled:opacity-60 flex items-center gap-1.5"
                >
                  {p.nameLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save
                </button>
                <button
                  onClick={() => { p.setIsEditingName(false); p.setEditName(p.user.name); }}
                  className="px-3 py-2.5 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => p.setIsEditingName(true)}
                className="px-4 py-2.5 text-gray-600 hover:text-purple-600 bg-gray-100 hover:bg-purple-50 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
            )}
          </div>
          {p.nameError && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{p.nameError}</p>
          )}
          {p.nameSuccess && (
            <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Name updated successfully</p>
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
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" /> Change Password
        </h2>

        {p.pwError && (
          <motion.div
            className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" /> {p.pwError}
          </motion.div>
        )}
        {p.pwSuccess && (
          <motion.div
            className="flex items-center gap-2 p-3 mb-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle visibility"
                >
                  {p.showPw[field.showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={p.pwLoading}
            className="px-6 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-purple-500/30 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {p.pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Password'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

/* ─────────── Shared helpers ─────────── */
function TabSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white/60 rounded-2xl h-24 border border-white/50" />
      ))}
    </div>
  );
}

function EmptyState({
  icon, title, desc, action,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-10 border border-white/50 shadow-sm text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <p className="text-lg font-semibold text-gray-700 mb-1">{title}</p>
      <p className="text-sm text-gray-500 mb-6">{desc}</p>
      <Link
        href={action.href}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-purple-500/30 hover:scale-105 transition-all"
      >
        {action.label} <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
