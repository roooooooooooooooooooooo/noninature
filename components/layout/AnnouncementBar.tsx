'use client';

import React from 'react';
import { useI18n } from '../../lib/i18n/context';
import { mockSiteSettings } from '../../lib/mock-data';
import { Globe, Phone, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  const { language, setLanguage } = useI18n();
  const settings = mockSiteSettings.general_settings;

  const announcement = language === 'bn' ? settings.announcement_bn : settings.announcement_en;

  return (
    <div className="bg-forest-900 text-ivory text-xs sm:text-sm py-2 px-4 transition-colors border-b border-forest-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left font-medium">
          <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
          <span>{announcement}</span>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden md:flex items-center gap-1 text-ivory/80 hover:text-ivory">
            <Phone className="w-3.5 h-3.5 text-gold" />
            <span>{settings.contact_phone}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-forest-800/80 rounded-full px-2.5 py-0.5 border border-forest-700/60">
            <Globe className="w-3.5 h-3.5 text-gold" />
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`px-1.5 py-0.5 rounded text-xs transition-all font-semibold ${
                language === 'bn' ? 'bg-gold text-forest-950 shadow-sm' : 'text-ivory/80 hover:text-ivory'
              }`}
            >
              বাংলা
            </button>
            <span className="text-forest-600 text-xs">|</span>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded text-xs transition-all font-semibold ${
                language === 'en' ? 'bg-gold text-forest-950 shadow-sm' : 'text-ivory/80 hover:text-ivory'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
