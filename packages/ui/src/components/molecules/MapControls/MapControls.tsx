import { h } from '../../../h';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Button } from '../../atoms/Button';

export interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  className?: string;
}

/* MapControls: aproximar e afastar o mapa (substitui os controlos por defeito do MapLibre) */
export function MapControls(props: MapControlsProps) {
  var t = useI18n().t;
  return h('div', { className: cx('pr-mapcontrols', props.className), role: 'group', 'aria-label': t('map.controls') }, [
    h(Button, { key: 'in', variant: 'secondary', icon: 'plus', iconOnly: true, ariaLabel: 'map.zoomIn', onClick: props.onZoomIn }),
    h(Button, { key: 'out', variant: 'secondary', icon: 'minus', iconOnly: true, ariaLabel: 'map.zoomOut', onClick: props.onZoomOut })
  ]);
}
