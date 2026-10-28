import { REFERENCE_AREA, basePrice, verdictFor } from '@preco-real/model';
import type { Typology } from '@preco-real/model';
import type { IncomeRow, MedianRow, RentRow, ZoneMeta, ZoneRecord, ZoneTypologyRecord } from './schema.ts';

export interface BuildOptions {
  /** Atualização do rendimento entre `incomeYear` e o período do preço (ex.: 1,174). */
  incomeUpdate: number;
  /** Abaixo disto o INE não dá amostra fiável: a zona herda do nível acima. */
  minTransactions: number;
}

const TYPOLOGIES: Typology[] = ['T0', 'T1', 'T2', 'T3', 'T4+'];

function empty(typology: ZoneTypologyRecord['typology'], gap: ZoneTypologyRecord['gap'], row?: MedianRow): ZoneTypologyRecord {
  return {
    typology, median: row?.median ?? null, yoy: row?.yoy ?? null, transactions: row?.transactions ?? null,
    reference: null, referenceLow: null, referenceHigh: null, excess: null, verdict: null, gap, inheritedFrom: null,
  };
}

/**
 * Junta medianas (INE), rendimento (INE) e metadados (CAOP) e aplica o modelo.
 * O INE só publica a mediana por tipologia em níveis agregados; para as zonas sem valor
 * próprio usa-se `all` com a área de referência da tipologia pedida (ver docs).
 */
export function buildZones(
  zones: ZoneMeta[],
  medians: MedianRow[],
  incomes: IncomeRow[],
  opts: BuildOptions,
  rents: RentRow[] = [],
): ZoneRecord[] {
  const rent = new Map(rents.map((r) => [r.code, r.perM2]));
  const byZone = new Map<string, MedianRow[]>();
  for (const m of medians) byZone.set(m.code, [...(byZone.get(m.code) ?? []), m]);
  const income = new Map(incomes.map((i) => [i.code, i]));
  const meta = new Map(zones.map((z) => [z.code, z]));

  const incomeFor = (code: string): { row: IncomeRow; from: string | null } | null => {
    let cur: ZoneMeta | undefined = meta.get(code);
    let first = true;
    while (cur) {
      const r = income.get(cur.code);
      if (r) return { row: r, from: first ? null : cur.code };
      cur = cur.parent ? meta.get(cur.parent) : undefined;
      first = false;
    }
    return null;
  };

  return zones.map((z) => {
    const rows = byZone.get(z.code) ?? [];
    const typologies = (['all', ...TYPOLOGIES] as const).map((t): ZoneTypologyRecord => {
      // O INE não publica mediana por tipologia ao nível local: T0..T4+ usam a mediana 'all'
      // e diferem só na área de referência (S2).
      const row = rows.find((r) => r.typology === t) ?? rows.find((r) => r.typology === 'all');
      if (!row || row.median == null) return empty(t, 'suppressed', row);
      if (row.transactions != null && row.transactions < opts.minTransactions) return empty(t, 'low-sample', row);
      const inc = incomeFor(z.code);
      if (!inc) return empty(t, 'no-income', row);
      const ref: Typology = t === 'all' ? 'T2' : t;
      const b = basePrice({ median: row.median, income: { medianGross: inc.row.medianGross, update: opts.incomeUpdate }, typology: ref });
      // referência por m² para a área-tipo: aplica-se apenas a base (estado bom, 9–15 anos, tamanho de referência)
      const excess = row.median / b.base - 1;
      return {
        typology: t, median: row.median, yoy: row.yoy, transactions: row.transactions,
        reference: b.base, referenceLow: b.baseLow, referenceHigh: b.baseHigh,
        excess, verdict: verdictFor(excess), gap: null, inheritedFrom: inc.from,
      };
    });
    return { ...z, rentPerM2: rent.get(z.code) ?? rent.get(z.parent ?? '') ?? null, incomeGross: incomeFor(z.code)?.row.medianGross ?? null, typologies };
  });
}

export { REFERENCE_AREA };
