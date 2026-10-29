// @vitest-environment jsdom
import { act, createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Checkbox, EffortMeter, Footer, Switch, Header, I18nProvider, MESSAGES, Select, TextInput, VerdictCard, ZonePanel } from '../src';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function mount(el: any) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(h(I18nProvider, {}, el)));
  return host;
}
function type(input: HTMLInputElement | HTMLSelectElement, value: string) {
  const proto = input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(input, value);
  act(() => { input.dispatchEvent(new Event(input instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true })); });
}

describe('onChange recebe o valor, não o evento', () => {
  it('TextInput', () => {
    const got: unknown[] = [];
    const host = mount(h(TextInput, { value: '', onChange: (v: string) => got.push(v) }));
    type(host.querySelector('input')!, '80');
    expect(got).toEqual(['80']);
  });
  it('Select', () => {
    const got: unknown[] = [];
    const host = mount(h(Select, { options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }], value: 'a', onChange: (v: string) => got.push(v) }));
    type(host.querySelector('select')!, 'b');
    expect(got).toEqual(['b']);
  });
  it('Checkbox', () => {
    const got: unknown[] = [];
    const host = mount(h(Checkbox, { checked: false, onChange: (c: boolean) => got.push(c) }, 'x'));
    act(() => { host.querySelector('input')!.click(); });
    expect(got).toEqual([true]);
  });
});

describe('Switch', () => {
  it('alterna e comunica o estado (role=switch, aria-checked)', () => {
    const got: boolean[] = [];
    const host = mount(h(Switch, { checked: false, onChange: (v: boolean) => got.push(v) }, 'calc.profile'));
    const btn = host.querySelector('button[role="switch"]') as HTMLButtonElement;
    expect(btn.getAttribute('aria-checked')).toBe('false');
    act(() => { btn.click(); });
    expect(got).toEqual([true]);
  });
});

describe('selo "de exemplo" opcional', () => {
  const html = (el: any) => renderToStaticMarkup(h(I18nProvider, {}, el));
  it('ZonePanel: por defeito mostra o selo; badge=false esconde-o', () => {
    const props = { zone: 'Lisboa', value: 1, reference: 1, excess: 'x' };
    expect(html(h(ZonePanel, props))).toContain(MESSAGES.pt_pt['common.sampleData']);
    expect(html(h(ZonePanel, { ...props, badge: false }))).not.toContain(MESSAGES.pt_pt['common.sampleData']);
  });
  it('VerdictCard: idem para "Exemplo de resultado"', () => {
    expect(html(h(VerdictCard, { verdict: 'fair' }))).toContain(MESSAGES.pt_pt['common.exampleResult']);
    expect(html(h(VerdictCard, { verdict: 'fair', badge: false }))).not.toContain(MESSAGES.pt_pt['common.exampleResult']);
  });
});

describe('catálogo sem factos fixos', () => {
  const bad = /apartamentos|apartments|Baixo Alentejo|(\d\.º trim\.|\bQ\d) ?20\d\d/;
  for (const loc of ['pt_pt', 'en'] as const) {
    it(`${loc}: sem período, região nem "apartamentos" escritos no texto`, () => {
      const offenders = Object.entries(MESSAGES[loc]).filter(([, v]) => bad.test(v)).map(([k]) => k);
      expect(offenders).toEqual([]);
    });
  }
});

describe('nome do site', () => {
  const html = (locale: 'pt_pt' | 'en') => renderToStaticMarkup(h(I18nProvider, { locale }, h(Header, {}), h(Footer, {})));
  it('Header e Footer usam o nome traduzido e já não "Preço Real"', () => {
    expect(html('pt_pt')).toContain('Vamos ser');
    expect(html('pt_pt')).toContain('honestos');
    expect(html('en')).toContain('Let&#x27;s be');
    expect(html('en')).toContain('honest');
    expect(html('pt_pt')).not.toContain('Preço');
  });
});

describe('EffortMeter', () => {
  const html = renderToStaticMarkup(h(I18nProvider, {}, h(EffortMeter, { value: 40, reference: 30, cap: 45, label: 'eff.couple', sublabel: 'params.couple' })));
  it('cada legenda fica ancorada ao seu traço (a da referência termina nele, a do teto começa nele)', () => {
    expect(html).toContain('right:70%');
    expect(html).toContain('left:45%');
  });
  it('o perfil vai numa linha secundária e não entre parênteses no título', () => {
    expect(html).toContain('pr-effort__title');
    expect(html).toContain(MESSAGES.pt_pt['params.couple']);
    expect(html).not.toContain('(' + MESSAGES.pt_pt['params.couple']);
  });
});
