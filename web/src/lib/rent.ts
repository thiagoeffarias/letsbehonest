import { DEFAULT_PARAMS, REFERENCE_AREA, householdIncome, verdictFor } from '@preco-real/model';
import type { Verdict } from '@preco-real/model';
import type { Meta, TypologyKey, Zone } from './data';

export interface RentZone {
  /** Renda mediana de novos contratos da zona, €/m² por mês (INE). */
  market: number;
  /** Renda que o rendimento do agregado suporta (30% de esforço), €/m² para a tipologia. */
  accessible: number;
  /** Menor dos dois. */
  reference: number;
  /** market ÷ reference − 1 */
  excess: number;
  verdict: Verdict;
}

/** Renda por m² da zona face ao que o rendimento local suporta (casal por defeito). `null` se o INE não publica. */
export function rentZone(z: Zone, typology: TypologyKey, meta: Meta): RentZone | null {
  if (z.rentPerM2 == null || z.incomeGross == null) return null;
  const y = householdIncome({ medianGross: z.incomeGross, update: meta.incomeUpdate }, DEFAULT_PARAMS);
  const area = REFERENCE_AREA[typology === 'all' ? 'T2' : typology];
  const accessible = (DEFAULT_PARAMS.effort * y) / area;
  const reference = Math.min(z.rentPerM2, accessible);
  const excess = z.rentPerM2 / reference - 1;
  return { market: z.rentPerM2, accessible, reference, excess, verdict: verdictFor(excess) };
}
