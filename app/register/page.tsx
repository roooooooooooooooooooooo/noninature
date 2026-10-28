'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth/context';
import { useI18n } from '../../lib/i18n/context';
import { isValidBangladeshPhone } from '../../lib/utils/validation';
import { User, Lock, Mail, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { language, t } = useI18n();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidBangladeshPhone(phone)) {
      setError(
        language === 'bn'
          ? '১১ ডিজিটের সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।'
          : 'Please enter a valid 11-digit Bangladesh phone number.'
      );
      return;
    }

    if (password.length < 6) {
      setError(
        language === 'bn'
          ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    setIsLoading(true);
    const res = await signup(email, password, fullName, phone);
    setIsLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push('/account');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-serif text-forest-950">{t.register}</h1>
        <p className="text-xs sm:text-sm text-botanicalDark/70">
          {language === 'bn'
            ? 'নতুন NoniNature একাউন্ট তৈরি করুন'
            : 'Create your personal NoniNature customer account'}
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
              {t.fullName} *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Kazi Tanvir"
                className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 pl-10 text-xs outline-none focus:ring-2 focus:ring-leaf"
              />
              <User className="w-4 h-4 text-forest-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-900 uppercase">
              {t.phoneNumber} *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 pl-10 text-xs font-mono outline-none focus:ring-2 focus:ring-leaf"
              />
              <Phone className="w-4 h-4 text-forest-400 absolute left-3 top-3" />
            </div>
          </div>

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
            <label className="text-xs font-bold text-forest-900 uppercase">
              {language === 'bn' ? 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)' : 'Password (min 6 chars)'} *
            </label>
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
            <span>{isLoading ? (language === 'bn' ? 'একাউন্ট তৈরি হচ্ছে...' : 'Creating Account...') : t.register}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-forest-100 text-center text-xs text-botanicalDark/70">
          <span>{language === 'bn' ? 'ইতিমধ্যে একাউন্ট আছে? ' : 'Already have an account? '}</span>
          <Link href="/login" className="font-bold text-leaf hover:underline">
            {t.login}
          </Link>
        </div>
      </div>
    </div>
  );
}
