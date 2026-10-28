import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Text } from '../../atoms/Text';

export interface RangeBarProps {
  position?: number;
  label?: Msg;
  className?: string;
}

/* RangeBar: posição face à mediana */
export function RangeBar(props: RangeBarProps) {
  var t = useI18n().t;
  var pos = Math.max(0, Math.min(100, props.position == null ? 50 : props.position));
  return h('div', { className: cx('pr-range', props.className) }, [
    h('div', { key: 'b', className: 'pr-range__track', role: 'img', 'aria-label': props.label || t('range.aria') }, [
      h('span', { key: 'm', className: 'pr-range__median' }),
      h('span', { key: 'p', className: 'pr-range__marker', style: { left: pos + '%' } })
    ]),
    h('div', { key: 'l', className: 'pr-range__labels' }, [
      h(Text, { key: 'a', variant: 'caption', tone: 'secondary', as: 'span' }, 'legend.price.low'),
      h(Text, { key: 'b', variant: 'caption', tone: 'secondary', as: 'span' }, 'range.median'),
      h(Text, { key: 'c', variant: 'caption', tone: 'secondary', as: 'span' }, 'legend.price.high')
    ])
  ]);
}
