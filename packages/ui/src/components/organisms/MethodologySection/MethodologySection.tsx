import { h } from '../../../h';
import type { ReactNode } from 'react';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { Text } from '../../atoms/Text';
import { Accordion } from '../../molecules/Accordion';

export interface MethodologySectionProps {
  id?: string;
  title?: Msg;
  meta?: Msg;
  collapsible?: boolean;
  open?: boolean;
  children?: ReactNode;
  className?: string;
}

/* MethodologySection: secção de texto (recolhível em mobile) */
export function MethodologySection(props: MethodologySectionProps) {
  if (props.collapsible) {
    return h(Accordion, { id: props.id, title: props.title, open: props.open, meta: props.meta, className: props.className }, h('div', { className: 'pr-section__body' }, props.children));
  }
  return h('section', { id: props.id, className: cx('pr-section', props.className) }, [
    h(Text, { key: 't', variant: 'display-md', as: 'h2' }, props.title),
    h('div', { key: 'c', className: 'pr-section__body' }, props.children)
  ]);
}
