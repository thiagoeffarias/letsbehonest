import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';

export interface LabelProps {
  htmlFor?: string;
  hint?: Msg;
  children?: Msg;
  className?: string;
}

/* ---------- Label (atom) ---------- */
export function Label(props: LabelProps) {
  var tr = useI18n().tr;
  return h('label', { className: cx('pr-label', props.className), htmlFor: props.htmlFor }, [
    h('span', { key: 'l', className: 'body-strong' }, tr(props.children)),
    props.hint ? h('span', { key: 'h', className: 'small pr-text--secondary' }, tr(props.hint)) : null
  ]);
}
