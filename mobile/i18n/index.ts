import { useLanguage } from '../context/LanguageContext';
import { translations, AppLanguage } from './translations';
import { dateLocales } from './dateLocales';

const languageToCode: Record<AppLanguage, string> = {
  English: 'en',
  Gujarati: 'gu',
  Hindi: 'hi',
  Kannada: 'kn',
};

export function getLangCode(language: AppLanguage): string {
  return languageToCode[language] ?? 'en';
}

export function tFor(language: AppLanguage, key: string, params?: Record<string, string>): string {
  const table = translations[language] ?? translations.English;
  let value = table[key];
  if (typeof value !== 'string') {
    value = translations.English[key];
    if (typeof value !== 'string') return key;
  }
  if (params) {
    value = value.replace(/\{(\w+)\}/g, (_, name) =>
      params[name] !== undefined ? params[name] : `{${name}}`
    );
  }
  return value;
}

export function useTranslation() {
  const { language, setLanguage } = useLanguage();
  const code = getLangCode(language);
  const t = (key: string, params?: Record<string, string>) => tFor(language, key, params);
  return { t, language, code, setLanguage };
}

export function useDateLocale() {
  const { language } = useLanguage();
  const code = getLangCode(language);
  return dateLocales[code] ?? dateLocales.en;
}

export { AppLanguage };
export { translations };
