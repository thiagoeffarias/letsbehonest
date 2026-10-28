import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { TYPOLOGIES } from '../../../constants';
import { Chip } from '../../atoms/Chip';

export interface TypologyFilterProps {
  label?: Msg;
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md";
  scroll?: boolean;
  className?: string;
}

/* TypologyFilter: grupo de chips T0..T4+ */
export function TypologyFilter(props: TypologyFilterProps) {
  var i = useI18n();
  var opts = props.options || TYPOLOGIES;
  return h('div', {
    role: 'group', 'aria-label': i.tr(props.label) || i.t('typology.label'),
    className: cx('pr-chipgroup', props.scroll && 'pr-chipgroup--scroll', props.className)
  }, opts.map(function (o) {
    return h(Chip, {
      key: o, size: props.size || 'md', selected: props.value === o,
      onClick: props.onChange ? function () { props.onChange!(o); } : undefined
    }, o);
  }));
}
