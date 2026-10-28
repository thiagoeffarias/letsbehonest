import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';

export interface TextInputProps {
  id?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "decimal" | "search";
  placeholder?: Msg;
  value?: string;
  defaultValue?: string | number;
  invalid?: boolean;
  disabled?: boolean;
  ariaLabel?: Msg;
  onChange?: (value: string) => void;
  className?: string;
}

/* ---------- TextInput (atom) ---------- */
export function TextInput(props: TextInputProps) {
  var tr = useI18n().tr;
  return h('input', {
    id: props.id, type: props.type || 'text', inputMode: props.inputMode,
    className: cx('pr-input', 'body', props.invalid && 'is-invalid', props.className),
    placeholder: tr(props.placeholder), value: props.value, defaultValue: props.defaultValue,
    disabled: props.disabled, onChange: props.onChange ? function (e: { target: { value: string } }) { props.onChange!(e.target.value); } : undefined,
    'aria-label': tr(props.ariaLabel), 'aria-invalid': props.invalid ? 'true' : undefined
  });
}
