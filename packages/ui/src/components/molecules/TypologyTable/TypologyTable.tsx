import type { ReactElement } from 'react';
import { h } from '../../../h';
import type { Msg, TableRow } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { TYPOLOGIES } from '../../../constants';
import { Text } from '../../atoms/Text';

export interface TypologyTableProps {
  title?: Msg;
  rows: TableRow[];
  className?: string;
}

/* TypologyTable: valores por tipologia */
export function TypologyTable(props: TypologyTableProps) {
  var tr = useI18n().tr;
  var rows = props.rows || TYPOLOGIES.map(function (c) { return { label: c, value: 'common.placeholderPerM2' }; });
  return h('div', { className: cx('pr-table', props.className) }, [
    h(Text, { key: 't', variant: 'body-strong', as: 'p' }, props.title || 'zone.byTypology'),
    h('dl', { key: 'd', className: 'pr-table__grid' }, rows.reduce(function (acc, r, i) {
      acc.push(h('dt', { key: 'k' + i, className: 'small' }, tr(r.label)));
      acc.push(h('dd', { key: 'v' + i, className: cx('figure', r.tone && 'pr-text--' + r.tone) }, tr(r.value)));
      return acc;
    }, [] as ReactElement[]))
  ]);
}
