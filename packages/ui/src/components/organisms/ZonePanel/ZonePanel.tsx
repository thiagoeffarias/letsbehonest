import { h } from '../../../h';
import type { Msg, TableRow, Verdict } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Text } from '../../atoms/Text';
import { Callout } from '../../molecules/Callout';
import { EmptyState } from '../../molecules/EmptyState';
import { SourceNote } from '../../molecules/SourceNote';
import { StatBlock } from '../../molecules/StatBlock';
import { TypologyTable } from '../../molecules/TypologyTable';
import { VerdictBanner } from '../../molecules/VerdictBanner';

export interface ZonePanelProps {
  zone?: Msg;
  kind?: Msg;
  /** Selo (por defeito "Dados de exemplo"); `false` esconde-o. */
  badge?: Msg | false;
  value?: Msg;
  valueNote?: Msg;
  variation?: Msg;
  variationTone?: "above" | "below";
  reference?: Msg;
  level?: Verdict;
  excess?: Msg;
  excessNote?: Msg;
  rows?: TableRow[];
  rowsTitle?: Msg;
  /** `rent`: rótulos de renda (mediana de renda e renda de referência) em vez de compra. */
  mode?: 'buy' | 'rent';
  source?: Msg;
  methodHref?: string;
  ctaHref?: string;
  ctaLabel?: Msg;
  state?: "empty" | "insufficient";
  reason?: Msg;
  parentLabel?: Msg;
  parentValue?: Msg;
  parentNote?: Msg;
  compact?: boolean;
  peek?: boolean;
  className?: string;
}

/* ZonePanel: detalhe da zona (lateral em desktop, conteúdo da folha em mobile) */
export function ZonePanel(props: ZonePanelProps) {
  var i = useI18n();
  var t = i.t, tr = i.tr;
  var compact = !!props.compact;
  var rk = props.mode === 'rent' ? '.rent' : '';
  var sample = props.badge === false ? null : (props.badge || 'common.sampleData');
  var cta = props.ctaLabel || 'common.compareAd';
  if (props.peek) {
    return h('div', { className: cx('pr-zone', 'pr-zone--peek', props.className) }, [
      h('div', { key: 'h', className: 'pr-zone__peekhead' }, [
        h(Text, { key: 'z', variant: 'display-md', as: 'h2' }, props.zone),
        h(Icon, { key: 'i', name: 'chevron-up' })
      ]),
      h('div', { key: 's', className: 'pr-zone__stats pr-zone__stats--row' }, [
        h(StatBlock, { key: 'v', size: 'md', label: 'zone.median' + rk, value: props.value }),
        h(StatBlock, { key: 'm', size: 'md', label: 'zone.reference' + rk, value: props.reference })
      ]),
      h(Text, { key: 'e', variant: 'small', tone: props.level === 'below' || props.level === 'fair' ? 'secondary' : 'above', as: 'p' }, tr(props.excess) + '.')
    ]);
  }
  if (props.state === 'empty') {
    return h('div', { className: cx('pr-zone', 'pr-zone--empty', compact && 'pr-zone--compact', props.className) }, [
      h(EmptyState, { key: 'e', icon: 'map-pin', title: 'zone.empty.title', compact: compact, actionLabel: 'common.compareAd', actionHref: props.ctaHref || '#' }, 'zone.empty.body')
    ]);
  }
  if (props.state === 'insufficient') {
    return h('div', { className: cx('pr-zone', compact && 'pr-zone--compact', props.className) }, [
      h('div', { key: 'h', className: 'pr-zone__head' }, [
        sample ? h(Badge, { key: 'b' }, sample) : null,
        h(Text, { key: 'z', variant: compact ? 'display-md' : 'display-lg', as: 'h2' }, props.zone),
        h(Text, { key: 'k', variant: 'small', tone: 'secondary' }, props.kind)
      ]),
      h(Callout, { key: 'c', tone: 'warning', title: 'zone.insufficient.title' }, props.reason || 'zone.insufficient.body'),
      h(StatBlock, { key: 's', size: compact ? 'md' : 'lg', label: props.parentLabel, value: props.parentValue, note: props.parentNote }),
      h(Button, { key: 'c2', variant: 'primary', size: 'lg', fullWidth: true, href: props.ctaHref || '#' }, cta),
      props.source && !compact ? h(SourceNote, { key: 'f' }, props.source) : null
    ]);
  }
  var up = props.variationTone !== 'below';
  return h('div', { className: cx('pr-zone', compact && 'pr-zone--compact', props.className) }, [
    h('div', { key: 'h', className: 'pr-zone__head' }, [
      sample ? h(Badge, { key: 'b' }, sample) : null,
      h(Text, { key: 'z', variant: compact ? 'display-md' : 'display-lg', as: 'h2' }, props.zone),
      h(Text, { key: 'k', variant: 'small', tone: 'secondary' }, props.kind)
    ]),
    h('div', { key: 's', className: cx('pr-zone__stats', compact && 'pr-zone__stats--row') }, [
      h(StatBlock, { key: 'v', size: compact ? 'md' : 'lg', label: 'zone.median' + rk, value: props.value, note: compact ? undefined : props.valueNote }),
      props.variation && !compact ? h(Text, { key: 'd', variant: 'label', tone: up ? 'above' : 'below', as: 'span', className: 'pr-zone__variation' }, [
        h(Icon, { key: 'i', name: up ? 'arrow-up' : 'arrow-down' }), ' ', tr(props.variation)
      ]) : null,
      compact ? h(StatBlock, { key: 'm', size: 'md', label: 'zone.reference' + rk, value: props.reference }) : null
    ]),
    compact ? null : h('div', { key: 'm', className: 'pr-zone__margin' }, [
      h(Text, { key: 'a', variant: 'body-strong', as: 'p' }, 'zone.referenceFull' + rk),
      h(Text, { key: 'b', variant: 'figure-lg', as: 'p' }, props.reference),
      h(VerdictBanner, { key: 'v', verdict: props.level || 'inflated', title: props.excess, detail: props.excessNote }),
      h(SourceNote, { key: 'c', href: props.methodHref || '#' }, 'zone.supports')
    ]),
    compact ? h(SourceNote, { key: 'sn', href: props.methodHref || '#', linkLabel: 'nav.methodology' }, tr(props.excess) + '.') : null,
    compact || !props.rows ? null : h(TypologyTable, { key: 't', rows: props.rows, title: props.rowsTitle }),
    h(Button, { key: 'c', variant: 'primary', size: 'lg', fullWidth: true, href: props.ctaHref || '#' }, cta),
    props.source && !compact ? h(SourceNote, { key: 'f' }, props.source) : null
  ]);
}
