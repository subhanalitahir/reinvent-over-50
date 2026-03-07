'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'motion/react';
import {
  Users, Crown, Calendar, ShoppingBag, MapPin, Mail,
  Bell, TrendingUp, DollarSign, Clock, AlertCircle,
  ArrowUpRight, Activity, Zap,
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  users: number;
  members: number;
  bookings: number;
  orders: number;
  events: number;
  contacts: number;
  subscribers: number;
  revenue: number;
  pendingBookings: number;
  newContacts: number;
  activeMembers: number;
  paidOrders: number;
}

interface RecentItem {
  _id: string;
  name?: string;
  guestName?: string;
  email?: string;
  guestEmail?: string;
  status: string;
  createdAt: string;
  total?: number;
  plan?: string;
  subject?: string;
}

export default function AdminOverviewPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentItem[]>([]);
  const [recentContacts, setRecentContacts] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('/api/auth/users', { headers }).then(r => r.json()),
      fetch('/api/members', { headers }).then(r => r.json()),
      fetch('/api/bookings', { headers }).then(r => r.json()),
      fetch('/api/orders', { headers }).then(r => r.json()),
      fetch('/api/events?all=true', { headers }).then(r => r.json()),
      fetch('/api/contacts', { headers }).then(r => r.json()),
      fetch('/api/subscribers', { headers }).then(r => r.json()),
    ]).then(([users, members, bookings, orders, events, contacts, subscribers]) => {
      const allOrders: RecentItem[] = orders?.data ?? [];
      const allContacts: RecentItem[] = contacts?.data ?? [];
      const allMembers: RecentItem[] = members?.data ?? [];
      const allBookings: RecentItem[] = bookings?.data ?? [];
      setStats({
        users: users?.meta?.total ?? users?.data?.length ?? 0,
        members: allMembers.length,
        bookings: allBookings.length,
        orders: allOrders.length,
        events: events?.meta?.total ?? events?.data?.length ?? 0,
        contacts: allContacts.length,
        subscribers: subscribers?.meta?.total ?? subscribers?.data?.length ?? 0,
        revenue: allOrders.filter((o: RecentItem) => o.status === 'paid').reduce((acc: number, o: RecentItem) => acc + (o.total ?? 0), 0),
        pendingBookings: allBookings.filter((b: RecentItem) => b.status === 'pending').length,
        newContacts: allContacts.filter((c: RecentItem) => c.status === 'new').length,
        activeMembers: allMembers.filter((m: RecentItem) => m.status === 'active' || m.status === 'trial').length,
        paidOrders: allOrders.filter((o: RecentItem) => o.status === 'paid').length,
      });
      setRecentOrders(allOrders.slice(0, 5));
      setRecentContacts(allContacts.slice(0, 5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-2xl animate-pulse" style={{ background: 'linear-gradient(135deg,#e9d5ff,#fce7f3)' }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white rounded-2xl animate-pulse shadow-sm" />
          <div className="h-64 bg-white rounded-2xl animate-pulse shadow-sm" />
        </div>
      </div>
    );
  }

  const statCards = stats ? [
    { label: 'Total Users', value: stats.users, icon: Users, gradient: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-200', href: '/admin/users', change: '+12%' },
    { label: 'Active Members', value: stats.activeMembers, icon: Crown, gradient: 'from-violet-500 to-purple-400', shadow: 'shadow-violet-200', href: '/admin/members', change: '+8%' },
    { label: 'Total Bookings', value: stats.bookings, icon: Calendar, gradient: 'from-fuchsia-500 to-purple-400', shadow: 'shadow-fuchsia-200', href: '/admin/bookings', change: '+5%' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(0)}`, icon: DollarSign, gradient: 'from-emerald-500 to-green-400', shadow: 'shadow-emerald-200', href: '/admin/orders', change: '+18%' },
    { label: 'Paid Orders', value: stats.paidOrders, icon: ShoppingBag, gradient: 'from-indigo-500 to-blue-400', shadow: 'shadow-indigo-200', href: '/admin/orders', change: '+3%' },
    { label: 'Live Events', value: stats.events, icon: MapPin, gradient: 'from-pink-500 to-rose-400', shadow: 'shadow-pink-200', href: '/admin/events', change: '0%' },
    { label: 'Subscribers', value: stats.subscribers, icon: Bell, gradient: 'from-fuchsia-400 to-purple-400', shadow: 'shadow-fuchsia-200', href: '/admin/subscribers', change: '+21%' },
    { label: 'Messages', value: stats.contacts, icon: Mail, gradient: 'from-teal-500 to-cyan-400', shadow: 'shadow-teal-200', href: '/admin/contacts', change: '+2%' },
  ] : [];

  return (
    <div className="space-y-7 max-w-7xl">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl p-6 lg:p-8 text-white"
        style={{ background: 'linear-gradient(135deg, #4f0d9a 0%, #7c3aed 40%, #c026d3 80%, #db2777 100%)' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%,-40%)' }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translateY(40%)' }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-purple-200 text-sm font-medium mb-1">{greeting()}, {user?.name?.split(' ')[0] ?? 'Admin'} ðŸ‘‹</p>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard Overview</h2>
            <p className="text-purple-200 text-sm mt-1.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats && stats.pendingBookings > 0 && (
              <Link href="/admin/bookings"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-semibold hover:bg-white/25 transition-all">
                <Clock className="w-4 h-4 text-fuchsia-300" />
                <span>{stats.pendingBookings} pending</span>
              </Link>
            )}
            {stats && stats.newContacts > 0 && (
              <Link href="/admin/contacts"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-semibold hover:bg-white/25 transition-all">
                <AlertCircle className="w-4 h-4 text-red-300" />
                <span>{stats.newContacts} new messages</span>
              </Link>
            )}
          </div>
        </div>

        {/* KPI quick strips */}
        {stats && (
          <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Members', val: stats.activeMembers, icon: Activity },
              { label: 'Revenue', val: `$${stats.revenue.toFixed(0)}`, icon: TrendingUp },
              { label: 'Bookings', val: stats.bookings, icon: Zap },
              { label: 'Subscribers', val: stats.subscribers, icon: Bell },
            ].map(k => (
              <div key={k.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <k.icon className="w-3.5 h-3.5 text-purple-200" />
                  <span className="text-purple-200 text-[11px] font-medium">{k.label}</span>
                </div>
                <div className="text-white text-xl font-bold">{k.val}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Stat cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Key Metrics</h3>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link href={card.href}
                className="group block bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${card.gradient}`} />
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 bg-linear-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-md ${card.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />{card.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 tabular-nums">{card.value}</div>
                <div className="text-xs font-semibold text-gray-400 mt-1">{card.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Recent Activity</h3>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Recent Orders</h3>
              </div>
              <Link href="/admin/orders"
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-bold hover:underline transition-colors">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">No orders yet</p>
                </div>
              ) : recentOrders.map((order, i) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                      {(order.guestName ?? 'G').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800 leading-tight">{order.guestName ?? 'Guest'}</div>
                      <div className="text-[11px] text-gray-400">{order.guestEmail ?? order.email}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="text-sm font-bold text-gray-900">${order.total?.toFixed(2)}</div>
                    <StatusBadge status={order.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Contacts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-sm">
                  <Mail className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Recent Messages</h3>
                {stats && stats.newContacts > 0 && (
                  <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">{stats.newContacts}</span>
                )}
              </div>
              <Link href="/admin/contacts"
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-bold hover:underline transition-colors">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentContacts.length === 0 ? (
                <div className="py-12 text-center">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">No messages yet</p>
                </div>
              ) : recentContacts.map((contact, i) => (
                <motion.div
                  key={contact._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-teal-100 to-cyan-100 flex items-center justify-center text-xs font-bold text-teal-600 shrink-0">
                      {(contact.name ?? 'G').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-800 leading-tight truncate">{contact.name}</div>
                      <div className="text-[11px] text-gray-400 capitalize truncate">{contact.subject}</div>
                    </div>
                  </div>
                  <StatusBadge status={contact.status} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-purple-600" />
          <h3 className="font-bold text-gray-800 text-sm">Quick Actions</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '+ New Event', href: '/admin/events', color: 'hover:bg-pink-50 hover:border-pink-200 hover:text-pink-700' },
            { label: '+ New Banner', href: '/admin/banners', color: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700' },
            { label: '+ New Product', href: '/admin/products', color: 'hover:bg-green-50 hover:border-green-200 hover:text-green-700' },
            { label: 'Manage Pricing', href: '/admin/pricing', color: 'hover:bg-fuchsia-50 hover:border-fuchsia-200 hover:text-fuchsia-700' },
            { label: 'View Contacts', href: '/admin/contacts', color: 'hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700' },
            { label: 'All Orders', href: '/admin/orders', color: 'hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className={`px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-all duration-200 ${a.color}`}>
              {a.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    paid: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    published: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    trial: 'bg-blue-50 text-blue-700 border border-blue-100',
    pending: 'bg-fuchsia-50 text-fuchsia-700 border border-amber-100',
    new: 'bg-violet-50 text-violet-700 border border-violet-100',
    read: 'bg-gray-50 text-gray-500 border border-gray-100',
    replied: 'bg-purple-50 text-purple-700 border border-purple-100',
    cancelled: 'bg-rose-50 text-rose-600 border border-rose-100',
    failed: 'bg-rose-50 text-rose-600 border border-rose-100',
    completed: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    archived: 'bg-gray-50 text-gray-400 border border-gray-100',
    refunded: 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100',
    draft: 'bg-gray-50 text-gray-500 border border-gray-100',
    inactive: 'bg-gray-50 text-gray-400 border border-gray-100',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 ${map[status] ?? 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
      {status}
    </span>
  );
}
