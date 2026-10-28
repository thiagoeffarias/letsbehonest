import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';

export interface SourceNoteProps {
  href?: string;
  linkLabel?: Msg;
  children?: Msg;
  className?: string;
}

/* SourceNote: fonte e aviso */
export function SourceNote(props: SourceNoteProps) {
  var tr = useI18n().tr;
  return h('p', { className: cx('pr-source', 'caption', props.className) }, [
    h('span', { key: 't' }, tr(props.children)),
    props.href ? h('span', { key: 'g' }, ' ') : null,
    props.href ? h('a', { key: 'a', href: props.href, className: 'pr-link' }, tr(props.linkLabel || 'common.howWeCalculate')) : null
  ]);
}
