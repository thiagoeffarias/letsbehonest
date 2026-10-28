import { h } from '../../../h';
import type { IconName, Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Icon } from '../Icon';

export interface BadgeProps {
  tone?: "neutral" | "accent" | "support" | "above" | "below";
  icon?: IconName;
  children?: Msg;
  className?: string;
}

/* ---------- Badge (atom) ---------- */
export function Badge(props: BadgeProps) {
  var tr = useI18n().tr;
  var tone = props.tone || 'neutral';
  return h('span', { className: cx('pr-badge', 'caption', 'pr-badge--' + tone, props.className) }, [
    props.icon ? h(Icon, { key: 'i', name: props.icon }) : null,
    h('span', { key: 't' }, tr(props.children))
  ]);
}
