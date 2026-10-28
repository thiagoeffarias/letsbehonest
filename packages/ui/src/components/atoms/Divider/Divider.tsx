import { h } from '../../../h';
import { cx } from '../../../utils';

export interface DividerProps {
  vertical?: boolean;
  className?: string;
}

/* ---------- Divider (atom) ---------- */
export function Divider(props: DividerProps) {
  return h('hr', { className: cx('pr-divider', props.vertical && 'pr-divider--vertical', props.className) });
}
