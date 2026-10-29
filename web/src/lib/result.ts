import { DEFAULT_PARAMS, REFERENCE_AREA, RENT_EFFORT_RANGE, SIGMA_RANGE, evaluateBuy, evaluateRent, householdIncome } from '@preco-real/model';
import type { AgeBucket, Condition, ModelParams, Typology } from '@preco-real/model';
import type { Meta, Zone } from './data';
import { periodParts, typologyRecord } from './data';

export interface UserParams { effort: number; rate: number; sigma: number; term: number; profile: 'single' | 'couple' }
export const DEFAULT_USER_PARAMS: UserParams = { effort: 30, rate: 3, sigma: 30, term: 30, profile: 'couple' };

export const toModelParams = (u: UserParams): ModelParams => ({
  ...DEFAULT_PARAMS,
  effort: u.effort / 100, rate: u.rate / 100, sigma: u.sigma / 100, termYears: u.term, earners: u.profile === 'couple' ? 2 : 1,
});

export interface CalcInput {
  mode: 'buy' | 'rent';
  zone: Zone;
  typology: Typology;
  area: number;
  asking: number;
  condition: Condition;
  age: AgeBucket;
  light: boolean;
}

const num = (n: number, f?: string, extra: object = {}) => ({ num: n, ...(f ? { f } : {}), ...extra });
const round = (x: number) => Math.round(x);
const times = (v: number, d = 2) => ({ k: 'fmt.times', p: { v: { num: v, d } } });

/** Props de `VerdictCard` para um resultado de compra ou renda, ou `null` se faltarem dados. */
export function buildResult(input: CalcInput, meta: Meta, user: UserParams, national: Zone | null): Record<string, any> | null {
  const p = toModelParams(user);
  const rec = typologyRecord(input.zone, input.typology);
  const income = input.zone.incomeGross;
  if (income == null) return null;
  const incomeIn = { medianGross: income, update: meta.incomeUpdate };
  const period = { k: 'period.quarter', p: periodParts(meta.period) };
  const zoneName = input.zone.name;
  const property = { area: input.area, typology: input.typology, condition: input.condition, age: input.age, naturalLight: input.light };
  const profileKey = user.profile === 'couple' ? 'params.couple' : 'params.single';

  if (input.mode === 'buy') {
    if (rec.median == null) return null;
    const r = evaluateBuy({ asking: input.asking, median: rec.median, income: incomeIn, property }, p);
    const pctAbs = Math.abs(r.excess) * 100;
    const c = r.coefficients;
    const combined = c.condition * c.age * c.light * c.quality * c.size;
    // a mesma avaliação com os dois extremos de σ: mostra o quanto o resultado depende desta hipótese
    const lowSigma = evaluateBuy({ asking: input.asking, median: rec.median, income: incomeIn, property }, { ...p, sigma: SIGMA_RANGE[0] });
    const highSigma = evaluateBuy({ asking: input.asking, median: rec.median, income: incomeIn, property }, { ...p, sigma: SIGMA_RANGE[1] });
    const share = r.effort.share * 100;
    const efforts = [
      {
        label: user.profile === 'couple' ? 'eff.couple' : 'eff.single', value: share,
        caption: { k: 'eff.perMonth', p: { v: num(round(r.effort.payment), 'eurMonth') } }, reference: user.effort, cap: p.effortCap * 100,
      },
      {
        label: { k: 'eff.stress', p: { rate: num((user.rate + p.stressDelta * 100), 'pct', { d: 1 }) } }, value: r.effort.stressShare * 100,
        caption: { k: 'eff.perMonth', p: { v: num(round(r.effort.stressPayment), 'eurMonth') } }, reference: user.effort, cap: p.effortCap * 100,
      },
    ];
    return {
      verdict: r.verdict,
      detail: { k: r.excess >= 0 ? 'res.detail.above' : 'res.detail.below', p: { pct: num(round(pctAbs), 'pct'), zone: zoneName } },
      rows: [
        { label: 'res.asking', value: num(round(input.asking), 'eur') },
        { label: 'res.reference', value: num(round(r.reference), 'eur') },
        { label: 'res.excess', value: num(round(r.excess * 100), 'pct', { sign: true }), tone: r.excess > p.tolerance ? 'above' : undefined },
        { label: 'res.band', value: { k: 'res.upTo', p: { v: num(round((1 + p.tolerance) * r.reference), 'eur') } } },
        {
          label: { k: 'res.sigmaRef', p: { lo: num(SIGMA_RANGE[0] * 100, 'pct'), hi: num(SIGMA_RANGE[1] * 100, 'pct') } },
          value: { k: 'res.range', p: { a: num(round(highSigma.reference), 'eur'), b: num(round(lowSigma.reference), 'eur') } },
        },
        {
          label: 'res.sigmaExcess',
          value: { k: 'res.range', p: { a: num(round(lowSigma.excess * 100), 'pct', { sign: true }), b: num(round(highSigma.excess * 100), 'pct', { sign: true }) } },
        },
      ],
      position: Math.max(2, Math.min(98, 50 + 50 * Math.log2(input.asking / input.area / rec.median))),
      efforts,
      breakdown: [
        { label: 'br.median', note: { k: 'br.median.n2', p: { period } }, value: num(rec.median, 'eurM2') },
        { label: 'br.correction', note: { k: 'br.correction.n2', p: { v: num(1 + p.sigma, undefined, { d: 2 }) } }, value: num(round(r.base.s1), 'eurM2') },
        { label: 'br.afford', note: { k: 'br.afford.n2', p: { profile: profileKey, effort: num(user.effort, 'pct') } }, value: num(round(r.base.s2), 'eurM2') },
        { label: 'br.base', note: r.base.capped ? 'br.base.cap' : 'br.base.n', value: num(round(r.base.base), 'eurM2') },
        {
          label: 'br.coef',
          note: { k: 'br.coef.dyn', p: { cond: `cond.${input.condition}`, age: `age.${input.age}`, area: num(input.area, 'm2') } },
          value: times(combined),
        },
        { label: 'br.ref', note: { k: 'br.ref.n2', p: { area: num(input.area, 'm2') } }, value: num(round(r.reference), 'eur'), kind: 'result' },
      ],
      margin: r.verdict === 'below' ? 'res.margin.below' : r.marginAboveBand <= 0
        ? 'res.margin.fair' : { k: 'res.margin', p: { pct: num(round(r.marginAboveBand * 100), 'pct') } },
      source: { k: 'src.result', p: { period } },
    };
  }

  // renda
  const rentPerM2 = input.zone.rentPerM2;
  if (rentPerM2 == null) return null;
  const r = evaluateRent({ asking: input.asking, marketRentPerM2: rentPerM2, income: incomeIn, property }, p);
  const household = householdIncome(incomeIn, p);
  const { accessible, used: rho } = r.perM2;
  const pctAbs = Math.abs(r.excess) * 100;
  const c = r.coefficients;
  const coef = c.condition * c.age * c.light * c.size;
  // faixa de esforço: a referência a 30% e a 50%; o excesso vai do maior (30%) ao menor (50%)
  const exLow = input.asking / r.referenceByEffort.low - 1;
  const exHigh = input.asking / r.referenceByEffort.high - 1;
  const above = Math.max(0, input.asking - (1 + p.tolerance) * r.reference) / input.asking;
  return {
    verdict: r.verdict,
    detail: { k: r.excess >= 0 ? 'res.detail.rent' : 'res.detail.below', p: { pct: num(round(pctAbs), 'pct'), zone: zoneName } },
    rows: [
      { label: 'res.askingRent', value: num(round(input.asking), 'eurMonth') },
      { label: 'res.referenceRent', value: num(round(r.reference), 'eurMonth') },
      { label: 'res.excess', value: num(round(r.excess * 100), 'pct', { sign: true }), tone: r.excess > p.tolerance ? 'above' : undefined },
      { label: 'res.requiredIncome', value: num(round(r.requiredIncome), 'eurMonth') },
      ...(r.referenceByEffort.high - r.referenceByEffort.low < 1 ? [] : [
      {
          label: { k: 'res.rentRange', p: { lo: num(RENT_EFFORT_RANGE[0] * 100, 'pct'), hi: num(RENT_EFFORT_RANGE[1] * 100, 'pct') } },
          value: { k: 'res.range', p: { a: num(round(r.referenceByEffort.low), 'eurMonth'), b: num(round(r.referenceByEffort.high), 'eurMonth') } },
        },
        {
          label: 'res.rentExcessRange',
          value: { k: 'res.range', p: { a: num(round(exLow * 100), 'pct', { sign: true }), b: num(round(exHigh * 100), 'pct', { sign: true }) } },
        },
      ]),
    ],
    position: Math.max(2, Math.min(98, 50 + 50 * Math.log2(input.asking / input.area / rentPerM2))),
    efforts: [{
      label: { k: 'eff.rentMedian', p: { zone: zoneName } }, sublabel: user.profile === 'couple' ? 'params.couple' : 'params.single', value: (input.asking / household) * 100,
      caption: { k: 'eff.perMonth', p: { v: num(round(input.asking), 'eurMonth') } }, reference: user.effort, cap: p.effortCap * 100,
    }],
    breakdown: [
      { label: 'rbr.median', note: { k: 'br.median.n2', p: { period: String(meta.rentYear) } }, value: num(rentPerM2, 'eurM2', { d: 2 }) },
      { label: 'rbr.afford', note: { k: 'rbr.afford.n2', p: { effort: num(user.effort, 'pct'), profile: user.profile === 'couple' ? 'params.couple' : 'params.single' } }, value: num(accessible, 'eurM2', { d: 2 }) },
      { label: 'rbr.min', note: { k: 'rbr.min.n2', p: { typ: input.typology, area: num(REFERENCE_AREA[input.typology], 'm2') } }, value: num(rho, 'eurM2', { d: 2 }) },
      { label: 'rbr.coef', note: { k: 'br.coef.dyn', p: { cond: `cond.${input.condition}`, age: `age.${input.age}`, area: num(input.area, 'm2') } }, value: times(coef) },
      { label: 'rbr.ref', note: { k: 'br.ref.n2', p: { area: num(input.area, 'm2') } }, value: num(round(r.reference), 'eurMonth'), kind: 'result' },
    ],
    margin: r.verdict === 'below' ? 'res.margin.below' : above <= 0 ? 'res.margin.fair' : { k: 'res.margin.rent', p: { pct: num(round(above * 100), 'pct') } },
    source: { k: 'src.resultRent', p: { period: String(meta.rentYear) } },
  };
}

