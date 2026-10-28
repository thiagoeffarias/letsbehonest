import { h } from '../../../h';
import type { Msg } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Icon } from '../../atoms/Icon';
import { Label } from '../../atoms/Label';
import { TextInput } from '../../atoms/TextInput';

export interface SearchFieldProps {
  id?: string;
  label?: Msg;
  hideLabel?: boolean;
  placeholder?: Msg;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/* SearchField: pesquisa de zona */
export function SearchField(props: SearchFieldProps) {
  var t = useI18n().t;
  return h('div', { className: cx('pr-search', props.className) }, [
    h('span', { key: 'l', className: props.hideLabel ? 'pr-visually-hidden' : null },
      h(Label, { htmlFor: props.id }, props.label || t('search.label'))),
    h('span', { key: 'b', className: 'pr-search__box' }, [
      h(Icon, { key: 'i', name: 'search', className: 'pr-search__icon' }),
      h(TextInput, {
        key: 'in', id: props.id, className: 'pr-search__input',
        placeholder: props.placeholder || t('search.placeholder'),
        value: props.value, defaultValue: props.defaultValue, onChange: props.onChange
      })
    ])
  ]);
}
