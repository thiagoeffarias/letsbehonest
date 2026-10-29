import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Meta, Zone } from '../src/lib/data';
import { rentZone } from '../src/lib/rent';
import { metricValue } from '../src/lib/tiers';

const dir = resolve(__dirname, '../public/data');
const has = existsSync(resolve(dir, 'zonas.json'));
const read = <T>(f: string): T => JSON.parse(readFileSync(resolve(dir, f), 'utf8'));

describe.skipIf(!has)('mapa de rendas', () => {
  const meta = has ? read<Meta>('meta.json') : ({} as Meta);
  const zones = has ? read<Zone[]>('zonas.json') : [];
  const by = (n: string) => zones.find((z) => z.name === n)!;

  it('a renda de referência é o menor entre a mediana de renda e a renda suportável (casal, 30%)', () => {
    const r = rentZone(by('Lisboa'), 'T2', meta)!;
    expect(r.reference).toBeCloseTo(Math.min(r.market, r.accessible), 10);
    expect(r.excess).toBeCloseTo(r.market / r.reference - 1, 10);
    expect(r.market).toBe(by('Lisboa').rentPerM2);
  });
  it('tipologias maiores suportam menos €/m² (a mesma renda dividida por mais área)', () => {
    const t0 = rentZone(by('Lisboa'), 'T0', meta)!.accessible;
    const t4 = rentZone(by('Lisboa'), 'T4+', meta)!.accessible;
    expect(t0).toBeGreaterThan(t4);
  });
  it('métrica de renda: preço = mediana de renda; excesso = excesso; nunca é negativo', () => {
    const z = by('Porto');
    expect(metricValue(z, 'price', 'T2', meta)).toBe(z.rentPerM2);
    expect(metricValue(z, 'excess', 'T2', meta)!).toBeGreaterThanOrEqual(0);
    expect(metricValue(z, 'price', 'T2')).toBe(z.typologies[0].median); // sem `rent`: preço de venda
  });
  it('sem renda publicada: sem valor (sem inventar)', () => {
    const sem = zones.find((z) => z.rentPerM2 == null);
    if (sem) expect(rentZone(sem, 'T2', meta)).toBeNull();
  });
});
