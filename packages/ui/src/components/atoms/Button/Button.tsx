import { h } from '../../../h';
import type { MouseEvent } from 'react';
import type { IconName, Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Icon } from '../Icon';

export interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  iconEnd?: IconName;
  iconOnly?: boolean;
  fullWidth?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: Msg;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  children?: Msg;
  className?: string;
}

/* ---------- Button (atom) ---------- */
export function Button(props: ButtonProps) {
  var tr = useI18n().tr;
  var variant = props.variant || 'primary';
  var size = props.size || 'md';
  var cls = cx('pr-btn', 'label', 'pr-btn--' + variant, 'pr-btn--' + size,
    props.fullWidth && 'pr-btn--full', props.iconOnly && 'pr-btn--icon', props.className);
  var content = [
    props.icon ? h(Icon, { key: 'i', name: props.icon }) : null,
    props.iconOnly ? null : h('span', { key: 't' }, tr(props.children)),
    props.iconEnd ? h(Icon, { key: 'e', name: props.iconEnd }) : null
  ];
  if (props.href && !props.disabled) {
    return h('a', { className: cls, href: props.href, onClick: props.onClick, 'aria-label': props.iconOnly ? tr(props.ariaLabel) : undefined }, content);
  }
  return h('button', {
    className: cls, type: props.type || 'button', disabled: props.disabled,
    onClick: props.onClick, 'aria-label': tr(props.ariaLabel)
  }, content);
}
