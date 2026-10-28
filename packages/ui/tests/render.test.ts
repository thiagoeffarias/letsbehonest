import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as UI from '../src';
import { LOCALES, MESSAGES } from '../src';

const nav = [{ label: 'nav.map', href: '/', current: true }, { label: 'nav.calculator', href: '/calculadora' }];
const opts = [{ value: 'a', label: 'typology.label' }, { value: 'b', label: 'common.edit' }];
const rows = [{ label: 'cond.good', value: { num: 5192, f: 'eurM2' as const } }];
const breakdown = [{ label: 'br.base', note: 'br.base.n', value: { num: 4100, f: 'eurM2' as const } }, { label: 'br.ref', value: { num: 3900, f: 'eurM2' as const }, kind: 'result' as const }];

// props mínimas por componente; o resto vem por defeito
const cases: Record<string, any> = {
  Icon: { name: 'search' },
  Text: { children: 'common.edit' },
  Button: { children: 'common.compareAd', icon: 'search' },
  Chip: { children: 'common.edit', selected: true },
  Badge: { children: 'common.sampleData' },
  Label: { children: 'calc.zone', hint: 'calc.area.hint' },
  TextInput: { placeholder: 'calc.zone.placeholder' },
  Select: { options: opts },
  Checkbox: { children: 'calc.light' },
  Divider: {},
  Tooltip: { content: 'common.edit', open: true, children: 'x' },
  FormField: { label: 'calc.zone', hint: 'calc.area.hint', error: 'calc.error.zone', children: 'x' },
  SearchField: {},
  TypologyFilter: { value: 'T2' },
  MetricTabs: { value: 'price' },
  LegendScale: { metric: 'excess' },
  StatBlock: { label: 'zone.median', value: { num: 5192, f: 'eurM2' } },
  ChoiceGroup: { options: opts, label: 'lang.label' },
  SuggestionList: { items: [{ label: 'Lisboa', kind: 'zonekind.municipality' }], query: 'Lis' },
  EmptyState: { title: 'nf.title', body: 'nf.body', actionLabel: 'common.compareAd' },
  Callout: { tone: 'warning', title: 'calc.about.title', children: 'calc.about.body' },
  EffortMeter: { value: 38 },
  BreakdownList: { items: breakdown },
  Accordion: { title: 'result.how', children: 'x' },
  SectionTabs: { items: [{ id: 'a', label: 'result.how' }] },
  InputSummary: { items: ['Lisboa', 'T2', { num: 80, f: 'm2' }] },
  VerdictBanner: { verdict: 'inflated', title: { num: 24, f: 'pct' } },
  RangeBar: { position: 70 },
  TypologyTable: { rows },
  SourceNote: { children: 'footer.version' },
  LanguageSwitcher: {},
  Header: { nav },
  MapControls: {},
  MapToolbar: {},
  MapCanvas: {},
  ZonePanel: { zone: 'Lisboa', kind: 'zonekind.municipality', value: { num: 5192, f: 'eurM2' }, reference: { num: 3900, f: 'eurM2' }, excess: 'x' },
  BottomSheet: { children: 'x' },
  CalculatorForm: {},
  VerdictCard: { verdict: 'above', rows, efforts: [{ value: 40 }], breakdown },
  ParameterPanel: {},
  Footer: {},
  MobileMenu: { nav },
  MethodologySection: { title: 'meth.title', children: 'x' },
};

const components = Object.entries(UI).filter(([k, v]) => /^[A-Z]/.test(k) && typeof v === 'function' && !['I18nProvider', 'I18n'].includes(k));

describe('componentes', () => {
  it('cada componente exportado tem um caso de teste', () => {
    expect(components.map(([k]) => k).sort()).toEqual(Object.keys(cases).sort());
  });
  for (const [name, Comp] of components) {
    for (const l of LOCALES) {
      it(`${name} renderiza em ${l.value} sem chaves em falta nem chaves cruas`, () => {
        const html = renderToStaticMarkup(h(UI.I18nProvider, { locale: l.value }, h(Comp as any, cases[name])));
        expect(html).not.toContain('⟦');
        // nenhuma stringKey do catálogo pode aparecer crua no HTML
        const text = html.replace(/<[^>]*>/g, ' ');
        const leaked = (text.match(/\b[a-z][a-zA-Z0-9_]*(?:\.[a-zA-Z0-9_]+)+\b/g) || []).filter((k) => k in MESSAGES.pt_pt);
        expect(leaked).toEqual([]);
      });
    }
  }
  it('o seletor de idioma lista todos os idiomas registados', () => {
    const html = renderToStaticMarkup(h(UI.I18nProvider, { locale: 'en' }, h(UI.LanguageSwitcher, { open: true })));
    for (const l of LOCALES) expect(html.toLowerCase()).toContain(`hreflang="${l.tag.toLowerCase()}"`);
  });
});
