'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth/context';
import { useI18n } from '../../lib/i18n/context';
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, simulateAdmin } = useAuth();
  const { language, t } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push('/account');
    }
  };

  const handleQuickDemoAdmin = () => {
    simulateAdmin(true);
    router.push('/admin');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-serif text-forest-950">{t.login}</h1>
        <p className="text-xs sm:text-sm text-botanicalDark/70">
          {language === 'bn'
            ? 'আপনার NoniNature একাউন্টে প্রবেশ করুন'
            : 'Sign in to access your orders and profile'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-900 uppercase">
              {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'} *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 pl-10 text-xs outline-none focus:ring-2 focus:ring-leaf"
              />
              <Mail className="w-4 h-4 text-forest-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-forest-900 uppercase">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'} *
              </label>
              <Link href="/forgot-password" className="text-leaf hover:underline">
                {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 pl-10 text-xs outline-none focus:ring-2 focus:ring-leaf"
              />
              <Lock className="w-4 h-4 text-forest-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-ivory rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span>{isLoading ? (language === 'bn' ? 'লগইন হচ্ছে...' : 'Signing in...') : t.login}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-forest-100 text-center text-xs text-botanicalDark/70">
          <span>{language === 'bn' ? 'কোনো একাউন্ট নেই? ' : "Don't have an account? "}</span>
          <Link href="/register" className="font-bold text-leaf hover:underline">
            {t.register}
          </Link>
        </div>

        {/* Demo Fast-Admin Switcher for testing */}
        <div className="p-4 bg-gold/10 border border-gold/30 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-forest-950">
            <Shield className="w-4 h-4 text-gold-dark" />
            <span>{language === 'bn' ? 'এডমিন ডেমো এক্সেস' : 'Admin Demo Access'}</span>
          </div>
          <p className="text-forest-700 text-[11px]">
            {language === 'bn'
              ? 'লোকাল টেস্টিং ও এডমিন ড্যাশবোর্ড পর্যালোচনার জন্য এক ক্লিকে এডমিন মোড সক্রিয় করুন।'
              : 'Quickly preview admin dashboard functionality and management tools in development.'}
          </p>
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="w-full py-2 bg-gold hover:bg-gold-light text-forest-950 font-bold rounded-xl text-xs transition-colors"
          >
            {language === 'bn' ? 'এডমিন মোডে প্রবেশ করুন' : 'Launch Admin Mode'}
          </button>
        </div>
      </div>
    </div>
  );
}
