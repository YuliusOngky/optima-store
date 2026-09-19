'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw new Error(error.message);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim email reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4">📬</div>
          <h1 className="text-2xl font-black mb-2">Email Terkirim!</h1>
          <p className="text-gray-500 mb-6">
            Kami kirimkan link reset password ke <strong>{email}</strong>.<br />
            Cek inbox (atau folder spam) kamu.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-blue-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-800 transition"
          >
            Kembali ke Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🛍️</span>
            <div className="text-left">
              <div className="text-2xl font-black text-blue-700 leading-none">Optima</div>
              <div className="text-sm text-gray-400">Store</div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h1 className="text-xl font-black mb-1">Lupa Password?</h1>
          <p className="text-sm text-gray-500 mb-6">
            Masukkan email kamu dan kami akan kirimkan link untuk reset password.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Mengirim...' : 'Kirim Link Reset →'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
              ← Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
