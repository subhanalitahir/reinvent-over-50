'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Search, Bell, Trash2, ChevronDown, RefreshCw } from 'lucide-react';

interface ISubscriber {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  source: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  tags: string[];
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  subscribed: 'bg-green-100 text-green-700',
  unsubscribed: 'bg-gray-100 text-gray-500',
  bounced: 'bg-red-100 text-red-700',
};

export default function AdminSubscribersPage() {
  const { token } = useAuth();
  const [subscribers, setSubscribers] = useState<ISubscriber[]>([]);
  const [filtered, setFiltered] = useState<ISubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirm, setConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscribers', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setSubscribers(json?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let list = subscribers;
    if (statusFilter !== 'all') list = list.filter(s => s.status === statusFilter);
    if (search) list = list.filter(s =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.firstName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (s.lastName ?? '').toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [subscribers, search, statusFilter]);

  const deleteSubscriber = async (id: string) => {
    setConfirm(null);
    setActionLoading(id);
    try {
      await fetch(`/api/subscribers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setSubscribers(prev => prev.filter(s => s._id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const exportCSV = () => {
    const rows = [['Email', 'First Name', 'Last Name', 'Status', 'Source', 'Joined']];
    filtered.forEach(s => rows.push([s.email, s.firstName ?? '', s.lastName ?? '', s.status, s.source, new Date(s.createdAt).toLocaleDateString()]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'subscribers.csv';
    a.click();
  };

  const activeCount = subscribers.filter(s => s.status === 'subscribed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscribers</h2>
          <p className="text-sm text-gray-500 mt-0.5">{subscribers.length} total · <span className="text-green-600 font-semibold">{activeCount} subscribed</span></p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            Export CSV
          </button>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            placeholder="Search subscribers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No subscribers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-semibold">Email</th>
                  <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell">Name</th>
                  <th className="text-left px-6 py-3 font-semibold hidden md:table-cell">Source</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-left px-6 py-3 font-semibold hidden lg:table-cell">Joined</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{s.email}</td>
                    <td className="px-6 py-4 text-gray-600 hidden sm:table-cell">{[s.firstName, s.lastName].filter(Boolean).join(' ') || '—'}</td>
                    <td className="px-6 py-4 text-gray-500 capitalize hidden md:table-cell">{s.source}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs hidden lg:table-cell">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setConfirm(s._id)} disabled={actionLoading === s._id}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-30">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Subscriber?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteSubscriber(confirm)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
