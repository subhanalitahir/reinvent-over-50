'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { DollarSign, Save, RefreshCw, Crown, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface MembershipPrices {
  community: { monthly: number; annual: number };
  growth: { monthly: number; annual: number };
  transformation: { monthly: number; annual: number };
  vip: { monthly: number; annual: number };
}

interface BookingPrices {
  discovery: number;
  coaching: number;
  extended: number;
  vip_intensive: number;
}

interface PricingConfig {
  membership: MembershipPrices;
  bookings: BookingPrices;
}

const PLAN_META: Record<keyof MembershipPrices, { label: string; desc: string; color: string }> = {
  community: { label: 'Community', desc: 'Entry-level plan', color: 'from-blue-500 to-cyan-500' },
  growth: { label: 'Growth', desc: 'Mid-tier plan', color: 'from-green-500 to-emerald-500' },
  transformation: { label: 'Transformation', desc: 'Most popular plan', color: 'from-purple-500 to-pink-500' },
  vip: { label: 'VIP', desc: 'Premium all-access', color: 'from-amber-500 to-orange-500' },
};

const BOOKING_META: Record<keyof BookingPrices, { label: string; desc: string; duration: string }> = {
  discovery: { label: 'Discovery Call', desc: 'Free intro session', duration: '30 min' },
  coaching: { label: 'Coaching Session', desc: 'Standard 1-on-1', duration: '60 min' },
  extended: { label: 'Extended Coaching', desc: 'Deep-dive session', duration: '90 min' },
  vip_intensive: { label: 'VIP Intensive', desc: 'Full transformation session', duration: '120 min' },
};

const DEFAULT: PricingConfig = {
  membership: {
    community: { monthly: 2900, annual: 29000 },
    growth: { monthly: 4900, annual: 49000 },
    transformation: { monthly: 5900, annual: 59000 },
    vip: { monthly: 9900, annual: 99000 },
  },
  bookings: { discovery: 0, coaching: 15000, extended: 20000, vip_intensive: 30000 },
};

// Convert cents ↔ dollars for display
const toDollars = (cents: number) => (cents / 100).toFixed(2);
const toCents = (dollars: string) => Math.round(parseFloat(dollars) * 100) || 0;

export default function AdminPricingPage() {
  const { token } = useAuth();
  const [config, setConfig] = useState<PricingConfig>(DEFAULT);
  const [draft, setDraft] = useState<PricingConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pricing', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      const data: PricingConfig = json?.data ?? DEFAULT;
      setConfig(data);
      setDraft(JSON.parse(JSON.stringify(data)));
    } catch {
      setConfig(DEFAULT);
      setDraft(JSON.parse(JSON.stringify(DEFAULT)));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const setMembershipPrice = (plan: keyof MembershipPrices, cycle: 'monthly' | 'annual', dollars: string) => {
    setDraft(prev => ({
      ...prev,
      membership: {
        ...prev.membership,
        [plan]: { ...prev.membership[plan], [cycle]: toCents(dollars) },
      },
    }));
  };

  const setBookingPrice = (key: keyof BookingPrices, dollars: string) => {
    setDraft(prev => ({ ...prev, bookings: { ...prev.bookings, [key]: toCents(dollars) } }));
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message ?? 'Save failed');
      setConfig(JSON.parse(JSON.stringify(draft)));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(draft) !== JSON.stringify(config);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pricing Configuration</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage membership plan prices and booking session rates</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={save}
            disabled={!isDirty || saving}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
          <CheckCircle className="w-5 h-5 shrink-0" /> Pricing saved successfully!
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Membership Pricing */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Membership Plans</h3>
                <p className="text-xs text-gray-400">Prices stored in cents — enter as dollars (e.g. 29 = $29.00)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(PLAN_META) as (keyof MembershipPrices)[]).map(plan => {
                const meta = PLAN_META[plan];
                const prices = draft.membership[plan];
                return (
                  <div key={plan} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${meta.color}`} />
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${meta.color} flex items-center justify-center text-white text-xs font-bold`}>
                        {meta.label.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{meta.label}</p>
                        <p className="text-xs text-gray-400">{meta.desc}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Monthly ($)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={toDollars(prices.monthly)}
                            onChange={e => setMembershipPrice(plan, 'monthly', e.target.value)}
                            className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white font-semibold text-gray-900"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{prices.monthly} cents</p>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Annual ($)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={toDollars(prices.annual)}
                            onChange={e => setMembershipPrice(plan, 'annual', e.target.value)}
                            className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white font-semibold text-gray-900"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{prices.annual} cents</p>
                      </div>
                    </div>
                    {/* Annual savings badge */}
                    {prices.monthly > 0 && (
                      <p className="text-[11px] text-green-600 font-semibold mt-3">
                        Annual saves {(((prices.monthly * 12 - prices.annual) / (prices.monthly * 12)) * 100).toFixed(0)}% vs monthly
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Booking Session Pricing */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Booking Session Rates</h3>
                <p className="text-xs text-gray-400">Set 0 for free sessions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(BOOKING_META) as (keyof BookingPrices)[]).map(key => {
                const meta = BOOKING_META[key];
                const price = draft.bookings[key];
                return (
                  <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{meta.label}</p>
                        <p className="text-xs text-gray-400">{meta.desc}</p>
                        <span className="inline-block text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1">{meta.duration}</span>
                      </div>
                      {price === 0 && (
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">FREE</span>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={toDollars(price)}
                        onChange={e => setBookingPrice(key, e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white font-semibold text-gray-900"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{price} cents</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Summary preview */}
          <section className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <h3 className="font-bold text-gray-700 text-sm">Live Pricing Preview</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              {(Object.keys(PLAN_META) as (keyof MembershipPrices)[]).map(plan => (
                <div key={plan} className="bg-white rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-1">{PLAN_META[plan].label}</p>
                  <p className="text-base font-bold text-gray-900">${toDollars(draft.membership[plan].monthly)}<span className="text-xs font-normal text-gray-400">/mo</span></p>
                  <p className="text-xs text-gray-400">${toDollars(draft.membership[plan].annual)}/yr</p>
                </div>
              ))}
            </div>
          </section>

          {/* Unsaved indicator */}
          {isDirty && (
            <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-700 font-medium">You have unsaved changes</p>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Now
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
