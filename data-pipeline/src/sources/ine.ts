import type { IncomeRow, MedianRow, RentRow } from '../schema.ts';

/** Linha do JSON do INE (`pindica.jsp?op=2`). `valor` ausente = suprimido (`sinal_conv`). */
interface IneRow {
  geocod: string;
  geodsg: string;
  valor?: string;
  dim_3_t?: string;
}
interface IneIndicator {
  IndicadorCod: string;
  UltimoPref: string;
  DataUltimoAtualizacao: string;
  Dados: Record<string, IneRow[]>;
}

export function parseIndicator(raw: unknown): IneIndicator {
  const x = (raw as IneIndicator[])[0];
  if (!x || !x.Dados) throw new Error('Resposta do INE sem "Dados" (falha transitória? repetir o descarregamento)');
  return x;
}

/** O INE codifica o concelho como NUTS III (3 carateres) + DICO (4); o país é "PT". */
export function zoneCode(geocod: string): { code: string; level: 'pais' | 'concelho' | 'freguesia' } | null {
  if (geocod === 'PT') return { code: 'PT', level: 'pais' };
  if (geocod.length === 7) return { code: geocod.slice(3), level: 'concelho' };
  if (geocod.length === 9) return { code: geocod.slice(3), level: 'freguesia' }; // DICOFRE (6 dígitos)
  return null;
}

const num = (v: string | undefined) => (v == null || v === '' ? null : Number(v));

/** Mediana de venda (últimos 12 meses), €/m², categoria "Total", concelhos e país. */
export function parseMedians(raw: unknown, period: string, category = 'Total'): MedianRow[] {
  const ind = parseIndicator(raw);
  const prev = ind.Dados[previousYear(period)] ?? [];
  const prevByCode = new Map(prev.filter((r) => r.dim_3_t === category).map((r) => [r.geocod, num(r.valor)]));
  const out: MedianRow[] = [];
  for (const r of ind.Dados[period] ?? []) {
    if (r.dim_3_t !== category) continue;
    const z = zoneCode(r.geocod);
    if (!z) continue;
    const median = num(r.valor);
    const before = prevByCode.get(r.geocod) ?? null;
    out.push({
      code: z.code, level: z.level === 'freguesia' ? 'freguesia' : 'concelho', typology: 'all', median,
      yoy: median != null && before ? median / before - 1 : null,
      transactions: null, period,
    });
  }
  return out;
}

/** "2.º Trimestre de 2026" → "2.º Trimestre de 2025". */
export function previousYear(period: string): string {
  return period.replace(/(\d{4})$/, (y) => String(Number(y) - 1));
}

export function parseIncome(raw: unknown): { rows: IncomeRow[]; year: number } {
  const ind = parseIndicator(raw);
  const year = Number(ind.UltimoPref);
  const rows: IncomeRow[] = [];
  for (const r of ind.Dados[String(year)] ?? []) {
    const z = zoneCode(r.geocod);
    const v = num(r.valor);
    if (z && v != null) rows.push({ code: z.code, medianGross: v, year });
  }
  return { rows, year };
}

/** Renda mediana de novos contratos, €/m² (anual). */
export function parseRents(raw: unknown): { rows: RentRow[]; year: number } {
  const ind = parseIndicator(raw);
  const year = Number(ind.UltimoPref);
  const rows: RentRow[] = [];
  for (const r of ind.Dados[String(year)] ?? []) {
    const z = zoneCode(r.geocod);
    const v = num(r.valor);
    if (z && v != null) rows.push({ code: z.code, perM2: v, year });
  }
  return { rows, year };
}
