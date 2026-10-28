import { h } from '../../../h';
import type { ReactNode } from 'react';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';

export interface TooltipProps {
  id?: string;
  content?: Msg;
  open?: boolean;
  children?: ReactNode;
  className?: string;
}

/* ---------- Tooltip (atom) ---------- */
export function Tooltip(props: TooltipProps) {
  var tr = useI18n().tr;
  return h('span', { className: cx('pr-tooltip', props.open && 'is-open', props.className) }, [
    props.children,
    h('span', { key: 'tip', role: 'tooltip', id: props.id, className: 'pr-tooltip__bubble small' }, tr(props.content))
  ]);
}
