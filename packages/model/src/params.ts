/**
 * Parâmetros do modelo v0.2 (docs/modelo-preco-referencia.md, factos de 28/10/2026).
 * `hypothesis: true` = hipótese do projeto, a mostrar com o selo na interface.
 */
export type Typology = 'T0' | 'T1' | 'T2' | 'T3' | 'T4+';
export type Condition = 'excellent' | 'good' | 'fair' | 'poor' | 'bad' | 'ruin';
export type AgeBucket = '0_2' | '2_8' | '9_15' | '16_25' | '26_40' | '41_60' | '60plus';

export interface ModelParams {
  /** Esforço de referência (30%). */
  effort: number;
  /** Teto do Banco de Portugal (45%, desde 1/8/2026). */
  effortCap: number;
  /** Taxa de juro anual. */
  rate: number;
  /** Aumento da taxa no teste de stress (p.p.). */
  stressDelta: number;
  termYears: number;
  ltv: number;
  /** Correção de mercado σ (sensibilidade 0,20–0,35). */
  sigma: number;
  /** Peso da âncora S1 (mediana corrigida); S2 pesa 1 − w. */
  weightS1: number;
  /** Rendimentos no agregado: 2 (casal) ou 1. */
  earners: 1 | 2;
  /** Rendimento líquido / bruto (contribuições e IRS médios). */
  netFactor: number;
  /** Custo de reabilitação €/m² usado na ruína (hipótese). */
  capex: number;
  /** Tolerância sobre a referência: 10%. */
  tolerance: number;
}

export const DEFAULT_PARAMS: ModelParams = {
  effort: 0.3,
  effortCap: 0.45,
  rate: 0.03,
  stressDelta: 0.015,
  termYears: 30,
  ltv: 0.9,
  sigma: 0.3,
  weightS1: 0.5,
  earners: 2,
  netFactor: 0.89,
  capex: 1000,
  tolerance: 0.1,
};

/** Intervalo de sensibilidade de σ publicado ao lado do resultado (estimativas institucionais: FMI ≈ 20%, CE ≈ 25–35%). */
export const SIGMA_RANGE: [number, number] = [0.2, 0.35];

/** Área de referência por tipologia (m²), hipótese do projeto. */
export const REFERENCE_AREA: Record<Typology, number> = { T0: 35, T1: 50, T2: 80, T3: 105, 'T4+': 135 };

/** Conservação (NRAU): relativa a "bom". Ruína é calculada à parte. */
export const CONDITION_COEF: Record<Exclude<Condition, 'ruin'>, number> = {
  excellent: 1.2, good: 1.0, fair: 0.9, poor: 0.7, bad: 0.5,
};

/**
 * Vetustez, CIMI art. 44 (idade → coeficiente): <2 anos 1,00; 2–8 0,90; 9–15 0,85; 16–25 0,80;
 * 26–40 0,75; 41–50 0,65; 51–60 0,55; >60 0,40. O modelo normaliza a 0,85 (9–15 anos) = 1,00.
 * O escalão da interface "41 a 60 anos" junta 0,65 e 0,55: usa-se 0,60 (média).
 */
export const VETUSTEZ_BASE = 0.85;
export const VETUSTEZ_BY_BUCKET: Record<AgeBucket, number> = {
  '0_2': 1.0, '2_8': 0.9, '9_15': 0.85, '16_25': 0.8, '26_40': 0.75, '41_60': 0.6, '60plus': 0.4,
};

/** Sem janela ou vão < 1/10 da área do compartimento (hipótese + RGEU art. 71). */
export const NO_LIGHT_COEF = 0.5;
/** Tamanho: (A / A_ref)^-0,10, limitado a [0,90; 1,25] (hipótese). */
export const SIZE_EXPONENT = -0.1;
export const SIZE_BOUNDS: [number, number] = [0.9, 1.25];
/** Qualidade e conforto: limite global (hipótese). */
export const QUALITY_BOUNDS: [number, number] = [0.85, 1.2];
export const RUIN_FLOOR = 0.15;
export const RUIN_MARKUP = 1.15;
