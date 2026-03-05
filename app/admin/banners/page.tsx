'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Search, Image as ImageIcon, Trash2, Edit3, RefreshCw, Plus, X, ChevronDown } from 'lucide-react';

interface IBanner {
  _id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  altText?: string;
  placement: 'about' | 'home' | 'events' | 'global';
  status: 'active' | 'inactive';
  sponsor?: string;
  clicks: number;
  impressions: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

const EMPTY: Partial<IBanner> = { title: '', imageUrl: '', placement: 'home', status: 'active', clicks: 0, impressions: 0 };

export default function AdminBannersPage() {
  const { token } = useAuth();
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [filtered, setFiltered] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [placementFilter, setPlacementFilter] = useState('all');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Partial<IBanner> | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners/all', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setBanners(json?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let list = banners;
    if (placementFilter !== 'all') list = list.filter(b => b.placement === placementFilter);
    if (search) list = list.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.sponsor ?? '').toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [banners, search, placementFilter]);

  const saveBanner = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const isEdit = !!(selected as IBanner)._id;
      const url = isEdit ? `/api/banners/${(selected as IBanner)._id}` : '/api/banners';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(selected),
      });
      if (res.ok) { await load(); setModal(null); setSelected(null); }
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id: string, current: 'active' | 'inactive') => {
    setActionLoading(id);
    const newStatus = current === 'active' ? 'inactive' : 'active';
    try {
      await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      setBanners(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
    } finally {
      setActionLoading(null);
    }
  };

  const deleteBanner = async (id: string) => {
    setConfirm(null);
    setActionLoading(id + '_del');
    try {
      await fetch(`/api/banners/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setBanners(prev => prev.filter(b => b._id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Banners</h2>
          <p className="text-sm text-gray-500 mt-0.5">{banners.length} total banners</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => { setSelected({ ...EMPTY }); setModal('create'); }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
            <Plus className="w-4 h-4" /> New Banner
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            placeholder="Search banners..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            value={placementFilter} onChange={e => setPlacementFilter(e.target.value)}>
            <option value="all">All Placements</option>
            <option value="home">Home</option>
            <option value="about">About</option>
            <option value="events">Events</option>
            <option value="global">Global</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="mb-4">No banners found</p>
            <button onClick={() => { setSelected({ ...EMPTY }); setModal('create'); }}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold">Create First Banner</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-semibold">Banner</th>
                  <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell">Placement</th>
                  <th className="text-left px-6 py-3 font-semibold hidden md:table-cell">Stats</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {b.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.imageUrl} alt={b.altText ?? b.title} className="w-12 h-8 object-cover rounded-lg shrink-0 border border-gray-100" />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{b.title}</div>
                          {b.sponsor && <div className="text-xs text-gray-400">by {b.sponsor}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600 hidden sm:table-cell">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">{b.placement}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell text-xs">
                      {b.impressions} views · {b.clicks} clicks
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(b._id, b.status)} disabled={actionLoading === b._id}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${b.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {b.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelected({ ...b }); setModal('edit'); }}
                          className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-50 hover:text-purple-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setConfirm(b._id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modal && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">{modal === 'create' ? 'Create Banner' : 'Edit Banner'}</h3>
              <button onClick={() => { setModal(null); setSelected(null); }} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Title *', key: 'title', type: 'text' },
                { label: 'Image URL *', key: 'imageUrl', type: 'url' },
                { label: 'Link URL', key: 'linkUrl', type: 'url' },
                { label: 'Alt Text', key: 'altText', type: 'text' },
                { label: 'Sponsor', key: 'sponsor', type: 'text' },
                { label: 'Start Date', key: 'startDate', type: 'date' },
                { label: 'End Date', key: 'endDate', type: 'date' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
                  <input type={f.type} value={(selected as Record<string, unknown>)[f.key] as string ?? ''}
                    onChange={e => setSelected(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              ))}
              {selected.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Placement</label>
                  <select value={selected.placement ?? 'home'} onChange={e => setSelected(prev => ({ ...prev, placement: e.target.value as IBanner['placement'] }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                    <option value="home">Home</option>
                    <option value="about">About</option>
                    <option value="events">Events</option>
                    <option value="global">Global</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status</label>
                  <select value={selected.status ?? 'active'} onChange={e => setSelected(prev => ({ ...prev, status: e.target.value as IBanner['status'] }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => { setModal(null); setSelected(null); }} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={saveBanner} disabled={saving} className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-60">
                {saving ? 'Saving...' : modal === 'create' ? 'Create' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Banner?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteBanner(confirm)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
