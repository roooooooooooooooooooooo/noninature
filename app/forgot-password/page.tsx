'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '../../lib/i18n/context';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { language, t } = useI18n();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
          {language === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Forgot Password'}
        </h1>
        <p className="text-xs sm:text-sm text-botanicalDark/70">
          {language === 'bn'
            ? 'আপনার একাউন্টের ইমেইল প্রদান করুন, আমরা রিকভারি লিংক পাঠিয়ে দেব।'
            : 'Enter your registered email address to receive password reset link.'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm space-y-6">
        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-leaf/15 text-leaf rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm text-forest-950 font-medium">
              {language === 'bn'
                ? `আমরা ${email} ঠিকানায় পাসওয়ার্ড রিকভারি নির্দেশনা পাঠিয়েছি (যদি একাউন্ট নিবন্ধিত থাকে)।`
                : `We have sent password recovery instructions to ${email} (if registered).`}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-leaf hover:underline pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'bn' ? 'লগইন পাতায় ফিরে যান' : 'Back to Login'}</span>
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              className="w-full py-3 bg-forest-900 hover:bg-forest-800 text-ivory rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'bn' ? 'রিকভারি লিংক পাঠান' : 'Send Reset Link'}</span>
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-forest-700 hover:text-forest-950 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লগইন পৃষ্ঠায় ফিরে যান' : 'Back to Login'}</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
