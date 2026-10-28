import { h } from '../../../h';
import type { NavItem } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Button } from '../../atoms/Button';
import { LanguageSwitcher } from '../LanguageSwitcher';
import type { LanguageSwitcherProps } from '../LanguageSwitcher';

export interface HeaderProps {
  nav?: NavItem[];
  brandHref?: string;
  menuHref?: string;
  compact?: boolean;
  compactNav?: boolean;
  lang?: false | Partial<LanguageSwitcherProps>;
  className?: string;
}

/* Header: marca + navegação + idioma (em mobile, botão de menu) */
export function Header(props: HeaderProps) {
  var tr = useI18n().tr;
  var nav = props.nav || [];
  var menu = props.compact && !props.compactNav;
  return h('header', { className: cx('pr-header', props.compact && 'pr-header--compact', props.className) }, [
    h('a', { key: 'b', className: 'pr-brand display-md', href: props.brandHref || '#' }, [
      'Preço ', h('span', { key: 'r', className: 'pr-brand__accent' }, 'Real')
    ]),
    menu
      ? h(Button, { key: 'm', variant: 'ghost', icon: 'menu', iconOnly: true, ariaLabel: 'common.openMenu', href: props.menuHref || '#' })
      : h('div', { key: 'n', className: 'pr-header__right' }, [
          h('nav', { key: 'n', className: 'pr-header__nav', 'aria-label': tr('nav.main') }, nav.map(function (item) {
            return h('a', {
              key: JSON.stringify(item.label), href: item.href || '#', className: cx('pr-header__link', 'label', item.current && 'is-current'),
              'aria-current': item.current ? 'page' : undefined
            }, tr(item.label));
          })),
          props.lang === false ? null : h(LanguageSwitcher, Object.assign({ key: 'l' }, props.lang || {}))
        ])
  ]);
}
