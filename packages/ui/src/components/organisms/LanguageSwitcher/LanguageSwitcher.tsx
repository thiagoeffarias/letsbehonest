import { h } from '../../../h';
import type { LanguageOption, Locale } from '../../../types';
import { cx } from '../../../utils';
import { useI18n, languageOptions } from '../../../i18n';
import { Icon } from '../../atoms/Icon';
import { Text } from '../../atoms/Text';
import { ChoiceGroup } from '../../molecules/ChoiceGroup';

export interface LanguageSwitcherProps {
  variant?: "menu" | "inline";
  value?: Locale;
  options?: LanguageOption[];
  open?: boolean;
  onChange?: (locale: Locale) => void;
  className?: string;
}

/* LanguageSwitcher: menu de idioma (desktop) ou chips (menu mobile) */
export function LanguageSwitcher(props: LanguageSwitcherProps) {
  var i = useI18n();
  var value = props.value || i.locale;
  var opts = props.options || languageOptions(i.hrefFor);
  var change = props.onChange || i.setLocale;
  if (props.variant === 'inline') {
    return h('div', { className: cx('pr-lang', 'pr-lang--inline', props.className) }, [
      h(Text, { key: 'l', variant: 'caption', tone: 'secondary', as: 'p' }, 'lang.label'),
      h(ChoiceGroup, { key: 'c', label: 'lang.label', value: value, onChange: change as any, options: opts.map(function (o) { return { value: o.value, label: o.label }; }) })
    ]);
  }
  var cur = opts.filter(function (o) { return o.value === value; })[0] || opts[0];
  return h('details', { className: cx('pr-lang', 'pr-lang--menu', props.className), open: !!props.open }, [
    h('summary', { key: 's', className: 'pr-lang__button label', 'aria-label': i.t('lang.switch') }, [
      h(Icon, { key: 'g', name: 'globe' }),
      h('span', { key: 'c' }, cur.short),
      h(Icon, { key: 'v', name: 'chevron-down', className: 'pr-lang__chev' })
    ]),
    h('ul', { key: 'm', className: 'pr-lang__list', role: 'listbox', 'aria-label': i.t('lang.label') }, opts.map(function (o) {
      return h('li', { key: o.value, role: 'option', 'aria-selected': o.value === value }, h('a', {
        href: o.href || '#', hrefLang: o.tag, lang: o.tag, className: cx('pr-lang__item', 'label', o.value === value && 'is-current'),
        onClick: change ? function (e: { preventDefault(): void }) { e.preventDefault(); change!(o.value); } : undefined
      }, [h('span', { key: 'l' }, i.t(o.label)), o.value === value ? h(Icon, { key: 'c', name: 'check' }) : null]));
    }))
  ]);
}
