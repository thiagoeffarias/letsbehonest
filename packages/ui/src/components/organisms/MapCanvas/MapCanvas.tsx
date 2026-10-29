import type { ReactElement } from 'react';
import { h } from '../../../h';
import type { ReactNode } from 'react';
import type { Metric, Option } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Text } from '../../atoms/Text';
import { EmptyState } from '../../molecules/EmptyState';
import { MapControls } from '../../molecules/MapControls';
import { MetricTabs } from '../../molecules/MetricTabs';

export interface MapCanvasProps {
  metric?: Metric;
  selected?: [number, number] | null;
  size?: "sm" | "md";
  app?: boolean;
  layers?: boolean;
  panned?: boolean;
  note?: boolean;
  children?: ReactNode;
  /** Superfície interativa (mapa real) no lugar do cartograma esquemático. */
  surface?: ReactNode;
  onMetricChange?: (metric: Metric) => void;
  /** Métricas das camadas (por defeito preço, variação e excesso). */
  metricOptions?: Option[];
  /** Estado da superfície: `loading` e `error` mostram uma mensagem sobre o mapa. */
  status?: 'ready' | 'loading' | 'error';
  /** Mostra os botões de zoom; os callbacks ligam-nos ao mapa. */
  controls?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  className?: string;
}

/* MapCanvas: cartograma esquemático (choropleth) */
const DEMO_MASK = [
  '..###...', '.####...', '.#####..', '.#####..', '.######.', '.######.',
  '..#####.', '..#####.', '..####..', '..####..', '..####..', '..###...',
  '..####..', '..####..', '..###...', '..####..', '..#####.', '..#####.'
];
const DEMO_CENTERS = [[13, 3, 1.0], [4, 2, 0.8], [17, 4, 0.75], [14.5, 3.5, 0.6], [2.5, 2, 0.55]];
const DEMO_NODATA: Record<string, number> = { '8-4': 1, '9-3': 1, '10-3': 1, '6-5': 1 };

function demoTier(r: number, c: number, metric: string) {
  var s = 0.05;
  DEMO_CENTERS.forEach(function (k) {
    var d2 = (r - k[0]) * (r - k[0]) + (c - k[1]) * (c - k[1]);
    s = Math.max(s, k[2] * Math.exp(-d2 / 14));
  });
  var t = s > 0.8 ? 5 : s > 0.6 ? 4 : s > 0.4 ? 3 : s > 0.22 ? 2 : 1;
  if (metric === 'change') t = Math.max(1, Math.min(5, t + ((r * 3 + c * 2) % 3) - 1));
  if (metric === 'excess') t = Math.max(1, Math.min(5, t + (s > 0.55 ? 0 : -1)));
  return t;
}

export function MapCanvas(props: MapCanvasProps) {
  var t = useI18n().t;
  var metric = props.metric || 'price';
  var cls = metric === 'excess' ? 'pr-xramp-' : 'pr-ramp-';
  var sel = props.selected === null ? null : (props.selected || [13, 3]);
  var cells: ReactElement[] = [];
  DEMO_MASK.forEach(function (row, r) {
    for (var c = 0; c < 8; c++) {
      var on = row.charAt(c) === '#';
      var nodata = on && !!DEMO_NODATA[r + '-' + c];
      var isSel = on && sel && r === sel[0] && c === sel[1];
      cells.push(h('div', {
        key: r + '-' + c,
        className: cx('pr-map__cell', on && !nodata && cls + demoTier(r, c, metric), !on && 'is-empty', nodata && 'is-nodata', isSel && 'is-selected')
      }));
    }
  });
  return h('div', { className: cx('pr-map', props.size === 'sm' && 'pr-map--sm', props.app && 'pr-map--app', props.panned && 'pr-map--panned', props.className) }, [
    props.layers ? h('div', { key: 'ly', className: 'pr-map__layers' }, h(MetricTabs, { value: metric, scroll: true, size: 'sm', label: 'metric.layer', options: props.metricOptions, onChange: props.onMetricChange as any })) : null,
    props.surface ? h('div', { key: 'sf', className: 'pr-map__surface' }, props.surface) : h('div', { key: 'g', className: 'pr-map__grid', role: 'img', 'aria-label': t('map.aria', { metric: t('map.aria.' + metric) }) }, cells),
    props.controls ? h(MapControls, { key: 'mc', className: 'pr-map__controls', onZoomIn: props.onZoomIn, onZoomOut: props.onZoomOut }) : null,
    props.status === 'loading' || props.status === 'error'
      ? h('div', { key: 'st', className: 'pr-map__status', role: props.status === 'error' ? 'alert' : 'status' },
          h(EmptyState, { compact: true, icon: props.status === 'error' ? 'alert' : 'map-pin', title: props.status === 'error' ? 'map.loadError' : 'map.loading' }))
      : null,
    props.children ? h('div', { key: 'c', className: 'pr-map__legend' }, props.children) : null,
    props.note === false ? null : h(Text, { key: 'n', variant: 'caption', tone: 'secondary', as: 'span', className: 'pr-map__note' }, 'map.note')
  ]);
}
