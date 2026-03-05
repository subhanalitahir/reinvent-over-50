'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import {
  LayoutDashboard, Users, Crown, Calendar, ShoppingBag,
  MapPin, Mail, Bell, Image, Package, LogOut, Menu, X,
  ChevronRight, Shield, Loader2,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/members', label: 'Members', icon: Crown },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/events', label: 'Events', icon: MapPin },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Bell },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/products', label: 'Products', icon: Package },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-linear-to-b from-[#1e0a3c] to-[#2d1060] z-30 flex flex-col transition-transform duration-300 shadow-2xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">✦</div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Reinvent You</div>
            <div className="text-purple-300 text-xs font-medium tracking-wide">Admin Panel</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                  ${active
                    ? 'bg-white/15 text-white shadow-lg'
                    : 'text-purple-200 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-purple-300' : 'text-purple-400 group-hover:text-purple-300'}`} />
                <span>{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-purple-300" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate">{user.name}</div>
              <div className="text-purple-300 text-xs truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center gap-4 shrink-0 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-gray-900 capitalize">
              {NAV.find(n => isActive(n.href, n.exact))?.label ?? 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span className="font-medium text-purple-700">Admin</span>
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
