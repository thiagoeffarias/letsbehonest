import { h } from '../../../h';
import type { IconName, Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Text } from '../../atoms/Text';

export interface EmptyStateProps {
  icon?: IconName;
  title?: Msg;
  body?: Msg;
  children?: Msg;
  compact?: boolean;
  actionLabel?: Msg;
  actionHref?: string;
  actionVariant?: "primary" | "secondary" | "ghost";
  className?: string;
}

/* EmptyState: estados vazios, sem dados e 404 */
export function EmptyState(props: EmptyStateProps) {
  var tr = useI18n().tr;
  return h('div', { className: cx('pr-empty', props.className) }, [
    h('span', { key: 'i', className: 'pr-empty__icon' }, h(Icon, { name: props.icon || 'map-pin', size: 'lg' })),
    h(Text, { key: 't', variant: props.compact ? 'body-strong' : 'display-md', as: 'h2' }, props.title),
    (props.body || props.children) ? h('div', { key: 'c', className: 'pr-empty__body' }, tr(props.body || props.children)) : null,
    props.actionLabel ? h(Button, { key: 'a', variant: props.actionVariant || 'secondary', href: props.actionHref || '#' }, props.actionLabel) : null
  ]);
}
