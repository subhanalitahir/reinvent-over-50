'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Search, Calendar, Trash2, ChevronDown, Eye, RefreshCw, X } from 'lucide-react';

interface IBooking {
  _id: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  sessionType: string;
  scheduledAt: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  meetingLink?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-rose-100 text-rose-700',
  completed: 'bg-indigo-100 text-indigo-700',
};

export default function AdminBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [filtered, setFiltered] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<IBooking | null>(null);
  const [editLink, setEditLink] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setBookings(json?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let list = bookings;
    if (statusFilter !== 'all') list = list.filter(b => b.status === statusFilter);
    if (search) list = list.filter(b =>
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.sessionType.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [bookings, search, statusFilter]);

  const updateBooking = async (id: string, patch: Record<string, string>) => {
    setActionLoading(id);
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(patch),
      });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, ...patch } as IBooking : b));
      if (selected?._id === id) setSelected(prev => prev ? { ...prev, ...patch } as IBooking : null);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteBooking = async (id: string) => {
    setConfirm(null);
    setActionLoading(id + '_del');
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setBookings(prev => prev.filter(b => b._id !== id));
      if (selected?._id === id) setSelected(null);
    } finally {
      setActionLoading(null);
    }
  };

  const openDetail = (b: IBooking) => {
    setSelected(b);
    setEditLink(b.meetingLink ?? '');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="text-sm text-gray-500 mt-0.5">{bookings.length} total bookings</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
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
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-semibold">Guest</th>
                  <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell">Session</th>
                  <th className="text-left px-6 py-3 font-semibold hidden md:table-cell">Scheduled</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{b.guestName}</div>
                      <div className="text-xs text-gray-400">{b.guestEmail}</div>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600 hidden sm:table-cell">{b.sessionType} ({b.duration}min)</td>
                    <td className="px-6 py-4 text-gray-600 text-xs hidden md:table-cell">{new Date(b.scheduledAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select value={b.status} onChange={e => updateBooking(b._id, { status: e.target.value })}
                          disabled={actionLoading === b._id}
                          className={`appearance-none pl-2 pr-6 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[b.status]}`}>
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openDetail(b)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setConfirm(b._id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{selected.guestName}</h3>
                <a href={`mailto:${selected.guestEmail}`} className="text-sm text-purple-600 hover:underline">{selected.guestEmail}</a>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Session Type</div><div className="font-semibold capitalize">{selected.sessionType}</div></div>
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Duration</div><div className="font-semibold">{selected.duration} min</div></div>
                <div className="bg-gray-50 rounded-xl p-3 col-span-2"><div className="text-xs text-gray-400 mb-1">Scheduled At</div><div className="font-semibold">{new Date(selected.scheduledAt).toLocaleString()}</div></div>
              </div>
              {selected.notes && (
                <div className="bg-gray-50 rounded-xl p-4"><div className="text-xs text-gray-400 mb-1">Notes</div><p className="text-sm text-gray-700">{selected.notes}</p></div>
              )}
              {/* Meeting link */}
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1.5">Meeting Link</label>
                <div className="flex gap-2">
                  <input value={editLink} onChange={e => setEditLink(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="https://zoom.us/..." />
                  <button onClick={() => updateBooking(selected._id, { meetingLink: editLink })}
                    className="px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors">
                    Save
                  </button>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap pt-1">
                {(['pending','confirmed','completed','cancelled'] as const).map(s => (
                  <button key={s} onClick={() => updateBooking(selected._id, { status: s })}
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
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Booking?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteBooking(confirm)} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
