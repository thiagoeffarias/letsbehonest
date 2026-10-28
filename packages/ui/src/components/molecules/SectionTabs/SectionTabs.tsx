import { h } from '../../../h';
import type { Msg, SectionTab } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';

export interface SectionTabsProps {
  label?: Msg;
  items: SectionTab[];
  className?: string;
}

/* SectionTabs: chips fixos no topo com âncoras da página */
export function SectionTabs(props: SectionTabsProps) {
  var i = useI18n();
  return h('nav', { className: cx('pr-sectiontabs', props.className), 'aria-label': props.label ? i.tr(props.label) : i.t('nav.page') },
    (props.items || []).map(function (it) {
      return h('a', { key: JSON.stringify(it.label), href: it.href || ('#' + it.id), className: cx('pr-sectiontabs__item', 'label', it.current && 'is-current'), 'aria-current': it.current ? 'true' : undefined }, i.tr(it.label));
    }));
}
