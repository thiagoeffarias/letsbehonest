import { h } from '../../../h';
import type { Msg, Option } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Chip } from '../../atoms/Chip';

export interface ChoiceGroupProps {
  label?: Msg;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md";
  scroll?: boolean;
  className?: string;
}

/* ChoiceGroup: escolha única genérica */
export function ChoiceGroup(props: ChoiceGroupProps) {
  var tr = useI18n().tr;
  return h('div', {
    role: 'group', 'aria-label': tr(props.label),
    className: cx('pr-chipgroup', props.scroll && 'pr-chipgroup--scroll', props.className)
  }, (props.options || []).map(function (o) {
    return h(Chip, {
      key: o.value, size: props.size || 'md', selected: props.value === o.value,
      onClick: props.onChange ? function () { props.onChange!(o.value); } : undefined
    }, o.label);
  }));
}
