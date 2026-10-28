import { h } from '../../../h';
import type { Msg, Verdict } from '../../../types';
import { cx } from '../../../utils';
import { Icon } from '../../atoms/Icon';
import { Text } from '../../atoms/Text';

export interface VerdictBannerProps {
  verdict: Verdict;
  title?: Msg;
  detail?: Msg;
  className?: string;
}

/* VerdictBanner: níveis face à referência */
const VERDICT_ICON = { below: 'arrow-down', fair: 'check', above: 'arrow-up', inflated: 'arrow-up', disproportionate: 'alert' };
export function VerdictBanner(props: VerdictBannerProps) {
  var v = props.verdict || 'above';
  return h('div', { className: cx('pr-verdict', 'pr-verdict--' + v, props.className), role: 'status' }, [
    h(Icon, { key: 'i', name: VERDICT_ICON[v] || 'arrow-up', size: 'lg' }),
    h('div', { key: 't', className: 'pr-verdict__text' }, [
      h(Text, { key: 'a', variant: 'body-strong', as: 'span', className: 'pr-verdict__title' }, props.title || ('verdict.' + v)),
      props.detail ? h(Text, { key: 'b', variant: 'small', tone: 'secondary', as: 'span' }, props.detail) : null
    ])
  ]);
}
