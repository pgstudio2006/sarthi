import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppLanguage, translations } from '../i18n/translations';

type Language = 'English' | 'Gujarati' | 'Hindi' | 'Kannada';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('English');

  useEffect(() => {
    AsyncStorage.getItem('selectedLanguage').then((stored) => {
      const languageMap: Record<string, Language> = {
        en: 'English',
        hi: 'Hindi',
        kn: 'Kannada',
        gu: 'Gujarati',
      };
      if (stored && languageMap[stored]) setLanguageState(languageMap[stored]);
    });
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    const languageMap: Record<Language, string> = {
      English: 'en',
      Hindi: 'hi',
      Kannada: 'kn',
      Gujarati: 'gu',
    };
    AsyncStorage.setItem('selectedLanguage', languageMap[nextLanguage]).catch(() => {});
  };

  const t = (key: string) => translations[language as AppLanguage][key] || translations.English[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
