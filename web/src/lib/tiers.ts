import type { Metric } from '@preco-real/ui';
import type { TypologyKey, Zone } from './data';
import { typologyRecord } from './data';

export function metricValue(z: Zone, metric: Metric, t: TypologyKey): number | null {
  const r = typologyRecord(z, t);
  return metric === 'price' ? r.median : metric === 'change' ? r.yoy : r.excess;
}

/** Limites dos 5 tons: quantis para preço e variação; fixos (10/20/35/50%) para o excesso. */
export function thresholds(values: number[], metric: Metric): number[] {
  if (metric === 'excess') return [0.1, 0.2, 0.35, 0.5];
  const v = [...values].sort((a, b) => a - b);
  if (!v.length) return [0, 0, 0, 0];
  return [0.2, 0.4, 0.6, 0.8].map((p) => v[Math.min(v.length - 1, Math.floor(p * v.length))]);
}

/** 0 = sem dados; 1..5 = do mais baixo ao mais alto. */
export function tierOf(value: number | null, th: number[]): number {
  if (value == null) return 0;
  let t = 1;
  for (const x of th) if (value > x) t++;
  return t;
}
