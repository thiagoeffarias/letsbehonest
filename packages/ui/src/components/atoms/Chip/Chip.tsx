import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Icon } from '../Icon';

export interface ChipProps {
  size?: "sm" | "md";
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: Msg;
  className?: string;
}

/* ---------- Chip (atom) ---------- */
export function Chip(props: ChipProps) {
  var tr = useI18n().tr;
  var size = props.size || 'md';
  return h('button', {
    type: 'button',
    className: cx('pr-chip', 'label', 'pr-chip--' + size, props.selected && 'is-selected', props.className),
    'aria-pressed': !!props.selected,
    disabled: props.disabled,
    onClick: props.onClick
  }, [
    props.selected ? h(Icon, { key: 'c', name: 'check' }) : null,
    h('span', { key: 't' }, tr(props.children))
  ]);
}
