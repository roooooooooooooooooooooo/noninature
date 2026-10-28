'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, type Language } from './dictionaries';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof dictionaries['bn'];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn'); // default to Bangla for Bangladesh market

  useEffect(() => {
    try {
      const stored = localStorage.getItem('noninature_lang') as Language;
      if (stored === 'en' || stored === 'bn') {
        setLanguageState(stored);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('noninature_lang', lang);
    } catch {
      // Ignore
    }
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t: dictionaries[language],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return context;
}
