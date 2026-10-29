import { h } from '../../../h';
import type { BreakdownItem } from '../../../types';
import { cx } from '../../../utils';
import { Text } from '../../atoms/Text';

export interface BreakdownListProps {
  items: BreakdownItem[];
  className?: string;
}

/* BreakdownList: como se chegou ao número */
export function BreakdownList(props: BreakdownListProps) {
  return h('ol', { className: cx('pr-breakdown', props.className) }, (props.items || []).map(function (it, i) {
    return h('li', { key: i, className: cx('pr-breakdown__item', it.kind === 'result' && 'is-result') }, [
      h('div', { key: 'l', className: 'pr-breakdown__label' }, [
        h(Text, { key: 'a', variant: it.kind === 'result' ? 'body-strong' : 'body', as: 'span' }, it.label),
        it.note ? h(Text, { key: 'b', variant: 'caption', tone: 'secondary', as: 'span' }, it.note) : null
      ]),
      h(Text, { key: 'v', variant: 'figure', as: 'span', tone: it.tone, className: 'pr-breakdown__value' }, it.value)
    ]);
  }));
}
