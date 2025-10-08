import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Eager-load "common" so the app shell can render immediately.
// Lazy-load other namespaces per route.
import en_common from './locales/en/common.json';
import ar_common from './locales/ar/common.json';

export const SUPPORTED_LANGS = ['en', 'ar'] as const;
export type AppLang = typeof SUPPORTED_LANGS[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    defaultNS: 'common',
    ns: ['common'],
    resources: {
      en: { common: en_common },
      ar: { common: ar_common },
    },
    interpolation: { 
      escapeValue: false // React already escapes values
    },
    returnNull: false,
    load: 'currentOnly',
    detection: {
      // Detection order: URL query, localStorage, cookie, browser navigator
      order: ['querystring', 'localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;

