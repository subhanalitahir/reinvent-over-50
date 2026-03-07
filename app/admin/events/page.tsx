'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Search, MapPin, Trash2, ChevronDown, Eye, RefreshCw, X, Plus, Edit3 } from 'lucide-react';

interface IEvent {
  _id: string;
  title: string;
  description: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  startDate: string;
  endDate: string;
  location?: string;
  virtualLink?: string;
  maxAttendees?: number;
  price: number;
  isFree: boolean;
  isFreeForMembers: boolean;
  hostedBy: string;
  tags: string[];
  imageUrl?: string;
  attendees: string[];
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  cancelled: 'bg-rose-100 text-rose-700',
  completed: 'bg-indigo-100 text-indigo-700',
};

const EMPTY: Partial<IEvent> = { title: '', description: '', type: 'virtual', status: 'draft', hostedBy: '', isFree: true, isFreeForMembers: false, price: 0, tags: [] };

export default function AdminEventsPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [filtered, setFiltered] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState<'view' | 'edit' | 'create' | null>(null);
  const [selected, setSelected] = useState<Partial<IEvent> | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events?all=true&limit=100', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      // Also fetch drafts/all via admin
      const res2 = await fetch('/api/events?status=draft&limit=100', { headers: { Authorization: `Bearer ${token}` } });
      const json2 = await res2.json();
      const combined = [...(json?.data ?? []), ...(json2?.data ?? [])];
      const unique = Array.from(new Map(combined.map(e => [e._id, e])).values());
      setEvents(unique);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let list = events;
    if (statusFilter !== 'all') list = list.filter(e => e.status === statusFilter);
    if (search) list = list.filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.hostedBy.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [events, search, statusFilter]);

  const saveEvent = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const isEdit = !!(selected as IEvent)._id;
      const url = isEdit ? `/api/events/${(selected as IEvent)._id}` : '/api/events';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(selected),
      });
      if (res.ok) {
        await load();
        setModal(null);
        setSelected(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setEvents(prev => prev.map(e => e._id === id ? { ...e, status: status as IEvent['status'] } : e));
    } finally {
      setActionLoading(null);
    }
  };

  const deleteEvent = async (id: string) => {
    setConfirm(null);
    setActionLoading(id + '_del');
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setEvents(prev => prev.filter(e => e._id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const openCreate = () => { setSelected({ ...EMPTY }); setModal('create'); };
  const openEdit = (e: IEvent) => { setSelected({ ...e }); setModal('edit'); };
  const openView = (e: IEvent) => { setSelected(e); setModal('view'); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <p className="text-sm text-gray-500 mt-0.5">{events.length} total events</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
            <Plus className="w-4 h-4" /> New Event
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="mb-4">No events found</p>
            <button onClick={openCreate} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">Create First Event</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-semibold">Event</th>
                  <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell">Type</th>
                  <th className="text-left px-6 py-3 font-semibold hidden md:table-cell">Date</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(e => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{e.title}</div>
                      <div className="text-xs text-gray-400">{e.hostedBy}</div>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${e.type === 'virtual' ? 'bg-blue-50 text-blue-600' : e.type === 'in-person' ? 'bg-fuchsia-50 text-fuchsia-600' : 'bg-purple-50 text-purple-600'}`}>
                        {e.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs hidden md:table-cell">{new Date(e.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select value={e.status} onChange={ev => updateStatus(e._id, ev.target.value)}
                          disabled={actionLoading === e._id}
                          className={`appearance-none pl-2 pr-6 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[e.status]}`}>
                          <option value="draft">draft</option>
                          <option value="published">published</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openView(e)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-50 hover:text-purple-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setConfirm(e._id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
      {(modal === 'create' || modal === 'edit') && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">{modal === 'create' ? 'Create Event' : 'Edit Event'}</h3>
              <button onClick={() => { setModal(null); setSelected(null); }} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Title *', key: 'title', type: 'text' },
                { label: 'Hosted By *', key: 'hostedBy', type: 'text' },
                { label: 'Start Date *', key: 'startDate', type: 'datetime-local' },
                { label: 'End Date *', key: 'endDate', type: 'datetime-local' },
                { label: 'Price ($)', key: 'price', type: 'number' },
                { label: 'Image URL', key: 'imageUrl', type: 'url' },
              ].map(f => (
                <div key={f.key} className={f.key === 'title' || f.key === 'imageUrl' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
                  <input type={f.type} value={(selected as Record<string, unknown>)[f.key] as string ?? ''}
                    onChange={e => setSelected(prev => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              ))}
              {/* Location — only for in-person / hybrid */}
              {(selected.type === 'in-person' || selected.type === 'hybrid') && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Location *</label>
                  <input type="text" value={selected.location ?? ''}
                    onChange={e => setSelected(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              )}
              {/* Zoom link — only for virtual / hybrid */}
              {(selected.type === 'virtual' || selected.type === 'hybrid') && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Zoom / Virtual Link *</label>
                  <input type="url" value={selected.virtualLink ?? ''}
                    onChange={e => setSelected(prev => ({ ...prev, virtualLink: e.target.value }))}
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Event Type *</label>
                <select value={selected.type ?? 'virtual'} onChange={e => setSelected(prev => ({ ...prev, type: e.target.value as IEvent['type'] }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                  <option value="virtual">Virtual</option>
                  <option value="in-person">In-person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status</label>
                <select value={selected.status ?? 'draft'} onChange={e => setSelected(prev => ({ ...prev, status: e.target.value as IEvent['status'] }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description *</label>
                <textarea value={selected.description ?? ''} rows={4}
                  onChange={e => setSelected(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={selected.isFree ?? true}
                    onChange={e => setSelected(prev => ({ ...prev, isFree: e.target.checked }))}
                    className="rounded" />
                  Free for Everyone
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={selected.isFreeForMembers ?? false}
                    onChange={e => setSelected(prev => ({ ...prev, isFreeForMembers: e.target.checked }))}
                    className="rounded" />
                  Free for Members
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => { setModal(null); setSelected(null); }} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={saveEvent} disabled={saving} className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-60">
                {saving ? 'Saving...' : modal === 'create' ? 'Create Event' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{selected.title}</h3>
                <div className="text-sm text-gray-500">Hosted by {selected.hostedBy}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <p className="text-gray-600">{selected.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Start</div><div className="font-semibold">{selected.startDate ? new Date(selected.startDate).toLocaleString() : '—'}</div></div>
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">End</div><div className="font-semibold">{selected.endDate ? new Date(selected.endDate).toLocaleString() : '—'}</div></div>
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Type</div><div className="font-semibold capitalize">{selected.type}</div></div>
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Price</div><div className="font-semibold">{selected.isFree ? 'Free' : `$${selected.price}`}</div></div>
              </div>
              {selected.location && <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Location</div><div className="font-semibold">{selected.location}</div></div>}
              {selected.virtualLink && <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Virtual Link</div><a href={selected.virtualLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-600 hover:underline break-all">{selected.virtualLink}</a></div>}
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Event?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteEvent(confirm)} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
