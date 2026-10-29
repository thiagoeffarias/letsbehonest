import type { ReactNode } from 'react';

export type Locale = 'pt_pt' | 'en';

export type NumberFormatKey = 'eur' | 'eurM2' | 'eurM2Month' | 'eurMonth' | 'pct' | 'm2';

/** Número formatado segundo o idioma; `f` escolhe o modelo `fmt.*`. */
export interface NumFormat {
  num: number;
  f?: NumberFormatKey;
  sign?: boolean;
  d?: number;
}

/** Chave de tradução com parâmetros (`{nome}` no texto). */
export interface KeyRef {
  k: string;
  p?: Record<string, Msg>;
}

/**
 * Qualquer texto de interface: uma stringKey (`"calc.title.buy"`), `KeyRef`,
 * número formatado, ou dado dinâmico (nome de zona, valor). Texto cru só para dados.
 */
export type Msg = ReactNode | KeyRef | NumFormat;

export type Tone = 'secondary' | 'above' | 'below' | 'accent';
export type TextVariant =
  | 'display-xl' | 'display-lg' | 'display-md'
  | 'body' | 'body-strong' | 'label' | 'small' | 'caption'
  | 'figure-lg' | 'figure-md' | 'figure';

export type IconName =
  | 'arrow-up' | 'arrow-down' | 'search' | 'info' | 'alert' | 'map-pin' | 'check'
  | 'plus' | 'minus' | 'chevron-down' | 'close' | 'menu' | 'layers' | 'edit' | 'chevron-up' | 'globe' | 'external';

export type Metric = 'price' | 'change' | 'excess';
export type Verdict = 'below' | 'fair' | 'above' | 'inflated' | 'disproportionate';

export interface Option {
  value: string;
  label: Msg;
}

export interface Suggestion {
  label: string;
  kind: Msg;
}

export interface BreakdownItem {
  label: Msg;
  note?: Msg;
  value: Msg;
  kind?: 'result';
  tone?: Tone;
}

export interface SectionTab {
  id: string;
  label: Msg;
  href?: string;
  current?: boolean;
}

export interface TableRow {
  label: Msg;
  value: Msg;
  tone?: Tone;
}

export interface VerdictRow extends TableRow {}

export interface NavItem {
  label: Msg;
  href?: string;
  current?: boolean;
}

export interface LanguageOption {
  value: Locale;
  /** Código curto mostrado no botão (PT, EN). */
  short: string;
  /** stringKey com o nome do idioma na própria língua. */
  label: string;
  /** Etiqueta BCP 47 (`hreflang`, `lang`). */
  tag: string;
  /** Ligação para a versão neste idioma. */
  href?: string;
}
