import i18n from '@/pages/1-HomePage/others/lib/i18n/i18n';

/**
 * Apply text direction (RTL/LTR) to the HTML element based on language
 */
export const applyDirToHtml = (lang = i18n.language) => {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', dir);
};

/**
 * Watch for language changes and update HTML direction automatically
 */
export const watchDirection = () => {
  applyDirToHtml(i18n.language);
  i18n.on('languageChanged', (lng) => applyDirToHtml(lng));
};

