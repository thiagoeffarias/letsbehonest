import { h } from '../../../h';
import type { ReactNode } from 'react';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { Icon } from '../../atoms/Icon';
import { Text } from '../../atoms/Text';

export interface AccordionProps {
  id?: string;
  title?: Msg;
  meta?: Msg;
  open?: boolean;
  children?: ReactNode;
  className?: string;
}

/* Accordion: secção recolhível */
export function Accordion(props: AccordionProps) {
  return h('details', { id: props.id, className: cx('pr-accordion', props.className), open: !!props.open }, [
    h('summary', { key: 's', className: 'pr-accordion__summary' }, [
      h(Text, { key: 't', variant: 'body-strong', as: 'span' }, props.title),
      props.meta ? h(Text, { key: 'm', variant: 'caption', tone: 'secondary', as: 'span', className: 'pr-accordion__meta' }, props.meta) : null,
      h(Icon, { key: 'i', name: 'chevron-down', className: 'pr-accordion__chev' })
    ]),
    h('div', { key: 'b', className: 'pr-accordion__body' }, props.children)
  ]);
}
