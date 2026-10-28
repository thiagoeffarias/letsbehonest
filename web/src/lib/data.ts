import { useEffect, useState } from 'react';
import type { Typology } from '@preco-real/model';

export type TypologyKey = Typology | 'all';
export type VerdictKey = 'below' | 'fair' | 'above' | 'inflated' | 'disproportionate';

export interface TypologyRecord {
  typology: TypologyKey;
  median: number | null;
  yoy: number | null;
  reference: number | null;
  referenceLow: number | null;
  referenceHigh: number | null;
  excess: number | null;
  verdict: VerdictKey | null;
  gap: null | 'suppressed' | 'low-sample' | 'no-income';
}

export interface Zone {
  code: string;
  level: 'concelho' | 'freguesia';
  name: string;
  parent: string | null;
  rentPerM2: number | null;
  incomeGross: number | null;
  typologies: TypologyRecord[];
}

export interface Meta {
  modelVersion: string;
  period: string;
  incomeYear: number;
  rentYear: number;
  incomeUpdate: number;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: { type: 'Feature'; properties: Record<string, any>; geometry: any }[];
}

export interface Dataset {
  meta: Meta;
  concelhos: Zone[];
  freguesias: Zone[];
  concelhosGeo: FeatureCollection;
  freguesiasGeo: FeatureCollection;
  byCode: Map<string, Zone>;
}

const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
const get = async <T,>(f: string): Promise<T> => {
  const r = await fetch(`${base}/data/${f}`);
  if (!r.ok) throw new Error(`${f}: ${r.status}`);
  return r.json();
};

let cache: Promise<Dataset> | null = null;
export function loadDataset(): Promise<Dataset> {
  cache ??= Promise.all([
    get<Meta>('meta.json'), get<Zone[]>('zonas.json'), get<Zone[]>('freguesias.json'),
    get<FeatureCollection>('concelhos.geojson'), get<FeatureCollection>('freguesias.geojson'),
  ]).then(([meta, concelhos, freguesias, concelhosGeo, freguesiasGeo]) => ({
    meta, concelhos, freguesias, concelhosGeo, freguesiasGeo,
    byCode: new Map([...concelhos, ...freguesias].map((z) => [z.code, z])),
  }));
  cache.catch(() => { cache = null; });
  return cache;
}

export type DataState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: Dataset };

export function useDataset(): DataState {
  const [state, setState] = useState<DataState>({ status: 'loading' });
  useEffect(() => {
    let live = true;
    loadDataset().then((data) => live && setState({ status: 'ready', data }), () => live && setState({ status: 'error' }));
    return () => { live = false; };
  }, []);
  return state;
}

export const typologyRecord = (z: Zone, t: TypologyKey): TypologyRecord =>
  z.typologies.find((x) => x.typology === t) ?? z.typologies[0];

/** "2.º Trimestre de 2026" → { q: 2, y: 2026 } para a chave period.quarter. */
export function periodParts(period: string): { q: number; y: number } {
  const m = period.match(/(\d)\.º.*?(\d{4})/);
  return { q: m ? Number(m[1]) : 0, y: m ? Number(m[2]) : 0 };
}
