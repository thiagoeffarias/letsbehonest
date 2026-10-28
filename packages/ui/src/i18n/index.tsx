import { createContext, useContext, useMemo } from 'react';
import { h } from '../h';
import type { ReactNode } from 'react';
import type { LanguageOption, Locale, NumFormat } from '../types';
import { DEFAULT_LOCALE, LOCALES, formatNumber, resolve, translate } from './core';

export * from './core';

interface I18nContextValue {
  locale: Locale;
  setLocale?: (locale: Locale) => void;
  hrefFor?: (locale: Locale) => string;
}
const I18nContext = createContext<I18nContextValue>({ locale: DEFAULT_LOCALE });

export interface I18nProviderProps {
  /** Idioma ativo; `pt_pt` por defeito. */
  locale?: Locale;
  /** Chamado pelo seletor de idioma (ex.: navegar para /en/). */
  onLocaleChange?: (locale: Locale) => void;
  /** Ligação de cada idioma para o seletor (SEO e sem JavaScript). */
  localeHref?: (locale: Locale) => string;
  children?: ReactNode;
}

/** Fornece o idioma aos componentes. */
export function I18nProvider(props: I18nProviderProps) {
  var value = useMemo(
    function () { return { locale: props.locale || DEFAULT_LOCALE, setLocale: props.onLocaleChange, hrefFor: props.localeHref }; },
    [props.locale, props.onLocaleChange, props.localeHref]
  );
  return h(I18nContext.Provider, { value: value }, props.children);
}

/** Nome usado nos ecrãs do Claude Design. */
export const I18n = I18nProvider;

export interface UseI18n {
  locale: Locale;
  /** Muda o idioma, se o `I18nProvider` tiver `onLocaleChange`. */
  setLocale?: (locale: Locale) => void;
  /** Ligação para cada idioma, se o `I18nProvider` tiver `localeHref`. */
  hrefFor?: (locale: Locale) => string;
  /** Traduz uma chave com parâmetros. */
  t: (key: string, params?: Record<string, unknown>) => string;
  /** Resolve stringKey, `{k,p}` ou número formatado; outros valores passam. */
  tr: (v: unknown) => any;
  /** Formata um número segundo o idioma. */
  fmt: (spec: NumFormat) => string;
}

export function useI18n(): UseI18n {
  const ctx = useContext(I18nContext);
  const locale = ctx.locale;
  return useMemo(
    () => ({
      locale,
      setLocale: ctx.setLocale,
      hrefFor: ctx.hrefFor,
      t: (key, params) => translate(locale, key, params),
      tr: (v) => resolve(locale, v),
      fmt: (spec) => formatNumber(locale, spec),
    }),
    [locale, ctx.setLocale, ctx.hrefFor],
  );
}

function Tr(props: { k: string }) {
  return useI18n().tr(props.k);
}

/** Texto traduzido dentro de elementos que só aceitam filhos simples (`summary`). */
export function i18nText(k: string) {
  return h(Tr, { k });
}

/** Opções do seletor de idioma, geradas do registo `LOCALES`. */
export function languageOptions(hrefFor?: (locale: Locale) => string): LanguageOption[] {
  return LOCALES.map((l) => ({
    value: l.value,
    short: l.short,
    label: l.label,
    tag: l.tag,
    href: hrefFor ? hrefFor(l.value) : undefined,
  }));
}
