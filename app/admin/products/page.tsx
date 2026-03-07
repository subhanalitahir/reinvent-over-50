'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Search, Package, Trash2, Edit3, RefreshCw, Plus, X, ChevronDown } from 'lucide-react';

interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  type: 'workbook' | 'bundle' | 'course' | 'other';
  status: 'active' | 'inactive' | 'archived';
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
  fileUrl?: string;
  tags: string[];
  isDigital: boolean;
  includesBooking: boolean;
  isFreeForMembers: boolean;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-500',
  archived: 'bg-red-100 text-red-600',
};

const EMPTY: Partial<IProduct> = { name: '', slug: '', description: '', type: 'workbook', status: 'active', price: 0, isDigital: true, includesBooking: false, isFreeForMembers: false, tags: [] };

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filtered, setFiltered] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Partial<IProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?all=true&limit=100', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setProducts(json?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let list = products;
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter);
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [products, search, statusFilter]);

  const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const saveProduct = async () => {
    if (!selected) return;
    if (!selected.fileUrl?.trim()) {
      setSaveError('Download link is required.');
      return;
    }
    setSaveError('');
    setSaving(true);
    try {
      const isEdit = !!(selected as IProduct)._id;
      const url = isEdit ? `/api/products/${(selected as IProduct).slug ?? (selected as IProduct)._id}` : '/api/products';
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

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    const product = products.find(p => p._id === id);
    if (!product) return;
    try {
      await fetch(`/api/products/${product.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, status: status as IProduct['status'] } : p));
    } finally {
      setActionLoading(null);
    }
  };

  const deleteProduct = async (id: string) => {
    setConfirm(null);
    const product = products.find(p => p._id === id);
    if (!product) return;
    setActionLoading(id + '_del');
    try {
      await fetch(`/api/products/${product.slug}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setProducts(prev => prev.filter(p => p._id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} total products</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => { setSelected({ ...EMPTY }); setModal('create'); setSaveError(''); }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
            <Plus className="w-4 h-4" /> New Product
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="mb-4">No products found</p>
            <button onClick={() => { setSelected({ ...EMPTY }); setModal('create'); }}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold">Create First Product</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-semibold">Product</th>
                  <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell">Type</th>
                  <th className="text-left px-6 py-3 font-semibold">Price</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-400">/{p.slug}</div>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600 hidden sm:table-cell">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">{p.type}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ${p.price.toFixed(2)}
                      {p.compareAtPrice && <span className="ml-1 text-xs text-gray-400 line-through">${p.compareAtPrice}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select value={p.status} onChange={e => updateStatus(p._id, e.target.value)}
                          disabled={actionLoading === p._id}
                          className={`appearance-none pl-2 pr-6 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[p.status]}`}>
                          <option value="active">active</option>
                          <option value="inactive">inactive</option>
                          <option value="archived">archived</option>
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelected({ ...p }); setModal('edit'); setSaveError(''); }}
                          className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-50 hover:text-purple-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setConfirm(p._id)}
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
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">{modal === 'create' ? 'Create Product' : 'Edit Product'}</h3>
              <button onClick={() => { setModal(null); setSelected(null); }} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Name *</label>
                <input type="text" value={selected.name ?? ''}
                  onChange={e => setSelected(prev => ({ ...prev, name: e.target.value, slug: toSlug(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Slug *</label>
                <input type="text" value={selected.slug ?? ''}
                  onChange={e => setSelected(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Price ($) *</label>
                <input type="number" min="0" step="0.01" value={selected.price ?? 0}
                  onChange={e => setSelected(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Compare At Price ($)</label>
                <input type="number" min="0" step="0.01" value={selected.compareAtPrice ?? ''}
                  onChange={e => setSelected(prev => ({ ...prev, compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Type *</label>
                <select value={selected.type ?? 'workbook'} onChange={e => setSelected(prev => ({ ...prev, type: e.target.value as IProduct['type'] }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                  <option value="workbook">Workbook</option>
                  <option value="bundle">Bundle</option>
                  <option value="course">Course</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status</label>
                <select value={selected.status ?? 'active'} onChange={e => setSelected(prev => ({ ...prev, status: e.target.value as IProduct['status'] }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Image URL</label>
                <input type="url" value={selected.imageUrl ?? ''}
                  onChange={e => setSelected(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Download Link <span className="text-red-500">*</span>
                </label>
                <input type="url" value={selected.fileUrl ?? ''}
                  onChange={e => { setSelected(prev => ({ ...prev, fileUrl: e.target.value })); setSaveError(''); }}
                  placeholder="https://..."
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${saveError && !selected.fileUrl?.trim() ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                {saveError && !selected.fileUrl?.trim() && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium">{saveError}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description *</label>
                <textarea value={selected.description ?? ''} rows={3}
                  onChange={e => setSelected(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={selected.isDigital ?? true} onChange={e => setSelected(prev => ({ ...prev, isDigital: e.target.checked }))} className="rounded" />
                  Digital Product
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={selected.includesBooking ?? false} onChange={e => setSelected(prev => ({ ...prev, includesBooking: e.target.checked }))} className="rounded" />
                  Includes Booking
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={selected.isFreeForMembers ?? false} onChange={e => setSelected(prev => ({ ...prev, isFreeForMembers: e.target.checked }))} className="rounded" />
                  Free for Members
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => { setModal(null); setSelected(null); }} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={saveProduct} disabled={saving} className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-60">
                {saving ? 'Saving...' : modal === 'create' ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteProduct(confirm)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
