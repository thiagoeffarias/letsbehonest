import { h } from '../../../h';
import type { Metric, Suggestion } from '../../../types';
import { cx } from '../../../utils';
import { MetricTabs } from '../../molecules/MetricTabs';
import { SearchField } from '../../molecules/SearchField';
import { SuggestionList } from '../../molecules/SuggestionList';
import { TypologyFilter } from '../../molecules/TypologyFilter';

export interface MapToolbarProps {
  query?: string;
  suggestions?: Suggestion[];
  active?: number;
  searchId?: string;
  typology?: string;
  metric?: Metric;
  compact?: boolean;
  onQueryChange?: (query: string) => void;
  onSuggestionSelect?: (index: number) => void;
  onTypologyChange?: (typology: string) => void;
  onMetricChange?: (metric: Metric) => void;
  className?: string;
}

/* MapToolbar: pesquisa + tipologia + métrica */
export function MapToolbar(props: MapToolbarProps) {
  var searching = props.suggestions || props.query;
  return h('div', { className: cx('pr-toolbar', props.compact && 'pr-toolbar--compact', props.className) }, [
    h('div', { key: 's', className: 'pr-toolbar__search' }, [
      h(SearchField, { key: 'f', id: props.searchId || 'toolbar-search', hideLabel: props.compact, value: props.onQueryChange ? (props.query || '') : undefined, defaultValue: props.onQueryChange ? undefined : props.query, onChange: props.onQueryChange }),
      searching ? h(SuggestionList, { key: 'l', items: props.suggestions || [], query: props.query, active: props.active == null ? 0 : props.active, onSelect: props.onSuggestionSelect }) : null
    ]),
    h(TypologyFilter, { key: 't', value: props.typology, onChange: props.onTypologyChange, size: props.compact ? 'md' : 'sm', scroll: props.compact }),
    props.compact ? null : h(MetricTabs, { key: 'm', value: props.metric, onChange: props.onMetricChange as any })
  ]);
}
