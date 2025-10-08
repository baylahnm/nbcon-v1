import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Eager-load "common", "homepage", "auth", and "registration" so the app shell can render immediately.
// Lazy-load other namespaces per route.
import en_common from './locales/en/common.json';
import ar_common from './locales/ar/common.json';
import en_homepage from './locales/en/homepage.json';
import ar_homepage from './locales/ar/homepage.json';
import en_auth from './locales/en/auth.json';
import ar_auth from './locales/ar/auth.json';
import en_registration from './locales/en/registration.json';
import ar_registration from './locales/ar/registration.json';
import en_client from './locales/en/client.json';
import ar_client from './locales/ar/client.json';

export const SUPPORTED_LANGS = ['en', 'ar'] as const;
export type AppLang = typeof SUPPORTED_LANGS[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    defaultNS: 'common',
    ns: ['common', 'homepage', 'auth', 'registration', 'client'],
    resources: {
      en: { 
        common: en_common,
        homepage: en_homepage,
        auth: en_auth,
        registration: en_registration,
        client: en_client
      },
      ar: { 
        common: ar_common,
        homepage: ar_homepage,
        auth: ar_auth,
        registration: ar_registration,
        client: ar_client
      },
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

