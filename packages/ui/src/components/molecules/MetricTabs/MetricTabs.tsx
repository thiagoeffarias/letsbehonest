import { h } from '../../../h';
import type { Msg, Option } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { METRICS } from '../../../constants';
import { Chip } from '../../atoms/Chip';

export interface MetricTabsProps {
  label?: Msg;
  options?: Option[];
  value?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md";
  scroll?: boolean;
  className?: string;
}

/* MetricTabs: escolha da métrica do mapa */
export function MetricTabs(props: MetricTabsProps) {
  var i = useI18n();
  var opts = props.options || METRICS;
  return h('div', {
    role: 'group', 'aria-label': i.tr(props.label) || i.t('metric.label'),
    className: cx('pr-chipgroup', props.scroll && 'pr-chipgroup--scroll', props.className)
  }, opts.map(function (o) {
    return h(Chip, {
      key: o.value, size: props.size || 'sm', selected: props.value === o.value,
      onClick: props.onChange ? function () { props.onChange!(o.value); } : undefined
    }, o.label);
  }));
}
