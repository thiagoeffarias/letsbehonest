import { h } from '../../../h';
import type { Metric, Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Text } from '../../atoms/Text';

export interface LegendScaleProps {
  metric?: Metric;
  title?: Msg;
  low?: Msg;
  high?: Msg;
  compact?: boolean;
  noData?: boolean;
  className?: string;
}

/* LegendScale: legenda do choropleth */
const LEGENDS = {
  price: { title: 'legend.price.title', low: 'legend.price.low', high: 'legend.price.high', cls: 'pr-ramp-' },
  change: { title: 'legend.change.title', low: 'legend.change.low', high: 'legend.change.high', cls: 'pr-ramp-' },
  excess: { title: 'legend.excess.title', low: 'legend.excess.low', high: 'legend.excess.high', cls: 'pr-xramp-' }
};
export function LegendScale(props: LegendScaleProps) {
  var i = useI18n();
  var L = LEGENDS[props.metric || 'price'];
  if (props.compact) {
    return h('div', { className: cx('pr-legend', 'pr-legend--compact', props.className), role: 'img', 'aria-label': i.t('legend.range', { title: props.title || L.title, low: props.low || L.low, high: props.high || L.high }) }, [
      h(Text, { key: 'a', variant: 'caption', tone: 'secondary', as: 'span' }, props.low || L.low),
      h('div', { key: 's', className: 'pr-legend__scale', 'aria-hidden': 'true' }, [1, 2, 3, 4, 5].map(function (i) { return h('span', { key: i, className: 'pr-legend__swatch ' + L.cls + i }); })),
      h(Text, { key: 'b', variant: 'caption', tone: 'secondary', as: 'span' }, props.high || L.high)
    ]);
  }
  return h('div', { className: cx('pr-legend', props.className) }, [
    h(Text, { key: 't', variant: 'caption', tone: 'secondary' }, props.title || L.title),
    h('div', { key: 's', className: 'pr-legend__scale', 'aria-hidden': 'true' },
      [1, 2, 3, 4, 5].map(function (i) { return h('span', { key: i, className: 'pr-legend__swatch ' + L.cls + i }); })),
    h('div', { key: 'l', className: 'pr-legend__labels' }, [
      h(Text, { key: 'a', variant: 'caption', tone: 'secondary', as: 'span' }, props.low || L.low),
      h(Text, { key: 'b', variant: 'caption', tone: 'secondary', as: 'span' }, props.high || L.high)
    ]),
    props.noData === false ? null : h('div', { key: 'n', className: 'pr-legend__nodata' }, [
      h('span', { key: 's', className: 'pr-legend__swatch pr-legend__swatch--nodata', 'aria-hidden': 'true' }),
      h(Text, { key: 't', variant: 'caption', tone: 'secondary', as: 'span' }, 'legend.noData')
    ])
  ]);
}
