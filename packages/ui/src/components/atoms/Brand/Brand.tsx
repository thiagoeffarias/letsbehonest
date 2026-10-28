import { h } from '../../../h';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';

export interface BrandProps {
  href?: string;
  className?: string;
}

/* Brand: nome do site (traduzido) com a última palavra em destaque */
export function Brand(props: BrandProps) {
  var t = useI18n().t;
  return h('a', { className: cx('pr-brand', 'display-md', props.className), href: props.href || '#', 'aria-label': t('brand.name') }, [
    t('brand.lead') + ' ',
    h('span', { key: 'r', className: 'pr-brand__accent' }, t('brand.accent'))
  ]);
}
