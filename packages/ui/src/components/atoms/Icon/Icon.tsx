import { h } from '../../../h';
import type { IconName, Msg } from '../../../types';
import { cx } from '../../../utils';

export interface IconProps {
  name: IconName;
  size?: "md" | "lg";
  label?: Msg;
  className?: string;
}

const ICON_PATHS: Record<string, string[]> = {
  'arrow-up': ['M12 19V5', 'M5 12l7-7 7 7'],
  'arrow-down': ['M12 5v14', 'M19 12l-7 7-7-7'],
  'plus': ['M12 5v14', 'M5 12h14'],
  'minus': ['M5 12h14'],
  'search': ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M21 21l-4.3-4.3'],
  'info': ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 16v-4', 'M12 8h.01'],
  'alert': ['M12 3l10 18H2L12 3z', 'M12 10v4', 'M12 18h.01'],
  'map-pin': ['M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z', 'M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  'check': ['M5 12.5l4.5 4.5L19 7.5'],
  'chevron-down': ['M6 9l6 6 6-6'],
  'close': ['M6 6l12 12', 'M18 6L6 18'],
  'menu': ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  'layers': ['M12 3l9 5-9 5-9-5 9-5z', 'M3 13l9 5 9-5'],
  'edit': ['M4 20h4l10-10-4-4L4 16v4z', 'M13 7l4 4'],
  'chevron-up': ['M6 15l6-6 6 6'],
  'globe': ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M3 12h18', 'M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z'],
  'external': ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5']
};

export function Icon(props: IconProps) {
  var paths = ICON_PATHS[props.name] || [];
  var dim = props.size === 'lg' ? 'var(--size-icon-lg)' : 'var(--size-icon-md)';
  var a11y = props.label ? { role: 'img', 'aria-label': props.label } : { 'aria-hidden': 'true' };
  return h('svg', Object.assign({
    className: cx('pr-icon', props.className),
    style: { width: dim, height: dim },
    viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'
  }, a11y), paths.map(function (d, i) { return h('path', { key: i, d: d }); }));
}
