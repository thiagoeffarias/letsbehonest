import { describe, expect, it } from 'vitest';
import { buildZones } from '../src/build-zones.ts';

// Dados sintéticos só para testar a lógica de junção; não representam preços reais.
const zones = [
  { code: 'PT', level: 'concelho' as const, name: 'Teste País', parent: null },
  { code: '9999', level: 'concelho' as const, name: 'Teste Concelho', parent: 'PT' },
  { code: '888801', level: 'freguesia' as const, name: 'Teste Freguesia', parent: '9999' },
];
const row = (code: string, median: number | null, transactions: number | null) => ({
  code, level: 'concelho' as const, typology: 'all' as const, median, yoy: 0.1, transactions, period: 'teste',
});
const opts = { incomeUpdate: 1.174, minTransactions: 30 };

describe('buildZones', () => {
  it('aplica o modelo e herda o rendimento do nível acima', () => {
    const out = buildZones(zones, [row('888801', 3000, 100)], [{ code: '9999', medianGross: 12000, year: 2023 }], opts);
    const all = out[2].typologies.find((t) => t.typology === 'all')!;
    expect(all.gap).toBeNull();
    expect(all.inheritedFrom).toBe('9999');
    expect(all.reference).toBeGreaterThan(0);
    expect(all.excess).toBeCloseTo(3000 / all.reference! - 1, 10);
    expect(all.referenceLow! <= all.reference! || all.referenceHigh! >= all.reference!).toBe(true);
  });
  it('marca valores suprimidos e amostra pequena em vez de inventar números', () => {
    const out = buildZones(zones, [row('9999', null, null), row('888801', 3000, 5)], [{ code: 'PT', medianGross: 12000, year: 2023 }], opts);
    expect(out[1].typologies.find((t) => t.typology === 'all')!.gap).toBe('suppressed');
    expect(out[2].typologies.find((t) => t.typology === 'all')!.gap).toBe('low-sample');
    expect(out[2].typologies.find((t) => t.typology === 'T2')!.reference).toBeNull();
  });
  it('sem rendimento em nenhum nível: no-income', () => {
    const out = buildZones(zones, [row('9999', 3000, 100)], [], opts);
    expect(out[1].typologies.find((t) => t.typology === 'all')!.gap).toBe('no-income');
  });
});
