import { Badge, BreakdownList, Button, Callout, EmptyState, MethodologySection, SectionTabs, SourceNote, Text, TypologyTable } from '@preco-real/ui';
import { hrefTo } from '../lib/paths';
import type { Msg, NavItem, TableRow } from '@preco-real/ui';
import { CONDITION_COEF, DEFAULT_PARAMS, NO_LIGHT_COEF, SIZE_BOUNDS, SIZE_EXPONENT } from '@preco-real/model';
import type { Route } from '../lib/router';

const times = (v: number, d = 2): Msg => ({ k: 'fmt.times', p: { v: { num: v, d } } });
const pct = (n: number, d = 0): Msg => ({ num: n, f: 'pct', d });

export function MethodologyPage({ route, compact }: { route: Route; compact: boolean }) {
  const P = DEFAULT_PARAMS;
  const how = [
    { label: 'meth.how.s1', note: 'meth.how.s1.n', value: 'S1' },
    { label: 'meth.how.s2', note: 'meth.how.s2.n', value: 'S2' },
    { label: 'meth.how.s3', note: 'meth.how.s3.n', value: '(S1+S2)/2' },
    { label: 'meth.how.s4', note: 'meth.how.s4.n', value: 'PR', kind: 'result' as const },
  ];
  const defs: TableRow[] = [
    { label: 'meth.def.effort', value: pct(P.effort * 100) },
    { label: 'meth.def.rate', value: pct(P.rate * 100, 1) },
    { label: 'meth.def.term', value: { k: 'params.years', p: { n: P.termYears } } },
    { label: 'meth.def.ltv', value: pct(P.ltv * 100) },
    { label: 'meth.def.sigma', value: { k: 'br.correction.n2', p: { v: { num: 1 + P.sigma, d: 2 } } } },
    { label: 'meth.def.profile', value: 'meth.def.profileV' },
  ];
  const cons: TableRow[] = (['excellent', 'good', 'fair', 'poor', 'bad'] as const).map((k) => ({ label: `cond.${k}`, value: times(CONDITION_COEF[k], 1) }));
  const hyp: TableRow[] = [
    { label: 'meth.hyp.window', value: times(NO_LIGHT_COEF) },
    { label: 'meth.hyp.ruin', value: 'meth.hyp.ruinV' },
    { label: 'meth.hyp.size', value: `(A/Aref)^${SIZE_EXPONENT} [${SIZE_BOUNDS.join('; ')}]` },
    { label: 'meth.hyp.quality', value: 'meth.hyp.qualityV' },
  ];
  const ex: TableRow[] = ['fair', 'above', 'inflated', 'disp'].map((k) => ({ label: `meth.ex.${k}`, value: `meth.ex.${k}V` }));
  const nav: NavItem[] = [];
  void nav;
  const sources = ['ine', 'bdp', 'eu', 'at', 'law', 'rent', 'dgt'].map((s) => `meth.src.${s}`);
  const limits = [1, 2, 3, 4].map((n) => `meth.lim.${n}`);
  const tabs = [
    { id: 'calculo', label: 'common.howWeCalculate' }, { id: 'coef', label: 'meth.coef.short' },
    { id: 'excesso', label: 'meth.ex.title' }, { id: 'fontes', label: 'meth.src.short' }, { id: 'limites', label: 'meth.lim.title' },
  ].map((t) => ({ ...t, href: `#${t.id}` }));
  const list = (keys: string[]) => <ul>{keys.map((k) => <li key={k}><Text as="span">{k}</Text></li>)}</ul>;

  if (compact) {
    return (
      <main>
        <div className="pr-stack" id="oque">
          <Text variant="display-md" as="h1">meth.title</Text>
          <Callout tone="info" title="meth.what.title">meth.what.short</Callout>
        </div>
        <SectionTabs items={tabs} />
        <div className="pr-stack">
          <MethodologySection id="calculo" title="common.howWeCalculate" collapsible open>
            <BreakdownList items={how} />
            <TypologyTable title="meth.def.table" rows={defs} />
          </MethodologySection>
          <MethodologySection id="coef" title="meth.coef.short" collapsible>
            <TypologyTable title="meth.coef.consShort" rows={cons} />
            <Text variant="small" tone="secondary">meth.coef.ageShort</Text>
            <Badge tone="support">common.hypothesis</Badge>
            <TypologyTable title="meth.hyp.table" rows={hyp} />
          </MethodologySection>
          <MethodologySection id="excesso" title="meth.ex.title" collapsible>
            <TypologyTable title="meth.ex.table" rows={ex} />
            <Text variant="small" tone="secondary">meth.ex.note</Text>
          </MethodologySection>
          <MethodologySection id="fontes" title="meth.src.short" collapsible>{list(sources)}</MethodologySection>
          <MethodologySection id="limites" title="meth.lim.title" collapsible>{list(limits)}</MethodologySection>
          <SourceNote>meth.draft</SourceNote>
        </div>
      </main>
    );
  }
  return (
    <main className="pr-prose">
      <Text variant="display-lg" as="h1">meth.title</Text>
      <Callout tone="info" title="meth.what.title">meth.what.body</Callout>
      <MethodologySection id="layers" title="meth.layers.title">
        <Text>meth.layers.effort</Text>
        <Text>meth.layers.ref</Text>
      </MethodologySection>
      <MethodologySection id="how" title="meth.how.title"><BreakdownList items={how} /></MethodologySection>
      <MethodologySection id="def" title="meth.def.title"><TypologyTable title="meth.def.table" rows={defs} /></MethodologySection>
      <MethodologySection id="coef" title="meth.coef.title">
        <TypologyTable title="meth.coef.cons" rows={cons} />
        <Text variant="small" tone="secondary">meth.coef.age</Text>
      </MethodologySection>
      <MethodologySection id="hyp" title="meth.hyp.title">
        <Badge tone="support">common.hypothesis</Badge>
        <Text>meth.hyp.body</Text>
        <TypologyTable title="meth.hyp.table" rows={hyp} />
      </MethodologySection>
      <MethodologySection id="ex" title="meth.ex.title">
        <TypologyTable title="meth.ex.table" rows={ex} />
        <Text variant="small" tone="secondary">meth.ex.note</Text>
      </MethodologySection>
      <MethodologySection id="src" title="meth.src.title">{list(sources)}</MethodologySection>
      <MethodologySection id="lim" title="meth.lim.title">{list(limits)}</MethodologySection>
      <SourceNote>meth.draft</SourceNote>
    </main>
  );
}

export function PrivacyPage({ compact }: { compact: boolean }) {
  const sections = [
    { id: 'calc', title: 'priv.calc.title', body: 'priv.calc.body', open: true },
    { id: 'nao', title: 'priv.not.title', body: 'priv.not.body' },
    { id: 'med', title: 'priv.meas.title', body: 'priv.meas.body' },
    { id: 'dir', title: 'priv.rights.title', body: 'priv.rights.body' },
  ];
  return (
    <main className={compact ? 'pr-stack' : 'pr-prose'}>
      <Text variant={compact ? 'display-md' : 'display-lg'} as="h1">priv.title</Text>
      <Callout tone="info" title="priv.sum.title">priv.sum.body</Callout>
      {sections.map((s) => (
        <MethodologySection key={s.id} id={s.id} title={s.title} collapsible={compact} open={compact ? s.open : undefined}>
          <Text>{s.body}</Text>
        </MethodologySection>
      ))}
      <SourceNote>priv.draft</SourceNote>
    </main>
  );
}

export function NotFoundPage({ route }: { route: Route }) {
  return (
    <main className="pr-prose">
      <EmptyState icon="search" title="nf.title" actionLabel="nf.back" actionVariant="primary" actionHref={hrefTo(route.locale, '/')}>nf.body</EmptyState>
      <Button variant="secondary" href={hrefTo(route.locale, '/calculadora')}>nf.calc</Button>
    </main>
  );
}
