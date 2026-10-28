import { h } from '../../../h';
import type { NavItem } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { LanguageSwitcher } from '../LanguageSwitcher';

export interface MobileMenuProps {
  nav?: NavItem[];
  brandHref?: string;
  closeHref?: string;
  className?: string;
}

/* MobileMenu: navegação em ecrã inteiro (mobile) */
export function MobileMenu(props: MobileMenuProps) {
  var tr = useI18n().tr;
  var nav = props.nav || [];
  return h('div', { className: cx('pr-menu', props.className), role: 'dialog', 'aria-label': tr('menu.title') }, [
    h('div', { key: 'h', className: 'pr-menu__head' }, [
      h('a', { key: 'b', className: 'pr-brand display-md', href: props.brandHref || '#' }, ['Preço ', h('span', { key: 'r', className: 'pr-brand__accent' }, 'Real')]),
      h(Button, { key: 'c', variant: 'ghost', icon: 'close', iconOnly: true, ariaLabel: 'common.closeMenu', href: props.closeHref || '#' })
    ]),
    h('nav', { key: 'n', className: 'pr-menu__nav', 'aria-label': tr('nav.main') }, nav.map(function (it) {
      return h('a', { key: JSON.stringify(it.label), href: it.href || '#', className: cx('pr-menu__link', 'display-md', it.current && 'is-current'), 'aria-current': it.current ? 'page' : undefined }, tr(it.label));
    })),
    h(LanguageSwitcher, { key: 'lg', variant: 'inline', className: 'pr-menu__lang' }),
    h('div', { key: 'f', className: 'pr-menu__foot' }, [
      h(Text, { key: 'a', variant: 'small', tone: 'secondary' }, 'menu.foot1'),
      h(Text, { key: 'b', variant: 'caption', tone: 'secondary', as: 'p' }, 'menu.foot2')
    ])
  ]);
}
