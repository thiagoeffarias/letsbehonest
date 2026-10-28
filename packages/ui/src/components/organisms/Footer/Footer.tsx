import { h } from '../../../h';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Divider } from '../../atoms/Divider';
import { Text } from '../../atoms/Text';
import { Accordion } from '../../molecules/Accordion';
import { LanguageSwitcher } from '../LanguageSwitcher';

export interface FooterProps {
  brandHref?: string;
  mapHref?: string;
  calcHref?: string;
  methodHref?: string;
  privacyHref?: string;
  compact?: boolean;
  className?: string;
}

/* Footer: rodapé de página (compacto em mobile) */
export function Footer(props: FooterProps) {
  var tr = useI18n().tr;
  var link = function (label: string, href?: string) { return h('li', { key: label }, h('a', { href: href || '#', className: 'pr-link label' }, tr(label))); };
  var navLinks = function () { return [link('nav.map', props.mapHref), link('nav.calculator', props.calcHref), link('nav.methodology', props.methodHref), link('nav.privacy', props.privacyHref)]; };
  var sources = h('ul', { key: 'u', className: 'pr-footer__list' }, [link('footer.src.ine', 'https://www.ine.pt'), link('footer.src.bdp', 'https://www.bportugal.pt'), link('footer.src.at', 'https://info.portaldasfinancas.gov.pt'), link('footer.src.dgt', 'https://www.dgterritorio.gov.pt')]);
  var legal = h('div', { key: 'l', className: 'pr-footer__legal' }, [
    h(Text, { key: 'a', variant: 'caption', tone: 'secondary', as: 'p' }, 'footer.legal'),
    h(Text, { key: 'b', variant: 'caption', tone: 'secondary', as: 'p' }, 'footer.version')
  ]);
  var brand = function () { return h('a', { key: 'b', className: 'pr-brand display-md', href: props.brandHref || '#' }, ['Preço ', h('span', { key: 'r', className: 'pr-brand__accent' }, 'Real')]); };
  if (props.compact) {
    return h('footer', { className: cx('pr-footer', 'pr-footer--compact', props.className) }, [
      h('div', { key: 'm', className: 'pr-footer__main' }, [brand(), h(Text, { key: 't', variant: 'small', tone: 'secondary' }, 'footer.missionShort')]),
      h('nav', { key: 'n', 'aria-label': tr('nav.footer') }, h('ul', { className: 'pr-footer__list' }, navLinks())),
      h(LanguageSwitcher, { key: 'lg', variant: 'inline', className: 'pr-footer__lang' }),
      h(Accordion, { key: 'a', title: 'footer.sourcesAndLegal' }, [sources, legal])
    ]);
  }
  return h('footer', { className: cx('pr-footer', props.className) }, [
    h('div', { key: 'm', className: 'pr-footer__main' }, [brand(), h(Text, { key: 't', variant: 'small', tone: 'secondary' }, 'footer.mission')]),
    h('nav', { key: 'n', className: 'pr-footer__cols', 'aria-label': tr('nav.footer') }, [
      h('div', { key: 'a', className: 'pr-footer__col' }, [
        h(Text, { key: 't', variant: 'caption', tone: 'secondary', as: 'p' }, 'footer.navigate'),
        h('ul', { key: 'u', className: 'pr-footer__list' }, navLinks())
      ]),
      h('div', { key: 'b', className: 'pr-footer__col' }, [
        h(Text, { key: 't', variant: 'caption', tone: 'secondary', as: 'p' }, 'common.dataSources'),
        sources
      ])
    ]),
    h(Divider, { key: 'd' }),
    legal
  ]);
}
