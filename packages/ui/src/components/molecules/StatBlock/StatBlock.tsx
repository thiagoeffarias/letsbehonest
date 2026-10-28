import { h } from '../../../h';
import type { Msg, Tone } from '../../../types';
import { cx } from '../../../utils';
import { Text } from '../../atoms/Text';

export interface StatBlockProps {
  label?: Msg;
  value?: Msg;
  note?: Msg;
  size?: "md" | "lg";
  tone?: Tone;
  className?: string;
}

/* StatBlock: valor + rótulo + nota */
export function StatBlock(props: StatBlockProps) {
  var size = props.size === 'md' ? 'figure-md' : 'figure-lg';
  return h('div', { className: cx('pr-stat', props.className) }, [
    props.label ? h(Text, { key: 'l', variant: 'caption', tone: 'secondary', as: 'span' }, props.label) : null,
    h(Text, { key: 'v', variant: size, tone: props.tone, as: 'span' }, props.value),
    props.note ? h(Text, { key: 'n', variant: 'small', tone: 'secondary' }, props.note) : null
  ]);
}
