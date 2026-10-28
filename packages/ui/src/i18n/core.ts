import type { Locale, NumFormat } from '../types';
import ptPt from './locales/pt_pt.json';
import en from './locales/en.json';

export type Messages = Record<string, string>;

export const DEFAULT_LOCALE: Locale = 'pt_pt';

export const MESSAGES: Record<Locale, Messages> = { pt_pt: ptPt, en };

export interface LocaleInfo {
  value: Locale;
  /** BCP 47, para `<html lang>`, `hreflang` e `Intl`. */
  tag: string;
  short: string;
  /** stringKey com o nome do idioma na própria língua. */
  label: string;
  /** Prefixo de URL: '' para o idioma por defeito, '/en' para os outros. */
  prefix: string;
}

export const LOCALES: LocaleInfo[] = [
  { value: 'pt_pt', tag: 'pt-PT', short: 'PT', label: 'lang.pt_pt', prefix: '' },
  { value: 'en', tag: 'en', short: 'EN', label: 'lang.en', prefix: '/en' },
];

export const KEY_RE = /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z0-9_]+)+$/;

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && v in MESSAGES;
}

export function lookup(locale: Locale, key: string): string | null {
  const m = MESSAGES[locale];
  if (m && m[key] != null) return m[key];
  const d = MESSAGES[DEFAULT_LOCALE];
  return d && d[key] != null ? d[key] : null;
}

export function formatNumber(locale: Locale, spec: NumFormat): string {
  const n = spec.num;
  const d = spec.d || 0;
  const parts = Math.abs(n).toFixed(d).split('.');
  const int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, locale === 'en' ? ',' : ' ');
  const dec = parts[1] ? (locale === 'en' ? '.' : ',') + parts[1] : '';
  const v = (n < 0 ? '−' : spec.sign && n > 0 ? '+' : '') + int + dec;
  return spec.f ? translate(locale, 'fmt.' + spec.f, { v }) : v;
}

/** Resolve uma stringKey, `{k,p}` ou `{num,…}`; qualquer outro valor passa tal e qual. */
export function resolve(locale: Locale, v: unknown): any {
  if (v == null || typeof v === 'boolean') return v;
  if (typeof v === 'string') return KEY_RE.test(v) && lookup(locale, v) != null ? translate(locale, v) : v;
  if (typeof v === 'object' && !Array.isArray(v) && !('$$typeof' in (v as object))) {
    const o = v as { k?: string; p?: Record<string, unknown>; num?: number };
    if (o.k) return translate(locale, o.k, o.p);
    if (o.num != null) return formatNumber(locale, v as NumFormat);
  }
  return v;
}

/** Chave em falta (também em pt_pt) aparece como ⟦chave⟧ para ser visível em revisão. */
export function translate(locale: Locale, key: string, params?: Record<string, unknown>): string {
  const s = lookup(locale, key);
  if (s == null) return '⟦' + key + '⟧';
  return s.replace(/\{(\w+)\}/g, (m, name: string) => {
    const val = params ? resolve(locale, params[name]) : null;
    return val != null ? String(val) : m;
  });
}

export function htmlLang(locale: Locale): string {
  return (LOCALES.find((l) => l.value === locale) || LOCALES[0]).tag;
}

/** `/en/calculadora` → 'en'; qualquer outro caminho → idioma por defeito. */
export function localeFromPath(pathname: string): Locale {
  for (const l of LOCALES) {
    if (l.prefix && (pathname === l.prefix || pathname.startsWith(l.prefix + '/'))) return l.value;
  }
  return DEFAULT_LOCALE;
}

/** Caminho sem prefixo de idioma. */
export function stripLocale(pathname: string): string {
  for (const l of LOCALES) {
    if (l.prefix && (pathname === l.prefix || pathname.startsWith(l.prefix + '/'))) {
      return pathname.slice(l.prefix.length) || '/';
    }
  }
  return pathname;
}

/** Caminho do mesmo conteúdo noutro idioma (`/calculadora` ↔ `/en/calculadora`). */
export function localePath(locale: Locale, pathname: string): string {
  const info = LOCALES.find((l) => l.value === locale) || LOCALES[0];
  const bare = stripLocale(pathname);
  return info.prefix ? info.prefix + (bare === '/' ? '/' : bare) : bare;
}
