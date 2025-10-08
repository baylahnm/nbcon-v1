import { useEffect, useState } from 'react';
import i18n from '@/pages/1-HomePage/others/lib/i18n/i18n';

/**
 * Hook to lazy-load i18n namespaces for route-level code splitting
 * 
 * @param ns - Namespace(s) to load (string or array of strings)
 * @returns boolean - true when namespace(s) are loaded and ready
 * 
 * @example
 * const ready = useNamespace('pricing');
 * const ready = useNamespace(['pricing', 'common']);
 */
export function useNamespace(ns: string | string[]): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const namespaces = Array.isArray(ns) ? ns : [ns];
    i18n.loadNamespaces(namespaces).then(() => setReady(true));
  }, [ns]);

  return ready;
}

