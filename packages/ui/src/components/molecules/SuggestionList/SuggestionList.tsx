import { h } from '../../../h';
import type { Suggestion } from '../../../types';
import { cx } from '../../../utils';
import { useI18n } from '../../../i18n';
import { Icon } from '../../atoms/Icon';

export interface SuggestionListProps {
  items: Suggestion[];
  query?: string;
  active?: number;
  onSelect?: (index: number) => void;
  className?: string;
}

/* SuggestionList: sugestões de pesquisa */
export function SuggestionList(props: SuggestionListProps) {
  var i18n = useI18n();
  var items = props.items || [];
  if (!items.length) {
    return h('div', { className: cx('pr-suggest', 'pr-suggest--empty', props.className), role: 'status' }, [
      h(Icon, { key: 'i', name: 'info' }),
      h('span', { key: 't', className: 'small' }, i18n.t('search.noResults', { q: props.query || '' }))
    ]);
  }
  return h('ul', { className: cx('pr-suggest', props.className), role: 'listbox', 'aria-label': i18n.t('search.suggestions') },
    items.map(function (it, i) {
      return h('li', { key: it.label + it.kind, role: 'option', 'aria-selected': i === props.active, className: cx('pr-suggest__item', i === props.active && 'is-active'), onMouseDown: props.onSelect ? function (e: { preventDefault(): void }) { e.preventDefault(); props.onSelect!(i); } : undefined }, [
        h(Icon, { key: 'i', name: 'map-pin' }),
        h('span', { key: 'l', className: 'body-strong' }, i18n.tr(it.label)),
        h('span', { key: 'k', className: 'small pr-text--secondary' }, i18n.tr(it.kind))
      ]);
    }));
}
