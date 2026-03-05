'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'motion/react';
import {
  Users, Crown, Calendar, ShoppingBag, MapPin, Mail,
  Bell, TrendingUp, DollarSign, Clock, AlertCircle,
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
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentItem[]>([]);
  const [recentContacts, setRecentContacts] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const statCards = stats ? [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50', href: '/admin/users' },
    { label: 'Active Members', value: stats.activeMembers, icon: Crown, color: 'from-purple-500 to-pink-500', bg: 'from-purple-50 to-pink-50', href: '/admin/members' },
    { label: 'Total Bookings', value: stats.bookings, icon: Calendar, color: 'from-orange-500 to-red-500', bg: 'from-orange-50 to-red-50', href: '/admin/bookings' },
    { label: 'Total Revenue', value: `$${stats.revenue.toFixed(0)}`, icon: DollarSign, color: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50', href: '/admin/orders' },
    { label: 'Paid Orders', value: stats.paidOrders, icon: ShoppingBag, color: 'from-indigo-500 to-purple-500', bg: 'from-indigo-50 to-purple-50', href: '/admin/orders' },
    { label: 'Events', value: stats.events, icon: MapPin, color: 'from-pink-500 to-rose-500', bg: 'from-pink-50 to-rose-50', href: '/admin/events' },
    { label: 'Subscribers', value: stats.subscribers, icon: Bell, color: 'from-yellow-500 to-orange-500', bg: 'from-yellow-50 to-orange-50', href: '/admin/subscribers' },
    { label: 'New Contacts', value: stats.newContacts, icon: Mail, color: 'from-teal-500 to-cyan-500', bg: 'from-teal-50 to-cyan-50', href: '/admin/contacts' },
  ] : [];

  const alertCards = stats ? [
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', href: '/admin/bookings' },
    { label: 'Unread Messages', value: stats.newContacts, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200', href: '/admin/contacts' },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Alert strip */}
      {alertCards.some(a => a.value > 0) && (
        <div className="flex flex-wrap gap-3">
          {alertCards.filter(a => a.value > 0).map(a => (
            <Link key={a.label} href={a.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold shadow-sm hover:shadow-md transition-all ${a.bg} ${a.color}`}>
              <a.icon className="w-4 h-4" />
              {a.value} {a.label}
            </Link>
          ))}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link href={card.href}
              className={`block bg-linear-to-br ${card.bg} rounded-2xl p-5 border border-white shadow-md hover:shadow-xl transition-all group`}>
              <div className={`w-10 h-10 bg-linear-to-br ${card.color} rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-xs font-medium text-gray-500 mt-0.5">{card.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-600" /> Recent Orders
            </h3>
            <Link href="/admin/orders" className="text-xs text-purple-600 hover:text-purple-800 font-semibold">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
            )}
            {recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                <div>
                  <div className="text-sm font-semibold text-gray-800">{order.guestName ?? 'Guest'}</div>
                  <div className="text-xs text-gray-400">{order.guestEmail ?? order.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">${order.total?.toFixed(2)}</div>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600" /> Recent Messages
            </h3>
            <Link href="/admin/contacts" className="text-xs text-purple-600 hover:text-purple-800 font-semibold">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentContacts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No messages yet</p>
            )}
            {recentContacts.map(contact => (
              <div key={contact._id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                <div>
                  <div className="text-sm font-semibold text-gray-800">{contact.name}</div>
                  <div className="text-xs text-gray-400 capitalize">{contact.subject}</div>
                </div>
                <StatusBadge status={contact.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-linear-to-br from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-bold text-lg">Quick Actions</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '+ New Event', href: '/admin/events' },
            { label: '+ New Banner', href: '/admin/banners' },
            { label: '+ New Product', href: '/admin/products' },
            { label: 'View Contacts', href: '/admin/contacts' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-sm font-semibold transition-all border border-white/20">
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    paid: 'bg-green-100 text-green-700',
    confirmed: 'bg-green-100 text-green-700',
    published: 'bg-green-100 text-green-700',
    trial: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    new: 'bg-blue-100 text-blue-700',
    read: 'bg-gray-100 text-gray-600',
    replied: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-700',
    failed: 'bg-red-100 text-red-700',
    expired: 'bg-red-100 text-red-700',
    completed: 'bg-indigo-100 text-indigo-700',
    archived: 'bg-gray-100 text-gray-500',
    refunded: 'bg-orange-100 text-orange-700',
    draft: 'bg-gray-100 text-gray-600',
    inactive: 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}
