import { h } from '../../../h';
import type { ReactNode } from 'react';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';

export interface BottomSheetProps {
  snap?: "peek" | "half" | "full";
  inline?: boolean;
  onSnapChange?: (snap: 'peek' | 'half' | 'full') => void;
  label?: Msg;
  children?: ReactNode;
  className?: string;
}

/* BottomSheet: folha inferior mobile com três alturas (peek, half, full) */
export function BottomSheet(props: BottomSheetProps) {
  var tr = useI18n().tr;
  return h('section', { className: cx('pr-sheet', 'pr-sheet--' + (props.snap || 'half'), props.inline && 'pr-sheet--inline', props.className), 'aria-label': tr(props.label || 'sheet.label') }, [
    h('button', { key: 'h', type: 'button', className: 'pr-sheet__handle', 'aria-label': tr('sheet.label'), onClick: props.onSnapChange ? function () { var cur = props.snap || 'half'; props.onSnapChange!(cur === 'peek' ? 'half' : cur === 'half' ? 'full' : 'peek'); } : undefined }),
    props.children
  ]);
}
