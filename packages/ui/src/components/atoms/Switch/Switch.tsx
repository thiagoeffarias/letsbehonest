import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';

export interface SwitchProps {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  /** Texto ao lado do interruptor; diz o que fica ligado. */
  children?: Msg;
  className?: string;
}

/* ---------- Switch (atom): interruptor ligado/desligado com rótulo ---------- */
export function Switch(props: SwitchProps) {
  var tr = useI18n().tr;
  var on = !!props.checked;
  return h('label', { className: cx('pr-switch', 'body', on && 'is-on', props.disabled && 'is-disabled', props.className), htmlFor: props.id }, [
    h('button', {
      key: 'b', id: props.id, type: 'button', role: 'switch', 'aria-checked': on, disabled: props.disabled, className: 'pr-switch__track',
      onClick: props.onChange ? function () { props.onChange!(!on); } : undefined
    }, h('span', { className: 'pr-switch__thumb', 'aria-hidden': 'true' })),
    h('span', { key: 't', className: 'pr-switch__label' }, tr(props.children))
  ]);
}
