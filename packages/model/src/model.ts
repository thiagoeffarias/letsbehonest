import {
  CONDITION_COEF, DEFAULT_PARAMS, NO_LIGHT_COEF, QUALITY_BOUNDS, REFERENCE_AREA, RUIN_FLOOR, RUIN_MARKUP,
  SIZE_BOUNDS, SIZE_EXPONENT, VETUSTEZ_BASE, VETUSTEZ_BY_BUCKET,
} from './params';
import type { AgeBucket, Condition, ModelParams, Typology } from './params';

export type Verdict = 'below' | 'fair' | 'above' | 'inflated' | 'disproportionate';

const clamp = (x: number, [lo, hi]: [number, number]) => Math.min(hi, Math.max(lo, x));

/** Fator de anuidade mensal: prestação por euro emprestado. */
export function annuity(annualRate: number, years: number): number {
  const i = annualRate / 12;
  const n = years * 12;
  return i === 0 ? 1 / n : i / (1 - Math.pow(1 + i, -n));
}

export interface IncomeInput {
  /** Rendimento mediano declarado do município (bruto anual, por sujeito passivo). */
  medianGross: number;
  /** Atualização desde o ano do dado até ao trimestre do preço (ex.: 1,174). */
  update?: number;
}

/** Rendimento líquido mensal do agregado. */
export function householdIncome(i: IncomeInput, p: ModelParams = DEFAULT_PARAMS, earners: 1 | 2 = p.earners): number {
  return (earners * i.medianGross * p.netFactor * (i.update ?? 1)) / 12;
}

export interface BaseInput {
  /** Mediana INE da zona/tipologia, €/m². */
  median: number;
  income: IncomeInput;
  typology: Typology;
}

export interface BaseResult {
  s1: number;
  s2: number;
  base: number;
  /** Faixa: pesos 30/70 e 70/30 (mínimo e máximo). */
  baseLow: number;
  baseHigh: number;
  householdIncome: number;
  affordableLoan: number;
  /** true se a base foi limitada à mediana de mercado. */
  capped: boolean;
}

export function basePrice(input: BaseInput, p: ModelParams = DEFAULT_PARAMS): BaseResult {
  const s1 = input.median / (1 + p.sigma);
  const y = householdIncome(input.income, p);
  const loan = (p.effort * y) / annuity(p.rate, p.termYears);
  const s2 = loan / p.ltv / REFERENCE_AREA[input.typology];
  // Nunca mais do que a mediana de mercado: onde o rendimento local suportaria mais do que
  // o mercado pede, a referência é a própria mediana (sanidade do §8 do documento do modelo).
  const mix = (w: number) => Math.min(input.median, w * s1 + (1 - w) * s2);
  const [a, b] = [mix(0.3), mix(0.7)];
  return { s1, s2, capped: p.weightS1 * s1 + (1 - p.weightS1) * s2 > input.median, base: mix(p.weightS1), baseLow: Math.min(a, b), baseHigh: Math.max(a, b), householdIncome: y, affordableLoan: loan };
}

export interface PropertyInput {
  area: number;
  typology: Typology;
  condition: Condition;
  age: AgeBucket;
  /** false = há compartimentos sem janela para o exterior. */
  naturalLight?: boolean;
  /** Qualidade e conforto (elevador, exterior, garagem, classe energética): produto já limitado. */
  quality?: number;
}

export interface Coefficients {
  condition: number;
  age: number;
  light: number;
  quality: number;
  size: number;
}

export function coefficients(prop: PropertyInput, base: number, p: ModelParams = DEFAULT_PARAMS): Coefficients {
  const condition =
    prop.condition === 'ruin'
      ? Math.max(RUIN_FLOOR, 1 - (RUIN_MARKUP * p.capex) / base)
      : CONDITION_COEF[prop.condition];
  return {
    condition,
    age: VETUSTEZ_BY_BUCKET[prop.age] / VETUSTEZ_BASE,
    light: prop.naturalLight === false ? NO_LIGHT_COEF : 1,
    quality: clamp(prop.quality ?? 1, QUALITY_BOUNDS),
    size: clamp(Math.pow(prop.area / REFERENCE_AREA[prop.typology], SIZE_EXPONENT), SIZE_BOUNDS),
  };
}

export function verdictFor(excess: number, p: ModelParams = DEFAULT_PARAMS): Verdict {
  if (excess < -p.tolerance) return 'below';
  if (excess <= p.tolerance) return 'fair';
  if (excess <= 0.2) return 'above';
  if (excess <= 0.5) return 'inflated';
  return 'disproportionate';
}

export interface Effort {
  /** Prestação mensal do pedido (LTV aplicado). */
  payment: number;
  share: number;
  stressPayment: number;
  stressShare: number;
  /** Múltiplo preço / rendimento bruto anual do agregado. */
  priceToIncome: number;
  overCap: boolean;
}

export function buyEffort(price: number, income: IncomeInput, p: ModelParams = DEFAULT_PARAMS): Effort {
  const y = householdIncome(income, p);
  const payment = price * p.ltv * annuity(p.rate, p.termYears);
  const stressPayment = price * p.ltv * annuity(p.rate + p.stressDelta, p.termYears);
  const gross = p.earners * income.medianGross * (income.update ?? 1);
  return {
    payment, share: payment / y, stressPayment, stressShare: stressPayment / y,
    priceToIncome: price / gross, overCap: payment / y > p.effortCap,
  };
}

export interface BuyResult {
  base: BaseResult;
  coefficients: Coefficients;
  /** Preço de referência, €. */
  reference: number;
  referenceLow: number;
  referenceHigh: number;
  asking: number;
  /** X = pedido / referência − 1. */
  excess: number;
  verdict: Verdict;
  /** Parte do pedido acima da faixa defensável (referência × 1,10), em fração do pedido. */
  marginAboveBand: number;
  effort: Effort;
}

export function evaluateBuy(
  input: { asking: number; median: number; income: IncomeInput; property: PropertyInput },
  p: ModelParams = DEFAULT_PARAMS,
): BuyResult {
  const base = basePrice({ median: input.median, income: input.income, typology: input.property.typology }, p);
  const c = coefficients(input.property, base.base, p);
  const factor = input.property.area * c.condition * c.age * c.light * c.quality * c.size;
  const reference = base.base * factor;
  const excess = input.asking / reference - 1;
  return {
    base, coefficients: c, reference,
    referenceLow: base.baseLow * factor, referenceHigh: base.baseHigh * factor,
    asking: input.asking, excess, verdict: verdictFor(excess, p),
    marginAboveBand: Math.max(0, input.asking - (1 + p.tolerance) * reference) / input.asking,
    effort: buyEffort(input.asking, input.income, p),
  };
}

export interface RentResult {
  /** Renda de referência mensal, €. */
  reference: number;
  asking: number;
  excess: number;
  verdict: Verdict;
  /** Rendimento líquido mensal necessário para pagar a renda a 30%. */
  requiredIncome: number;
  /** Múltiplos do salário mínimo líquido, se fornecido. */
  minWageMultiple?: number;
  /** Comparação com o teto do Arrendamento Acessível, se fornecido. */
  overCeiling?: number;
}

export function evaluateRent(
  input: {
    asking: number;
    /** Renda mediana de novos contratos da zona, €/m². */
    marketRentPerM2: number;
    income: IncomeInput;
    property: PropertyInput;
    netMinWage?: number;
    ceiling?: number;
  },
  p: ModelParams = DEFAULT_PARAMS,
): RentResult {
  const prop = input.property;
  const yOne = householdIncome(input.income, p, 1);
  const accessible = (p.effort * yOne) / REFERENCE_AREA[prop.typology];
  const rho = Math.min(input.marketRentPerM2, accessible);
  const c = coefficients(prop, rho, p);
  const reference = prop.area * rho * c.condition * c.light * c.size;
  const excess = input.asking / reference - 1;
  const requiredIncome = input.asking / p.effort;
  return {
    reference, asking: input.asking, excess, verdict: verdictFor(excess, p), requiredIncome,
    minWageMultiple: input.netMinWage ? requiredIncome / input.netMinWage : undefined,
    overCeiling: input.ceiling ? input.asking / input.ceiling - 1 : undefined,
  };
}
