import type { Typology, Verdict } from '@preco-real/model';

/** Nível territorial; o código é o DICO (concelho, 4 dígitos) ou DICOFRE (freguesia, 6). */
export type Level = 'concelho' | 'freguesia';

/** Entrada normalizada: o que cada fonte (INE, CAOP) tem de produzir antes do cálculo. */
export interface MedianRow {
  code: string;
  level: Level;
  typology: Typology | 'all';
  /** Mediana de venda, €/m². `null` = suprimida pelo INE. */
  median: number | null;
  /** Variação homóloga (fração), se existir. */
  yoy: number | null;
  /** Número de transações, se publicado. */
  transactions: number | null;
  /** Período, ex.: "2026-Q2". */
  period: string;
}

export interface IncomeRow {
  code: string;
  /** Rendimento mediano declarado, bruto anual por sujeito passivo. */
  medianGross: number;
  year: number;
}

export interface RentRow {
  code: string;
  /** Renda mediana de novos contratos, €/m² por mês. */
  perM2: number;
  year: number;
}

export interface ZoneMeta {
  code: string;
  level: Level;
  name: string;
  /** Código do nível acima (concelho para freguesia, região para concelho). */
  parent: string | null;
}

/** Saída por zona e tipologia, consumida pelo mapa. */
export interface ZoneTypologyRecord {
  typology: Typology | 'all';
  median: number | null;
  yoy: number | null;
  transactions: number | null;
  /** Preço de referência €/m² para um imóvel-tipo (bom estado, 9–15 anos, área de referência). */
  reference: number | null;
  referenceLow: number | null;
  referenceHigh: number | null;
  /** median / reference − 1 */
  excess: number | null;
  verdict: Verdict | null;
  /** Motivo de não haver valores. */
  gap: null | 'suppressed' | 'low-sample' | 'no-income';
  /** Nível usado quando a zona herda de um nível acima. */
  inheritedFrom: string | null;
}

export interface ZoneRecord extends ZoneMeta {
  /** Renda mediana de novos contratos €/m² (INE, anual), se publicada. */
  rentPerM2: number | null;
  /** Rendimento mediano declarado (bruto anual, ano de `DatasetMeta.incomeYear`), próprio ou herdado. */
  incomeGross: number | null;
  typologies: ZoneTypologyRecord[];
}

export interface DatasetMeta {
  modelVersion: string;
  period: string;
  generatedAt: string;
  incomeYear: number;
  rentYear: number;
  sources: { id: string; name: string; url: string; retrievedAt: string }[];
}
