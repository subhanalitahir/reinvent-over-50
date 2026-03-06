'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import {
  LayoutDashboard, Users, Crown, Calendar, ShoppingBag,
  MapPin, Mail, Bell, Image, Package, LogOut, Menu, X,
  Shield, Loader2, DollarSign, Sparkles, Send,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Management',
    items: [
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/members', label: 'Members', icon: Crown },
      { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
      { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/events', label: 'Events', icon: MapPin },
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/banners', label: 'Banners', icon: Image },
    ],
  },
  {
    label: 'Communication',
    items: [
      { href: '/admin/contacts', label: 'Contacts', icon: Mail },
      { href: '/admin/subscribers', label: 'Subscribers', icon: Bell },
      { href: '/admin/newsletter', label: 'Newsletter', icon: Send },
    ],
  },
  {
    label: 'Settings',
    items: [
      { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0f0720 0%,#1e0a3c 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-pulse">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const activeLabel = NAV_GROUPS.flatMap(g => g.items).find(n => isActive(n.href, (n as { exact?: boolean }).exact))?.label ?? 'Admin';

  return (
    <div className="min-h-screen flex" style={{ background: '#f3f4f8' }}>
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
        style={{ background: 'linear-gradient(160deg, #12063a 0%, #1e0a3c 45%, #2a0e52 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-32 left-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)', transform: 'translate(-40%, 0)' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/50 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight tracking-tight">Reinvent 50+</div>
            <div className="text-purple-400 text-[10px] font-semibold uppercase tracking-widest mt-0.5">Admin Console</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-purple-500/70">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const { href, label, icon: Icon } = item;
                  const exact = (item as { exact?: boolean }).exact;
                  const active = isActive(href, exact);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                        ${active ? 'text-white' : 'text-purple-300/80 hover:text-white hover:bg-white/8'}`}
                    >
                      {active && (
                        <span className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.25), rgba(236,72,153,0.1))', boxShadow: 'inset 0 0 0 1px rgba(168,85,247,0.3)' }} />
                      )}
                      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-linear-to-b from-purple-400 to-pink-400 rounded-full" />}
                      <Icon className={`relative w-4 h-4 shrink-0 transition-colors ${active ? 'text-purple-300' : 'text-purple-500 group-hover:text-purple-300'}`} />
                      <span className="relative">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User card */}
        <div className="relative px-3 pb-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/10 mb-2">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#1e0a3c] rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white text-xs font-semibold truncate leading-tight">{user.name}</div>
              <div className="text-purple-400 text-[10px] truncate mt-0.5">{user.email}</div>
            </div>
            <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-300 hover:bg-red-500/15 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center gap-4 px-4 lg:px-8 py-3.5 border-b border-white/60"
          style={{ background: 'rgba(243,244,248,0.85)', backdropFilter: 'blur(12px)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium hidden sm:inline">Admin</span>
              <span className="text-xs text-gray-300 hidden sm:inline">/</span>
              <h1 className="text-sm font-bold text-gray-800">{activeLabel}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentTime && (
              <span className="hidden md:inline text-xs font-semibold text-gray-400 tabular-nums">{currentTime}</span>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-full">
              <Shield className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-bold text-purple-700">Admin</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
