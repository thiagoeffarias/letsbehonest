import { MobileMenu, I18nProvider, localePath } from '@preco-real/ui';
import { hrefTo } from './lib/paths';
import { useRoute } from './lib/router';
import { Shell, useCompact } from './Shell';
import { MapPage } from './pages/MapPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { MethodologyPage, NotFoundPage, PrivacyPage } from './pages/Simple';
import { navigate } from './lib/router';

export function App() {
  const route = useRoute();
  const compact = useCompact();
  const lp = (p: string) => hrefTo(route.locale, p);

  if (route.page === '/menu' && compact) {
    const nav = [
      { label: 'nav.map', href: lp('/') }, { label: 'nav.calculator', href: lp('/calculadora') }, { label: 'nav.methodology', href: lp('/metodologia') },
    ];
    return (
      <I18nProvider locale={route.locale} localeHref={(l) => hrefTo(l, '/')} onLocaleChange={(l) => navigate(localePath(l, '/menu'))}>
        <div className="pr-page" style={{ minHeight: '100dvh' }}><MobileMenu nav={nav} brandHref={lp('/')} closeHref={lp('/')} /></div>
      </I18nProvider>
    );
  }
  const page = route.page === '/menu' ? '/' : route.page;
  const known: Record<string, { titleKey: string; node: JSX.Element; app?: boolean }> = {
    '/': { titleKey: 'nav.map', node: <MapPage route={route} compact={compact} />, app: compact },
    '/calculadora': { titleKey: 'nav.calculator', node: <CalculatorPage route={route} compact={compact} /> },
    '/metodologia': { titleKey: 'nav.methodology', node: <MethodologyPage route={route} compact={compact} /> },
    '/privacidade': { titleKey: 'nav.privacy', node: <PrivacyPage compact={compact} /> },
  };
  const hit = known[page];
  return (
    <Shell route={{ ...route, page }} titleKey={hit ? hit.titleKey : 'nf.title'} compact={compact} app={hit?.app}>
      {hit ? hit.node : <NotFoundPage route={route} />}
    </Shell>
  );
}
