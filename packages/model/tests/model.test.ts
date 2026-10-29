import { describe, expect, it } from 'vitest';
import { DEFAULT_PARAMS, annuity, basePrice, evaluateBuy, evaluateRent, householdIncome, verdictFor } from '../src';

// Exemplo da secção 6 de docs/modelo-preco-referencia.md: T2 de 80 m², bom estado, 9–15 anos,
// rendimentos de 2023 atualizados ×1,174, casal, e=30%, r=3%, 30 anos, LTV 90%, σ=0,30.
const portugal = { median: 2445, income: { medianGross: 11446, update: 1.174 } };
const lisboa = { median: 5192, income: { medianGross: 14282, update: 1.174 } };
const t2 = { area: 80, typology: 'T2' as const, condition: 'good' as const, age: '9_15' as const };

describe('exemplo do documento', () => {
  it('anuidade a 3% em 30 anos', () => {
    expect(annuity(0.03, 30)).toBeCloseTo(0.004216, 6);
  });
  it('rendimento líquido do casal', () => {
    expect(householdIncome({ medianGross: 11446 })).toBeCloseTo(1698, 0);
    expect(householdIncome(portugal.income)).toBeCloseTo(1993, 0);
    expect(householdIncome(lisboa.income)).toBeCloseTo(2486, -1);
  });
  it('Portugal: S1, S2, base, referência e excesso', () => {
    const b = basePrice({ ...portugal, typology: 'T2' });
    expect(b.s1).toBeCloseTo(1881, 0);
    expect(b.s2).toBeCloseTo(1970, -1);
    expect(b.base).toBeCloseTo(1925, -1);
    const r = evaluateBuy({ asking: 2445 * 80, ...portugal, property: t2 });
    expect(r.reference).toBeGreaterThan(153000);
    expect(r.reference).toBeLessThan(155000);
    expect(r.excess).toBeCloseTo(0.27, 1);
    expect(r.verdict).toBe('inflated');
    expect(r.effort.share).toBeCloseTo(0.37, 1);
  });
  it('Lisboa: referência ≈ 258 000 €, desproporcionado, faixa 234–283 mil (30/70 e 70/30)', () => {
    const r = evaluateBuy({ asking: 5192 * 80, ...lisboa, property: t2 });
    expect(r.reference).toBeGreaterThan(256000);
    expect(r.reference).toBeLessThan(260000);
    expect(r.excess).toBeCloseTo(0.61, 1);
    expect(r.verdict).toBe('disproportionate');
    expect(r.referenceLow).toBeGreaterThan(232000);
    expect(r.referenceLow).toBeLessThan(235000);
    expect(r.referenceHigh).toBeGreaterThan(281000);
    expect(r.referenceHigh).toBeLessThan(285000);
    expect(r.effort.share).toBeCloseTo(0.63, 1);
    expect(r.effort.stressPayment).toBeCloseTo(1894, -1);
    expect(r.effort.priceToIncome).toBeGreaterThan(10);
  });
  it('ruína em Lisboa: C_c ≈ 0,64 e referência ≈ 165 000 €', () => {
    const r = evaluateBuy({ asking: 300000, ...lisboa, property: { ...t2, condition: 'ruin' } });
    expect(r.coefficients.condition).toBeCloseTo(0.64, 2);
    expect(r.reference).toBeGreaterThan(163000);
    expect(r.reference).toBeLessThan(167000);
  });
});

describe('coeficientes', () => {
  it('sem janela vale 0,50 e é o degrau de "péssimo"', () => {
    const base = evaluateBuy({ asking: 100000, ...portugal, property: t2 });
    const dark = evaluateBuy({ asking: 100000, ...portugal, property: { ...t2, naturalLight: false } });
    expect(dark.reference / base.reference).toBeCloseTo(0.5, 6);
  });
  it('vetustez normalizada: 9–15 anos = 1; >60 anos = 0,40/0,85', () => {
    const r = evaluateBuy({ asking: 1, ...portugal, property: { ...t2, age: '60plus' } });
    expect(r.coefficients.age).toBeCloseTo(0.4 / 0.85, 6);
  });
  it('tamanho: limitado a [0,90; 1,25]', () => {
    const micro = evaluateBuy({ asking: 1, ...portugal, property: { ...t2, area: 8 } });
    const huge = evaluateBuy({ asking: 1, ...portugal, property: { ...t2, area: 800 } });
    expect(micro.coefficients.size).toBe(1.25);
    expect(huge.coefficients.size).toBe(0.9);
  });
});

describe('limite pela mediana de mercado', () => {
  it('zona barata: a base nunca excede a mediana', () => {
    // mediana baixa face ao rendimento: S2 muito acima da mediana
    const b = basePrice({ median: 325, income: { medianGross: 9977, update: 1.113 }, typology: 'T2' });
    expect(b.s2).toBeGreaterThan(325);
    expect(b.base).toBe(325);
    expect(b.baseHigh).toBeLessThanOrEqual(325);
  });
});

describe('veredictos', () => {
  it('limiares 10/20/50%', () => {
    expect(verdictFor(-0.2)).toBe('below');
    expect(verdictFor(0.1)).toBe('fair');
    expect(verdictFor(0.15)).toBe('above');
    expect(verdictFor(0.5)).toBe('inflated');
    expect(verdictFor(0.51)).toBe('disproportionate');
  });
  it('margem acima da faixa defensável', () => {
    const r = evaluateBuy({ asking: 5192 * 80, ...lisboa, property: t2 });
    expect(r.marginAboveBand).toBeCloseTo((5192 * 80 - 1.1 * r.reference) / (5192 * 80), 6);
  });
});

describe('arrendar: perfil, idade e faixa de esforço', () => {
  const prop = { area: 90, typology: 'T3' as const, condition: 'good' as const, age: '9_15' as const };
  const rent = (extra: object = {}, p = DEFAULT_PARAMS) =>
    evaluateRent({ asking: 700, marketRentPerM2: 11.11, income: { medianGross: 12000, update: 1.113 }, property: { ...prop, ...extra } }, p);

  it('o casal tem referência maior do que uma pessoa (um T3 não é pago por um só salário)', () => {
    const couple = rent({}, { ...DEFAULT_PARAMS, earners: 2 }).reference;
    const single = rent({}, { ...DEFAULT_PARAMS, earners: 1 }).reference;
    expect(couple).toBeGreaterThan(single * 1.9);
  });
  it('a idade do edifício afeta a renda de referência', () => {
    const novo = rent({ age: '0_2' }).reference;
    const velho = rent({ age: '60plus' }).reference;
    expect(novo).toBeGreaterThan(velho);
    expect(rent({ age: '9_15' }).coefficients.age).toBeCloseTo(1, 6);
  });
  it('a faixa de esforço 30%–50% é crescente e a 30% coincide com a referência', () => {
    const r = rent();
    expect(r.referenceByEffort.low).toBeCloseTo(r.reference, 6);
    expect(r.referenceByEffort.high).toBeGreaterThan(r.referenceByEffort.low);
  });
  it('caso Matosinhos: T3 90 m² a 700 € deixa de ser 181% acima com o perfil de casal', () => {
    const r = rent({}, DEFAULT_PARAMS);
    expect(r.reference).toBeGreaterThan(400);
    expect(700 / r.referenceByEffort.high - 1).toBeLessThan(r.excess);
  });
});

describe('arrendar', () => {
  it('T0 de 800 € exige ≈ 2 667 €/mês líquidos', () => {
    const r = evaluateRent({
      asking: 800, marketRentPerM2: 17.79, income: lisboa.income,
      property: { area: 35, typology: 'T0', condition: 'good', age: '9_15' }, netMinWage: 960, ceiling: 785,
    });
    expect(r.requiredIncome).toBeCloseTo(2667, 0);
    expect(r.overCeiling).toBeCloseTo(800 / 785 - 1, 6);
    expect(r.minWageMultiple).toBeGreaterThan(2.7);
  });
});
