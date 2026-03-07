'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Search, Crown, Eye, RefreshCw, X, ChevronDown, Trash2 } from 'lucide-react';

interface IMember {
  _id: string;
  user: { _id: string; name: string; email: string } | string;
  plan: 'community' | 'growth' | 'transformation' | 'vip';
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'pending';
  price: number;
  startDate: string;
  endDate?: string;
  trialEndsAt?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  trial: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-rose-100 text-rose-700',
  expired: 'bg-gray-100 text-gray-500',
};

const PLAN_COLORS: Record<string, string> = {
  community: 'bg-cyan-50 text-cyan-700',
  growth: 'bg-emerald-50 text-emerald-700',
  transformation: 'bg-purple-50 text-purple-700',
  vip: 'bg-fuchsia-50 text-fuchsia-700',
};

export default function AdminMembersPage() {
  const { token } = useAuth();
  const [members, setMembers] = useState<IMember[]>([]);
  const [filtered, setFiltered] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selected, setSelected] = useState<IMember | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/members', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setMembers(json?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let list = members;
    if (statusFilter !== 'all') list = list.filter(m => m.status === statusFilter);
    if (planFilter !== 'all') list = list.filter(m => m.plan === planFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => {
        const u = m.user as { name: string; email: string };
        return (u?.name ?? '').toLowerCase().includes(q) || (u?.email ?? '').toLowerCase().includes(q);
      });
    }
    setFiltered(list);
  }, [members, search, statusFilter, planFilter]);

  const updateMember = async (id: string, patch: Record<string, string>) => {
    setActionLoading(id);
    try {
      await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(patch),
      });
      setMembers(prev => prev.map(m => m._id === id ? { ...m, ...patch } as IMember : m));
      if (selected?._id === id) setSelected(prev => prev ? { ...prev, ...patch } as IMember : null);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteMember = async (id: string) => {
    setConfirm(null);
    setActionLoading(id + '_del');
    try {
      await fetch(`/api/members/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setMembers(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } finally {
      setActionLoading(null);
    }
  };

  const getUserInfo = (m: IMember) => {
    if (typeof m.user === 'string') return { name: 'Unknown', email: '—' };
    return m.user as { name: string; email: string };
  };

  const activeCount = members.filter(m => m.status === 'active' || m.status === 'trial').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Members</h2>
          <p className="text-sm text-gray-500 mt-0.5">{members.length} total · <span className="text-green-600 font-semibold">{activeCount} active</span></p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
            <option value="all">All Plans</option>
            <option value="community">Community</option>
            <option value="growth">Growth</option>
            <option value="transformation">Transformation</option>
            <option value="vip">VIP</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Crown className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No members found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-semibold">Member</th>
                  <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell">Plan</th>
                  <th className="text-left px-6 py-3 font-semibold hidden md:table-cell">Billing</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-left px-6 py-3 font-semibold hidden lg:table-cell">Since</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(m => {
                  const u = getUserInfo(m);
                  return (
                    <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${PLAN_COLORS[m.plan]}`}>{m.plan}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 capitalize hidden md:table-cell">{m.billingCycle} · ${m.price}/mo</td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select value={m.status} onChange={e => updateMember(m._id, { status: e.target.value })}
                            disabled={actionLoading === m._id}
                            className={`appearance-none pl-2 pr-6 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[m.status]}`}>
                            <option value="trial">trial</option>
                            <option value="active">active</option>
                            <option value="pending">pending</option>
                            <option value="cancelled">cancelled</option>
                            <option value="expired">expired</option>
                          </select>
                          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs hidden lg:table-cell">{new Date(m.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelected(m)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => setConfirm(m._id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{getUserInfo(selected).name}</h3>
                <div className="text-sm text-gray-500">{getUserInfo(selected).email}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Plan</div><div className="font-semibold capitalize">{selected.plan}</div></div>
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Billing</div><div className="font-semibold capitalize">{selected.billingCycle}</div></div>
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Price</div><div className="font-semibold">${selected.price}/mo</div></div>
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Status</div><div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[selected.status]}`}>{selected.status}</div></div>
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Started</div><div className="font-semibold">{new Date(selected.startDate).toLocaleDateString()}</div></div>
                {selected.trialEndsAt && <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Trial Ends</div><div className="font-semibold">{new Date(selected.trialEndsAt).toLocaleDateString()}</div></div>}
                {selected.endDate && <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Ends</div><div className="font-semibold">{new Date(selected.endDate).toLocaleDateString()}</div></div>}
              </div>
              <div className="flex gap-2 flex-wrap pt-1">
                {(['trial','active','pending','cancelled','expired'] as const).map(s => (
                  <button key={s} onClick={() => updateMember(selected._id, { status: s })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selected.status === s ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Membership?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteMember(confirm)} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
