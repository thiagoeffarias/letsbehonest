import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  children?: Msg;
  className?: string;
}

/* ---------- Checkbox (atom) ---------- */
export function Checkbox(props: CheckboxProps) {
  var tr = useI18n().tr;
  return h('label', { className: cx('pr-check', 'body', props.className), htmlFor: props.id }, [
    h('input', {
      key: 'i', id: props.id, type: 'checkbox', className: 'pr-check__input',
      checked: props.checked, defaultChecked: props.defaultChecked,
      disabled: props.disabled, onChange: props.onChange ? function (e: { target: { checked: boolean } }) { props.onChange!(e.target.checked); } : undefined
    }),
    h('span', { key: 't' }, tr(props.children))
  ]);
}
