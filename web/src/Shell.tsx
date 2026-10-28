import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Footer, Header, I18nProvider, htmlLang, localePath } from '@preco-real/ui';
import type { Locale } from '@preco-real/ui';
import { navigate } from './lib/router';
import { BASE, hrefTo } from './lib/paths';
import type { Route } from './lib/router';

export function useCompact(): boolean {
  const q = '(max-width: 767px)';
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return m;
}

const PAGES = [
  { label: 'nav.map', page: '/' },
  { label: 'nav.calculator', page: '/calculadora' },
  { label: 'nav.methodology', page: '/metodologia' },
];

/** Localização do documento: lang, título e alternativas hreflang. */
function useDocumentMeta(route: Route, titleKey: string, t: (k: string) => string) {
  useEffect(() => {
    document.documentElement.lang = htmlLang(route.locale);
    document.title = `${t(titleKey)} · Preço Real`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('footer.mission'));
    document.querySelectorAll('link[data-alt]').forEach((n) => n.remove());
    for (const loc of ['pt_pt', 'en'] as Locale[]) {
      const l = document.createElement('link');
      l.rel = 'alternate'; l.hreflang = htmlLang(loc); l.href = new URL(BASE + localePath(loc, route.path), window.location.origin).href;
      l.dataset.alt = '1';
      document.head.appendChild(l);
    }
  }, [route.path, route.locale, titleKey]);
}

export interface ShellProps {
  route: Route;
  /** stringKey do título do separador. */
  titleKey: string;
  compact: boolean;
  /** Mapa em ecrã inteiro (mobile): sem rodapé. */
  app?: boolean;
  children: ReactNode;
  t: (k: string) => string;
}

function Inner(props: ShellProps) {
  const { route, compact } = props;
  const lp = (page: string) => hrefTo(route.locale, page);
  useDocumentMeta(route, props.titleKey, props.t);
  const nav = PAGES.map((p) => ({ label: p.label, href: lp(p.page), current: p.page === route.page }));
  const footer = {
    mapHref: lp('/'), calcHref: lp('/calculadora'), methodHref: lp('/metodologia'), privacyHref: lp('/privacidade'), brandHref: lp('/'),
  };
  return (
    <div className={'pr-page' + (props.app ? ' pr-page--app' : '')} style={props.app ? { height: '100dvh' } : { minHeight: '100dvh' }}>
      <Header nav={nav} compact={compact} brandHref={lp('/')} menuHref={lp('/menu')} />
      {props.children}
      {props.app ? null : <Footer compact={compact} {...footer} />}
    </div>
  );
}

/** Fornece idioma, hrefs e navegação ao seletor, e monta a moldura da página. */
export function Shell(props: Omit<ShellProps, 't'>) {
  const { route } = props;
  const rel = (l: Locale) => localePath(l, route.path) + (route.search.toString() ? '?' + route.search.toString() : '');
  return (
    <I18nProvider locale={route.locale} localeHref={(l) => BASE + rel(l)} onLocaleChange={(l) => navigate(rel(l))}>
      <TranslatedShell {...props} />
    </I18nProvider>
  );
}

import { useI18n } from '@preco-real/ui';
function TranslatedShell(props: Omit<ShellProps, 't'>) {
  const { t } = useI18n();
  return <Inner {...props} t={t} />;
}
