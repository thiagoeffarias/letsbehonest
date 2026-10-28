import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ZoneRecord } from '../src/schema.ts';

const dir = resolve(__dirname, '../../web/public/data');
const has = existsSync(resolve(dir, 'zonas.json')) && existsSync(resolve(dir, 'concelhos.geojson'));

// Valida o conjunto gerado a partir dos dados reais (corre depois de fetch + build).
describe.skipIf(!has)('conjunto de dados gerado', () => {
  const zones: ZoneRecord[] = has ? JSON.parse(readFileSync(resolve(dir, 'zonas.json'), 'utf8')) : [];
  const geo = has ? JSON.parse(readFileSync(resolve(dir, 'concelhos.geojson'), 'utf8')) : { features: [] };

  it('cada concelho do mapa tem registo, e vice-versa', () => {
    const a = geo.features.map((f: any) => f.properties.code).sort();
    const b = zones.filter((z) => z.code !== 'PT').map((z) => z.code).sort();
    expect(a).toEqual(b);
    expect(a.length).toBe(308);
  });
  it('referência ≤ mediana e faixa ordenada (sanidade §8)', () => {
    for (const z of zones) for (const t of z.typologies) {
      if (t.reference == null) { expect(t.gap, z.name).not.toBeNull(); continue; }
      expect(t.reference, z.name).toBeLessThanOrEqual(t.median! + 1e-6);
      expect(t.referenceLow!, z.name).toBeLessThanOrEqual(t.referenceHigh!);
      expect(t.referenceHigh!, z.name).toBeLessThanOrEqual(t.median! + 1e-6);
    }
  });
  it('lacunas só onde o INE suprime a mediana', () => {
    const gaps = zones.filter((z) => z.typologies[0].gap);
    expect(gaps.every((z) => z.typologies[0].median == null)).toBe(true);
    expect(gaps.length).toBeLessThan(10);
  });
  it('Lisboa bate com o INE (5 192 €/m²)', () => {
    expect(zones.find((z) => z.name === 'Lisboa')!.typologies[0].median).toBe(5192);
  });

  describe('freguesias', () => {
    const pf = resolve(dir, 'freguesias.json');
    const parishes: ZoneRecord[] = existsSync(pf) ? JSON.parse(readFileSync(pf, 'utf8')) : [];
    const pg = existsSync(resolve(dir, 'freguesias.geojson')) ? JSON.parse(readFileSync(resolve(dir, 'freguesias.geojson'), 'utf8')) : { features: [] };
    it('cada freguesia com dados tem polígono, e o pai é um concelho do mapa', () => {
      const poly = new Set(pg.features.map((f: any) => f.properties.code));
      const conc = new Set(zones.map((z) => z.code));
      expect(parishes.length).toBeGreaterThan(250);
      for (const p of parishes) {
        expect(poly.has(p.code), p.name).toBe(true);
        expect(conc.has(p.parent!), p.name).toBe(true);
        expect(p.typologies[0].median, p.name).not.toBeNull();
        expect(p.typologies[0].reference!, p.name).toBeLessThanOrEqual(p.typologies[0].median! + 1e-6);
      }
    });
    it('Santa Maria Maior (Lisboa) tem registo próprio', () => {
      expect(parishes.find((p) => p.code === '110665')).toBeDefined();
    });
  });
});
