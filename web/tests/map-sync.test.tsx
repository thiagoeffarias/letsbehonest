// @vitest-environment jsdom
import { act, createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const calls = vi.hoisted(() => ({ paint: [] as any[], data: [] as any[], filters: [] as any[], load: null as null | (() => void) }));
vi.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));
vi.mock('maplibre-gl', () => {
  class FakeMap {
    touchZoomRotate = { disableRotation() {} };
    constructor() {}
    on(ev: string, cb: () => void) { if (ev === 'load') calls.load = cb; }
    addSource() {} addLayer() {} remove() {} fitBounds() {} zoomIn() {} zoomOut() {}
    getSource() { return { setData: (d: any) => calls.data.push(d) }; }
    setPaintProperty(...a: any[]) { calls.paint.push(a); }
    setFilter(...a: any[]) { calls.filters.push(a); }
    getCanvas() { return { style: {} }; }
    queryRenderedFeatures() { return []; }
  }
  class LngLatBounds { extend() { return this; } }
  return { default: { Map: FakeMap, LngLatBounds } };
});

import { ChoroplethMap } from '../src/ChoroplethMap';

const feat = (code: string) => ({ type: 'Feature' as const, properties: { code, hasData: true }, geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] } });
const zone = (code: string, median: number, excess: number) => ({
  code, level: 'concelho' as const, name: code, parent: 'PT', rentPerM2: null, incomeGross: 1,
  typologies: ['all', 'T0', 'T2'].map((t) => ({ typology: t, median, yoy: 0.1, reference: 1, referenceLow: 1, referenceHigh: 1, excess: t === 'T0' ? excess / 2 : excess, verdict: 'fair', gap: null })),
});
const data: any = {
  meta: {}, freguesias: [], freguesiasGeo: { type: 'FeatureCollection', features: [] },
  concelhos: [zone('0001', 1000, 0.1), zone('0002', 3000, 0.9)],
  concelhosGeo: { type: 'FeatureCollection', features: [feat('0001'), feat('0002')] },
  byCode: new Map(),
};
for (const z of data.concelhos) data.byCode.set(z.code, z);

describe('ChoroplethMap acompanha as seleções', () => {
  beforeEach(() => {
    calls.paint.length = 0; calls.data.length = 0; calls.filters.length = 0;
    for (let i = 1; i <= 5; i++) {
      document.documentElement.style.setProperty(`--color-data-ramp-${i}`, `#00${i}`);
      document.documentElement.style.setProperty(`--color-excess-ramp-${i}`, `#aa${i}`);
    }
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  });

  it('muda as cores ao mudar a métrica e a tipologia, e o realce ao mudar a zona selecionada', () => {
    const host = document.createElement('div');
    const root = createRoot(host);
    const render = (p: any) => act(() => root.render(h(ChoroplethMap, { data, metric: 'price', typology: 'T2', selected: null, onSelect() {}, ariaLabel: 'x', ...p })));
    render({});
    act(() => { calls.load!(); });
    const lastColors = () => JSON.stringify(calls.paint.at(-1));
    expect(lastColors()).toContain('#001');
    expect(lastColors()).not.toContain('#aa1');

    render({ metric: 'excess' });
    expect(lastColors()).toContain('#aa1');           // rampa âmbar do excesso
    expect(lastColors()).not.toContain('#001');

    const before = JSON.stringify(calls.data.at(-2)); // -2 = concelhos (-1 = freguesias)
    render({ metric: 'excess', typology: 'T0' });
    expect(JSON.stringify(calls.data.at(-2))).not.toEqual(before); // tons por tipologia mudam os dados

    render({ metric: 'excess', typology: 'T0', selected: '0002' });
    expect(JSON.stringify(calls.filters.at(-1))).toContain('0002');
  });
});
