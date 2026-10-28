import type { ReactElement } from 'react';
import { h } from '../../../h';
import type { BreakdownItem, Msg, Verdict, VerdictRow } from '../../../types';
import { cx } from '../../../utils';
import { useI18n, i18nText } from '../../../i18n';
import { Badge } from '../../atoms/Badge';
import { Text } from '../../atoms/Text';
import { Accordion } from '../../molecules/Accordion';
import { BreakdownList } from '../../molecules/BreakdownList';
import { Callout } from '../../molecules/Callout';
import { EffortMeter } from '../../molecules/EffortMeter';
import { RangeBar } from '../../molecules/RangeBar';
import { SourceNote } from '../../molecules/SourceNote';
import { VerdictBanner } from '../../molecules/VerdictBanner';
import type { EffortMeterProps } from '../../molecules/EffortMeter';

export interface VerdictCardProps {
  verdict: Verdict;
  title?: Msg;
  detail?: Msg;
  /** Selo (por defeito "Exemplo de resultado"); `false` esconde-o. */
  badge?: Msg | false;
  rows?: VerdictRow[];
  position?: number | null;
  efforts?: Omit<EffortMeterProps, "className">[];
  ceiling?: { title?: Msg;
  text?: Msg };
  breakdown?: BreakdownItem[];
  breakdownOpen?: boolean;
  margin?: Msg;
  methodHref?: string;
  source?: Msg;
  compact?: boolean;
  className?: string;
}

/* VerdictCard: resultado da calculadora */
export function VerdictCard(props: VerdictCardProps) {
  var i = useI18n();
  var tr = i.tr, t = i.t;
  var rows = props.rows || [];
  var efforts = props.efforts || [];
  var compact = !!props.compact;
  var effortNodes = efforts.length ? h('div', { key: 'e', className: 'pr-verdictcard__efforts' }, efforts.map(function (e, i) { return h(EffortMeter, Object.assign({ key: i }, e)); })) : null;
  var ceilingNode = props.ceiling ? h(Callout, { key: 'ce', tone: 'info', title: props.ceiling.title }, props.ceiling.text) : null;
  var breakdownNode = props.breakdown ? h(BreakdownList, { key: 'l', items: props.breakdown }) : null;
  var summary = h('div', { key: 'sm', id: 'sec-resumo', className: 'pr-verdictcard__summary' }, [
    props.badge === false ? null : h(Badge, { key: 'b' }, props.badge || 'common.exampleResult'),
    h(VerdictBanner, { key: 'v', verdict: props.verdict, title: props.title, detail: props.detail }),
    h('dl', { key: 'd', className: 'pr-table__grid' }, rows.reduce(function (acc, r, n) {
      acc.push(h('dt', { key: 'k' + n, className: 'body' }, tr(r.label)));
      acc.push(h('dd', { key: 'v' + n, className: cx('figure', r.tone && 'pr-text--' + r.tone) }, tr(r.value)));
      return acc;
    }, [] as ReactElement[])),
    props.position == null ? null : h(RangeBar, { key: 'r', position: props.position })
  ]);
  var marginNode = props.margin ? h('div', { key: 'm', className: 'pr-zone__margin' }, [
    h(Text, { key: 'a', variant: 'body-strong', as: 'p' }, props.margin),
    h(SourceNote, { key: 'b', href: props.methodHref || '#' }, 'result.marginNote')
  ]) : null;
  var sourceNode = props.source ? h(SourceNote, { key: 's' }, props.source) : null;
  if (compact) {
    return h('section', { className: cx('pr-verdictcard', 'pr-verdictcard--compact', props.className), 'aria-live': 'polite' }, [
      summary,
      marginNode,
      effortNodes || ceilingNode ? h(Accordion, { key: 'ef', id: 'sec-esforco', title: 'result.effort', meta: efforts.length === 1 ? t('result.indicators.one') : t('result.indicators.other', { n: efforts.length }), open: true }, [effortNodes, ceilingNode]) : null,
      breakdownNode ? h(Accordion, { key: 'bd', id: 'sec-como', title: 'result.how' }, breakdownNode) : null,
      sourceNode
    ]);
  }
  return h('section', { className: cx('pr-verdictcard', props.className), 'aria-live': 'polite' }, [
    summary,
    effortNodes,
    ceilingNode,
    breakdownNode ? h('details', { key: 'bd', id: 'sec-como', className: 'pr-verdictcard__how', open: props.breakdownOpen !== false }, [
      h('summary', { key: 's', className: 'body-strong' }, i18nText('result.how')),
      breakdownNode
    ]) : null,
    marginNode,
    sourceNode
  ]);
}
