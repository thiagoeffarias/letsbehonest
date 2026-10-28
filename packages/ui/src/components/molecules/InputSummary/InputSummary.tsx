import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';

export interface InputSummaryProps {
  label?: Msg;
  items?: Msg[];
  editHref?: string;
  className?: string;
}

/* InputSummary: o que foi comparado, com ação de editar */
export function InputSummary(props: InputSummaryProps) {
  var i = useI18n();
  return h('div', { className: cx('pr-summary', props.className) }, [
    h('div', { key: 't', className: 'pr-summary__text' }, [
      h(Text, { key: 'c', variant: 'caption', tone: 'secondary', as: 'span' }, props.label || 'summary.label'),
      h(Text, { key: 'v', variant: 'body-strong', as: 'span' }, (props.items || []).map(function (x) { return i.tr(x); }).join(' · '))
    ]),
    h(Button, { key: 'b', variant: 'secondary', size: 'sm', icon: 'edit', href: props.editHref || '#' }, 'common.edit')
  ]);
}
