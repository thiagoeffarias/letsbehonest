import { h } from '../../../h';
import type { Msg, Option } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Icon } from '../Icon';

export interface SelectProps {
  id?: string;
  options: Option[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  ariaLabel?: Msg;
  onChange?: (value: string) => void;
  className?: string;
}

/* ---------- Select (atom) ---------- */
export function Select(props: SelectProps) {
  var tr = useI18n().tr;
  return h('span', { className: cx('pr-select', props.className) }, [
    h('select', {
      key: 's', id: props.id, className: 'pr-select__field body',
      value: props.value, defaultValue: props.defaultValue,
      disabled: props.disabled, onChange: props.onChange ? function (e: { target: { value: string } }) { props.onChange!(e.target.value); } : undefined, 'aria-label': tr(props.ariaLabel)
    }, (props.options || []).map(function (o) {
      return h('option', { key: o.value, value: o.value }, tr(o.label));
    })),
    h(Icon, { key: 'i', name: 'chevron-down', className: 'pr-select__icon' })
  ]);
}
