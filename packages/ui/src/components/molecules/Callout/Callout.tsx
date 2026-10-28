import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Icon } from '../../atoms/Icon';
import { Text } from '../../atoms/Text';

export interface CalloutProps {
  tone?: "info" | "warning";
  title?: Msg;
  children?: Msg;
  className?: string;
}

/* Callout: explicações e avisos de contexto */
export function Callout(props: CalloutProps) {
  var tr = useI18n().tr;
  var tone = props.tone || 'info';
  return h('div', { className: cx('pr-callout', 'pr-callout--' + tone, props.className), role: tone === 'warning' ? 'alert' : 'note' }, [
    h(Icon, { key: 'i', name: tone === 'warning' ? 'alert' : 'info' }),
    h('div', { key: 'b', className: 'pr-callout__body' }, [
      props.title ? h(Text, { key: 't', variant: 'body-strong', as: 'p' }, props.title) : null,
      h('div', { key: 'c', className: 'small' }, tr(props.children))
    ])
  ]);
}
