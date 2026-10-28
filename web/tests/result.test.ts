import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildResult, DEFAULT_USER_PARAMS } from '../src/lib/result';
import type { Meta, Zone } from '../src/lib/data';
import { searchZones } from '../src/lib/search';
import { thresholds, tierOf } from '../src/lib/tiers';

const dir = resolve(__dirname, '../public/data');
const has = existsSync(resolve(dir, 'zonas.json'));
const read = <T>(f: string): T => JSON.parse(readFileSync(resolve(dir, f), 'utf8'));

describe.skipIf(!has)('resultado da calculadora (dados reais gerados)', () => {
  const meta = has ? read<Meta>('meta.json') : ({} as Meta);
  const zones = has ? read<Zone[]>('zonas.json') : [];
  const by = (n: string) => zones.find((z) => z.name === n)!;
  const base = { typology: 'T2' as const, area: 80, condition: 'good' as const, age: '9_15' as const, light: true };

  it('compra em Lisboa: excesso coerente com o modelo e linhas completas', () => {
    const r = buildResult({ ...base, mode: 'buy', zone: by('Lisboa'), asking: 440000 }, meta, DEFAULT_USER_PARAMS, by('Portugal'))!;
    expect(r.verdict).toBe('disproportionate');
    expect(r.rows).toHaveLength(4);
    expect(r.breakdown).toHaveLength(6);
    expect(r.efforts).toHaveLength(2);
    expect(r.position).toBeGreaterThan(50);
  });
  it('parâmetros do utilizador mudam o resultado', () => {
    const a = buildResult({ ...base, mode: 'buy', zone: by('Lisboa'), asking: 300000 }, meta, DEFAULT_USER_PARAMS, null)!;
    const b = buildResult({ ...base, mode: 'buy', zone: by('Lisboa'), asking: 300000 }, meta, { ...DEFAULT_USER_PARAMS, effort: 40 }, null)!;
    expect(b.rows[1].value.num).toBeGreaterThan(a.rows[1].value.num);
  });
  it('renda: devolve resultado com rendimento necessário', () => {
    const r = buildResult({ ...base, mode: 'rent', typology: 'T0', area: 35, zone: by('Lisboa'), asking: 800 }, meta, DEFAULT_USER_PARAMS, null)!;
    expect(r.rows[3].value.num).toBeCloseTo(800 / 0.3, 0);
    expect(r.efforts).toHaveLength(1);
  });
  it('zona sem mediana (suprimida): sem resultado inventado', () => {
    const corvo = zones.find((z) => z.typologies[0].gap === 'suppressed')!;
    const r = buildResult({ ...base, mode: 'buy', zone: corvo, asking: 100000 }, meta, DEFAULT_USER_PARAMS, null);
    expect(r).toBeNull();
  });
});

describe('pesquisa e tons', () => {
  it('pesquisa sem acentos e por prefixo', () => {
    const data: any = { concelhos: [{ code: '1', name: 'Évora', level: 'concelho' }, { code: '2', name: 'Elvas', level: 'concelho' }], freguesias: [], byCode: new Map() };
    expect(searchZones(data, 'evo')[0].zone.name).toBe('Évora');
    expect(searchZones(data, 'e')).toEqual([]);
  });
  it('tons: 5 quantis; excesso com limiares fixos', () => {
    const v = Array.from({ length: 100 }, (_, i) => i);
    const th = thresholds(v, 'price');
    expect([tierOf(0, th), tierOf(50, th), tierOf(99, th), tierOf(null, th)]).toEqual([1, 3, 5, 0]);
    expect([0, 0.1, 0.15, 0.3, 0.45, 0.9].map((x) => tierOf(x, thresholds([], 'excess')))).toEqual([1, 1, 2, 3, 4, 5]);
  });
});
