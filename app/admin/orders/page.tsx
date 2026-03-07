'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Search, ShoppingBag, Eye, RefreshCw, X, ChevronDown } from 'lucide-react';

interface IOrderItem { name: string; price: number; quantity: number; }
interface IOrder {
  _id: string;
  guestName?: string;
  guestEmail: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  currency: string;
  paidAt?: string;
  createdAt: string;
  stripeSessionId?: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filtered, setFiltered] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<IOrder | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setOrders(json?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let list = orders;
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    if (search) list = list.filter(o =>
      (o.guestName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      o.guestEmail.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [orders, search, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: status as IOrder['status'] } : o));
      if (selected?._id === id) setSelected(prev => prev ? { ...prev, status: status as IOrder['status'] } : null);
    } finally {
      setActionLoading(null);
    }
  };

  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((acc, o) => acc + o.total, 0) / 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {orders.length} total · <span className="font-semibold text-green-600">${totalRevenue.toFixed(2)} revenue</span>
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
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
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-semibold">Customer</th>
                  <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell">Items</th>
                  <th className="text-left px-6 py-3 font-semibold">Total</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-left px-6 py-3 font-semibold hidden lg:table-cell">Date</th>
                  <th className="text-right px-6 py-3 font-semibold">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{o.guestName ?? 'Guest'}</div>
                      <div className="text-xs text-gray-400">{o.guestEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 hidden sm:table-cell">
                      {o.items.map(i => i.name).join(', ').slice(0, 40)}{o.items.length > 1 ? ` +${o.items.length - 1}` : ''}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">${(o.total / 100).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                          disabled={actionLoading === o._id}
                          className={`appearance-none pl-2 pr-6 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[o.status]}`}>
                          <option value="pending">pending</option>
                          <option value="paid">paid</option>
                          <option value="failed">failed</option>
                          <option value="refunded">refunded</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs hidden lg:table-cell">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelected(o)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
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
                <h3 className="font-bold text-gray-900 text-lg">Order #{selected._id.slice(-8).toUpperCase()}</h3>
                <div className="text-sm text-gray-500">{selected.guestEmail}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Customer</div><div className="font-semibold">{selected.guestName ?? 'Guest'}</div></div>
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Total</div><div className="font-bold text-gray-900">${(selected.total / 100).toFixed(2)} {selected.currency.toUpperCase()}</div></div>
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Date</div><div className="font-semibold">{new Date(selected.createdAt).toLocaleString()}</div></div>
                {selected.paidAt && <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Paid At</div><div className="font-semibold">{new Date(selected.paidAt).toLocaleString()}</div></div>}
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-2">Order Items</div>
                <div className="space-y-2">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3 text-sm">
                      <span className="font-medium">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                      <span className="font-bold">${(item.price / 100 * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap pt-1">
                {(['pending','paid','failed','refunded','cancelled'] as const).map(s => (
                  <button key={s} onClick={() => updateStatus(selected._id, s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selected.status === s ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
