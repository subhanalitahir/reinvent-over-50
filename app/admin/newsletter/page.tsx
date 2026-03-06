'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  Send, Users, Bell, CheckCircle, AlertCircle, Loader2,
  Eye, EyeOff, Mail,
} from 'lucide-react';

export default function AdminNewsletterPage() {
  const { token } = useAuth();

  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [sendToUsers, setSendToUsers] = useState(true);
  const [sendToSubscribers, setSendToSubscribers] = useState(true);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ total: number; sent: number; failed: number } | null>(null);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSend = async () => {
    setConfirmOpen(false);
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, htmlContent, sendToUsers, sendToSubscribers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Failed to send newsletter');
      setResult(data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const canSend = subject.trim() && htmlContent.trim() && (sendToUsers || sendToSubscribers);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Send Newsletter</h2>
        <p className="text-sm text-gray-500 mt-0.5">Compose and broadcast a newsletter to your users and/or subscribers.</p>
      </div>

      {/* Result banner */}
      {result && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Newsletter sent successfully!</p>
            <p className="text-sm text-green-700 mt-0.5">
              {result.sent} delivered · {result.failed} failed · {result.total} total recipients
            </p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Subject */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject Line <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. This month's tips for reinventing your life after 50 ✨"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Email Content (HTML) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setPreview(p => !p)}
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                {preview ? <><EyeOff className="w-3.5 h-3.5" /> Edit</> : <><Eye className="w-3.5 h-3.5" /> Preview</>}
              </button>
            </div>

            {preview ? (
              <div
                className="min-h-64 border border-gray-200 rounded-xl p-4 bg-gray-50 prose prose-sm max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: htmlContent || '<p class="text-gray-400">Nothing to preview yet.</p>' }}
              />
            ) : (
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                rows={16}
                placeholder={`Write HTML content here. Example:\n<h2>Hello!</h2>\n<p>This month we're sharing <strong>5 powerful tips</strong> to help you reinvent your life after 50.</p>\n<p>Read more on our <a href="https://example.com">website</a>.</p>`}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono resize-y"
              />
            )}
            <p className="text-xs text-gray-400 mt-2">
              Supports HTML. The content is wrapped in our branded email template automatically.
              Each email includes an unsubscribe link.
            </p>
          </div>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-5">
          {/* Recipients */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600" /> Recipients
            </h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={sendToUsers}
                  onChange={(e) => setSendToUsers(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-purple-600 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                    <Users className="w-3.5 h-3.5 text-purple-500" />
                    Registered Users
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">All accounts in the system</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={sendToSubscribers}
                  onChange={(e) => setSendToSubscribers(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-purple-600 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                    <Bell className="w-3.5 h-3.5 text-pink-500" />
                    Email Subscribers
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Newsletter subscribers (subscribed only)</p>
                </div>
              </label>
            </div>

            {!sendToUsers && !sendToSubscribers && (
              <p className="mt-3 text-xs text-red-500 font-medium">
                Select at least one recipient group.
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-purple-800 mb-2">Tips</h3>
            <ul className="text-xs text-purple-700 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Keep subject lines under 60 characters</li>
              <li>Use <code className="bg-purple-100 px-1 rounded">&lt;p&gt;</code>, <code className="bg-purple-100 px-1 rounded">&lt;h2&gt;</code>, <code className="bg-purple-100 px-1 rounded">&lt;strong&gt;</code> for formatting</li>
              <li>Use the Preview button to check your layout</li>
              <li>Duplicate recipients (user + subscriber) are sent only once</li>
              <li>Unsubscribe links are added automatically</li>
            </ul>
          </div>

          {/* Send button */}
          <button
            type="button"
            disabled={!canSend || loading}
            onClick={() => setConfirmOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
            ) : (
              <><Send className="w-4 h-4" /> Send Newsletter</>
            )}
          </button>
        </div>
      </div>

      {/* Confirm dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Send Newsletter?</h3>
            <p className="text-sm text-gray-500 text-center mb-1">Subject: <strong className="text-gray-800">{subject}</strong></p>
            <p className="text-sm text-gray-500 text-center mb-6">
              This will send to{' '}
              {[sendToUsers && 'all registered users', sendToSubscribers && 'all subscribers'].filter(Boolean).join(' and ')}.
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
              >
                Yes, Send It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
