'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useI18n } from '../../lib/i18n/context';
import { mockSiteSettings } from '../../lib/mock-data';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { language, t } = useI18n();
  const settings = mockSiteSettings.general_settings;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-leaf">
          {language === 'bn' ? 'সরাসরি যোগাযোগ' : 'Get in Touch'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-forest-950">
          {t.contact}
        </h1>
        <p className="text-xs sm:text-sm text-botanicalDark/70 max-w-md mx-auto">
          {language === 'bn'
            ? 'পণ্য, অর্ডার বা নোনি চাষ বিষয়ক যেকোনো তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।'
            : 'Have questions about noni products, order delivery, or tree cultivation? Contact us.'}
        </p>
      </div>

      {/* Botanical Contact Banner */}
      <div className="relative h-48 sm:h-64 w-full rounded-3xl overflow-hidden shadow-lg border border-forest-100 group">
        <Image
          src="/images/slides/slide-1.webp"
          alt="NoniNature Contact"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent flex items-end p-6">
          <p className="text-ivory font-serif font-bold text-base sm:text-lg">
            {language === 'bn'
              ? 'সারাদেশে গ্রাহক সেবা ও দ্রুত ডেলিভারির নিশ্চয়তা'
              : 'Nationwide Customer Support & Express Delivery Support'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold font-serif text-forest-950 border-b border-forest-100 pb-3">
            {language === 'bn' ? 'অফিস ও খামার ঠিকানা' : 'Office & Inquiries'}
          </h2>

          <div className="space-y-4 text-xs text-botanicalDark/80">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-forest-50 text-leaf rounded-xl flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-forest-950 block mb-0.5">
                  {language === 'bn' ? 'প্রধান কার্যালয়' : 'Head Office'}
                </strong>
                <span>{language === 'bn' ? settings.office_address_bn : settings.office_address_en}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-forest-50 text-leaf rounded-xl flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-forest-950 block mb-0.5">
                  {language === 'bn' ? 'হটলাইন / হোয়াটসঅ্যাপ' : 'Hotline & WhatsApp'}
                </strong>
                <span>{settings.contact_phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-forest-50 text-leaf rounded-xl flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-forest-950 block mb-0.5">
                  {language === 'bn' ? 'ইমেইল সাপোর্ট' : 'Email Support'}
                </strong>
                <span>{settings.contact_email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-forest-50 text-leaf rounded-xl flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-forest-950 block mb-0.5">
                  {language === 'bn' ? 'কার্যদিবস ও সময়' : 'Working Hours'}
                </strong>
                <span>
                  {language === 'bn'
                    ? 'শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - রাত ৮:০০'
                    : 'Saturday - Thursday: 9:00 AM - 8:00 PM'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 bg-leaf/15 text-leaf rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-forest-950 font-serif">
                {language === 'bn' ? 'ধন্যবাদ! আপনার বার্তা গৃহীত হয়েছে।' : 'Message Received!'}
              </h3>
              <p className="text-xs text-botanicalDark/70 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।'
                  : 'Our customer support specialist will respond to you shortly.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold font-serif text-forest-950 border-b border-forest-100 pb-3">
                {language === 'bn' ? 'আমাদের বার্তা পাঠান' : 'Send a Message'}
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Hasan"
                  className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-leaf"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-forest-900 uppercase">
                    {language === 'bn' ? 'ইমেইল' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-forest-900 uppercase">
                    {t.phoneNumber} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase">
                  {language === 'bn' ? 'আপনার বার্তা / প্রশ্ন' : 'Your Message / Inquiry'} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার বক্তব্য বিস্তারিত লিখুন...' : 'Write your inquiry here...'}
                  className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-leaf"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-forest-900 hover:bg-forest-800 text-ivory rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
