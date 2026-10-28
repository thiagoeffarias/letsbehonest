import { h } from '../../../h';
import type { ReactNode } from 'react';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Icon } from '../../atoms/Icon';
import { Label } from '../../atoms/Label';

export interface FormFieldProps {
  id?: string;
  label?: Msg;
  hint?: Msg;
  error?: Msg;
  children?: ReactNode;
  className?: string;
}

/* FormField: rótulo + controlo + erro */
export function FormField(props: FormFieldProps) {
  var tr = useI18n().tr;
  return h('div', { className: cx('pr-field', props.className) }, [
    h(Label, { key: 'l', htmlFor: props.id, hint: props.hint }, props.label),
    props.children,
    props.error ? h('span', { key: 'e', className: 'pr-field__error small', id: props.id ? props.id + '-error' : undefined },
      [h(Icon, { key: 'i', name: 'alert' }), h('span', { key: 't' }, tr(props.error))]) : null
  ]);
}
