import i18n from '@/pages/1-HomePage/others/lib/i18n/i18n';

/**
 * Format a number as SAR currency based on the current language
 * @param n - The number to format
 * @param opts - Additional Intl.NumberFormat options
 * @returns Formatted currency string
 * 
 * @example
 * formatSAR(45) // "SAR 45.00" (en) or "٤٥٫٠٠ ر.س." (ar)
 */
export const formatSAR = (n: number, opts: Intl.NumberFormatOptions = {}): string => {
  return new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'SAR',
    ...opts,
  }).format(n);
};

/**
 * Format a date based on the current language
 * @param d - The date to format
 * @param opts - Additional Intl.DateTimeFormat options
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date()) // "Jan 15, 2024" (en) or "١٥ يناير ٢٠٢٤" (ar)
 */
export const formatDate = (d: Date, opts: Intl.DateTimeFormatOptions = {}): string => {
  return new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...opts,
  }).format(d);
};

/**
 * Format a number with locale-specific formatting
 * @param n - The number to format
 * @param opts - Additional Intl.NumberFormat options
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234.56) // "1,234.56" (en) or "١٬٢٣٤٫٥٦" (ar)
 */
export const formatNumber = (n: number, opts: Intl.NumberFormatOptions = {}): string => {
  return new Intl.NumberFormat(i18n.language, opts).format(n);
};

/**
 * Format a relative time (e.g., "2 hours ago")
 * @param d - The date to compare to now
 * @returns Formatted relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago" (en) or "منذ ساعة واحدة" (ar)
 */
export const formatRelativeTime = (d: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
};

