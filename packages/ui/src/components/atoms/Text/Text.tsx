import { h } from '../../../h';
import type { ElementType } from 'react';
import type { Msg, TextVariant, Tone } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';

export interface TextProps {
  as?: ElementType;
  variant?: TextVariant;
  tone?: Tone;
  id?: string;
  children?: Msg;
  className?: string;
}

/* ---------- Text (atom) ---------- */
const DEFAULT_TAG: Record<string, string> = {
  'display-xl': 'h1', 'display-lg': 'h1', 'display-md': 'h2',
  'body': 'p', 'body-strong': 'p', 'label': 'span', 'small': 'p', 'caption': 'span',
  'figure-lg': 'span', 'figure-md': 'span', 'figure': 'span'
};

export function Text(props: TextProps) {
  var tr = useI18n().tr;
  var variant = props.variant || 'body';
  var tag = props.as || DEFAULT_TAG[variant] || 'p';
  return h(tag, {
    id: props.id,
    className: cx('pr-text', variant, props.tone && 'pr-text--' + props.tone, props.className)
  }, tr(props.children));
}
