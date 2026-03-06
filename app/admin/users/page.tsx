'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Search, User, Trash2, ChevronDown, RefreshCw, Eye, X, Calendar, ShoppingBag, Crown, Loader2 } from 'lucide-react';

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'visitor' | 'member' | 'admin';
  isVerified: boolean;
  createdAt: string;
  avatar?: string;
}

interface ActivityData {
  member: { plan?: string; status?: string; billingCycle?: string } | null;
  bookings: { _id: string; sessionType?: string; status: string; scheduledAt?: string; price?: number }[];
  orders: { _id: string; total?: number; status: string; createdAt: string; items?: { name: string; quantity: number }[] }[];
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  member: 'bg-green-100 text-green-700',
  visitor: 'bg-gray-100 text-gray-600',
};

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<IUser[]>([]);
  const [filtered, setFiltered] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);
  const [activityUser, setActivityUser] = useState<IUser | null>(null);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/users', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setUsers(json?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let list = users;
    if (roleFilter !== 'all') list = list.filter(u => u.role === roleFilter);
    if (search) list = list.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [users, search, roleFilter]);

  const changeRole = async (id: string, role: string) => {
    setActionLoading(id + '_role');
    try {
      await fetch(`/api/auth/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: role as IUser['role'] } : u));
    } finally {
      setActionLoading(null);
    }
  };

  const viewActivity = useCallback(async (u: IUser) => {
    setActivityUser(u);
    setActivityData(null);
    setActivityLoading(true);
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [bookingsRes, ordersRes, membersRes] = await Promise.all([
        fetch('/api/bookings', { headers }),
        fetch('/api/orders', { headers }),
        fetch('/api/members', { headers }),
      ]);
      const [bookingsJson, ordersJson, membersJson] = await Promise.all([
        bookingsRes.json(), ordersRes.json(), membersRes.json(),
      ]);
      const allBookings = bookingsJson?.data ?? [];
      const allOrders = ordersJson?.data ?? [];
      const allMembers = membersJson?.data ?? [];
      setActivityData({
        member: allMembers.find((m: { user?: { _id?: string }; email?: string }) =>
          m.user?._id === u._id || m.email === u.email
        ) ?? null,
        bookings: allBookings
          .filter((b: { guestEmail?: string }) => b.guestEmail === u.email)
          .slice(0, 5),
        orders: allOrders
          .filter((o: { guestEmail?: string }) => o.guestEmail === u.email)
          .slice(0, 5),
      });
    } finally {
      setActivityLoading(false);
    }
  }, [token]);

  const deleteUser = async (id: string) => {
    setConfirm(null);
    setActionLoading(id + '_del');
    try {
      await fetch(`/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(prev => prev.filter(u => u._id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} total accounts</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="visitor">Visitor</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <User className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-semibold">User</th>
                  <th className="text-left px-6 py-3 font-semibold">Role</th>
                  <th className="text-left px-6 py-3 font-semibold hidden md:table-cell">Verified</th>
                  <th className="text-left px-6 py-3 font-semibold hidden lg:table-cell">Joined</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={u.role}
                          onChange={e => changeRole(u._id, e.target.value)}
                          disabled={actionLoading === u._id + '_role'}
                          className={`appearance-none pl-2 pr-6 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none ${ROLE_COLORS[u.role]}`}
                        >
                          <option value="visitor">visitor</option>
                          <option value="member">member</option>
                          <option value="admin">admin</option>
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`text-xs font-medium ${u.isVerified ? 'text-green-600' : 'text-gray-400'}`}>
                        {u.isVerified ? '✓ Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs hidden lg:table-cell">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => viewActivity(u)}
                          className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="View activity"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirm({ id: u._id, name: u.name })}
                          disabled={u.role === 'admin' || actionLoading === u._id + '_del'}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      {confirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete User?</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete <strong>{confirm.name}</strong>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => deleteUser(confirm.id)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Activity modal */}
      {activityUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                  {activityUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{activityUser.name}</h3>
                  <p className="text-xs text-gray-400">{activityUser.email}</p>
                </div>
              </div>
              <button onClick={() => setActivityUser(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {activityLoading ? (
                <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm">Loading activity…</span>
                </div>
              ) : (
                <>
                  {/* Membership */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <h4 className="font-semibold text-gray-800 text-sm">Membership</h4>
                    </div>
                    {activityData?.member ? (
                      <div className="flex items-center gap-4 bg-amber-50 rounded-xl px-4 py-3">
                        <div>
                          <p className="font-semibold text-amber-900 capitalize">{activityData.member.plan ?? '—'}</p>
                          <p className="text-xs text-amber-600">{activityData.member.billingCycle ?? ''}</p>
                        </div>
                        <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${activityData.member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {activityData.member.status ?? 'unknown'}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No membership found</p>
                    )}
                  </section>

                  {/* Bookings */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <h4 className="font-semibold text-gray-800 text-sm">Recent Bookings</h4>
                      <span className="text-xs text-gray-400">({activityData?.bookings.length ?? 0})</span>
                    </div>
                    {activityData?.bookings.length ? (
                      <div className="space-y-2">
                        {activityData.bookings.map(b => (
                          <div key={b._id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 text-sm">
                            <div>
                              <p className="font-medium text-gray-800 capitalize">{b.sessionType ?? 'session'}</p>
                              <p className="text-xs text-gray-400">{b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString() : '—'}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                                {b.status}
                              </span>
                              {b.price != null && <p className="text-xs text-gray-400 mt-1">${(b.price / 100).toFixed(2)}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No bookings found</p>
                    )}
                  </section>

                  {/* Orders */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingBag className="w-4 h-4 text-purple-500" />
                      <h4 className="font-semibold text-gray-800 text-sm">Recent Orders</h4>
                      <span className="text-xs text-gray-400">({activityData?.orders.length ?? 0})</span>
                    </div>
                    {activityData?.orders.length ? (
                      <div className="space-y-2">
                        {activityData.orders.map(o => (
                          <div key={o._id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 text-sm">
                            <div>
                              <p className="font-medium text-gray-800">{o.items?.[0]?.name ?? 'Order'}{o.items && o.items.length > 1 ? ` +${o.items.length - 1}` : ''}</p>
                              <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${o.status === 'completed' ? 'bg-green-100 text-green-700' : o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                                {o.status}
                              </span>
                              {o.total != null && <p className="text-xs text-gray-500 mt-1 font-semibold">${o.total.toFixed(2)}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No orders found</p>
                    )}
                  </section>

                  {/* Total spend */}
                  {activityData && (activityData.orders.length > 0 || activityData.bookings.length > 0) && (
                    <div className="bg-purple-50 rounded-xl px-4 py-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-purple-800">Total Spend (visible records)</p>
                      <p className="text-lg font-bold text-purple-900">
                        ${(
                          activityData.orders.reduce((s, o) => s + (o.total ?? 0), 0) +
                          activityData.bookings.reduce((s, b) => s + (b.price ? b.price / 100 : 0), 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
