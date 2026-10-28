import { useSyncExternalStore } from 'react';
import { localeFromPath, stripLocale } from '@preco-real/ui';
import type { Locale } from '@preco-real/ui';

const EVENT = 'pr:navigate';
const base = () => (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/** Caminho + query atuais, sem o prefixo de implantação (BASE_URL). */
function snapshot(): string {
  const p = window.location.pathname.startsWith(base()) ? window.location.pathname.slice(base().length) || '/' : window.location.pathname;
  return p + window.location.search;
}

function subscribe(cb: () => void) {
  window.addEventListener('popstate', cb);
  window.addEventListener(EVENT, cb);
  return () => { window.removeEventListener('popstate', cb); window.removeEventListener(EVENT, cb); };
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const url = base() + to;
  if (opts.replace) window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);
  window.dispatchEvent(new Event(EVENT));
}

export interface Route {
  /** Caminho com idioma, ex.: /en/calculadora */
  path: string;
  /** Caminho sem idioma, ex.: /calculadora */
  page: string;
  search: URLSearchParams;
  locale: Locale;
}

export function useRoute(): Route {
  const snap = useSyncExternalStore(subscribe, snapshot, () => '/');
  const [path, q = ''] = snap.split('?');
  return { path, page: stripLocale(path).replace(/\/$/, '') || '/', search: new URLSearchParams(q), locale: localeFromPath(path) };
}

/** Navegação sem recarregar para ligações internas (<a href="/…">). */
export function installLinkInterceptor() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || a.target || a.hasAttribute('download') || a.origin !== window.location.origin) return;
    const href = a.getAttribute('href')!;
    if (href.startsWith('#') && href.length > 1) return; // âncoras na página
    e.preventDefault();
    const rel = a.pathname.startsWith(base()) ? a.pathname.slice(base().length) || '/' : a.pathname;
    navigate(rel + a.search + (a.hash || ''));
    if (!a.hash) window.scrollTo(0, 0);
  });
}
