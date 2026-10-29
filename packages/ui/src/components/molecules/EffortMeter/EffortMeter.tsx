import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Text } from '../../atoms/Text';

export interface EffortMeterProps {
  value: number;
  label?: Msg;
  /** Linha secundária sob o título (ex.: o perfil do agregado), em vez de parênteses no título. */
  sublabel?: Msg;
  caption?: Msg;
  reference?: number;
  cap?: number;
  className?: string;
}

/* EffortMeter: esforço face à referência e ao teto do Banco de Portugal */
export function EffortMeter(props: EffortMeterProps) {
  var i = useI18n();
  var v = Math.max(0, Math.min(100, props.value));
  var ref = props.reference == null ? 30 : props.reference;
  var cap = props.cap == null ? 45 : props.cap;
  var tone = props.value <= ref ? 'ok' : props.value <= cap ? 'warn' : 'over';
  var pct = i.fmt({ num: Math.round(props.value), f: 'pct' });
  return h('div', { className: cx('pr-effort', 'pr-effort--' + tone, props.className) }, [
    h('div', { key: 'h', className: 'pr-effort__head' }, [
      h('div', { key: 'l', className: 'pr-effort__title' }, [
        h(Text, { key: 't', variant: 'body-strong', as: 'span' }, props.label || 'effort.default'),
        props.sublabel ? h(Text, { key: 's', variant: 'small', tone: 'secondary', as: 'span' }, props.sublabel) : null
      ]),
      h(Text, { key: 'v', variant: 'figure', as: 'span', className: 'pr-effort__value' }, pct)
    ]),
    h('div', { key: 't', className: 'pr-effort__track', role: 'img', 'aria-label': i.t('effort.aria', { pct: pct, state: i.t('effort.state.' + tone) }) }, [
      h('span', { key: 'f', className: 'pr-effort__fill', style: { width: v + '%' } }),
      h('span', { key: 'a', className: 'pr-effort__mark', style: { left: ref + '%' } }),
      h('span', { key: 'b', className: 'pr-effort__mark', style: { left: cap + '%' } })
    ]),
    // cada legenda fica encostada ao seu traço: a da referência termina nele, a do teto começa nele
    h('div', { key: 'k', className: 'pr-effort__legend' }, [
      h('span', { key: 'a', className: 'pr-effort__tag pr-effort__tag--ref', style: { right: (100 - ref) + '%' } }, h(Text, { variant: 'caption', tone: 'secondary', as: 'span' }, i.t('effort.ref', { n: ref }))),
      h('span', { key: 'b', className: 'pr-effort__tag pr-effort__tag--cap', style: { left: cap + '%' } }, h(Text, { variant: 'caption', tone: 'secondary', as: 'span' }, i.t('effort.cap', { n: cap })))
    ]),
    h(Text, { key: 'w', variant: 'small', tone: tone === 'ok' ? 'secondary' : 'above', as: 'p' }, (props.caption ? i.tr(props.caption) + ' ' : '') + i.t('effort.sentence.' + tone))
  ]);
}
