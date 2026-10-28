// @vitest-environment jsdom
import { act, createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Checkbox, I18nProvider, MESSAGES, Select, TextInput, VerdictCard, ZonePanel } from '../src';

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
