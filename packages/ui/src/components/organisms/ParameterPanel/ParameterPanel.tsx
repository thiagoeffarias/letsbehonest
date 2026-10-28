import { h } from '../../../h';
import { cx } from '../../../utils';
import { i18nText } from '../../../i18n';
import { Button } from '../../atoms/Button';
import { Select } from '../../atoms/Select';
import { Callout } from '../../molecules/Callout';
import { ChoiceGroup } from '../../molecules/ChoiceGroup';
import { FormField } from '../../molecules/FormField';

export type ParameterField = 'effort' | 'rate' | 'sigma' | 'term' | 'profile';

export interface ParameterPanelProps {
  id?: string;
  open?: boolean;
  /** Valores atuais (percentagens inteiras ou 1 casa decimal; prazo em anos). Sem `onChange` o painel é só demonstrativo. */
  values?: { effort: number; rate: number; sigma: number; term: number; profile: 'single' | 'couple' };
  onChange?: (name: 'effort' | 'rate' | 'sigma' | 'term' | 'profile', value: string) => void;
  onReset?: () => void;
  className?: string;
}

/* ParameterPanel: os seus parâmetros */
export function ParameterPanel(props: ParameterPanelProps) {
  var V = props.values;
  var ctl = function (name: ParameterField, current: number | string | undefined, dflt: string) {
    return props.onChange && V ? { value: String(current), onChange: function (v: string) { props.onChange!(name, v); } } : { defaultValue: dflt };
  };
  var pct = function (arr: number[], d?: number) { return arr.map(function (x) { return { value: String(x), label: { num: x, d: d || 0, f: 'pct' } }; }); };
  return h('details', { id: props.id, className: cx('pr-params', props.className), open: !!props.open }, [
    h('summary', { key: 's', className: 'body-strong' }, i18nText('params.title')),
    h('div', { key: 'b', className: 'pr-params__body' }, [
      h(Callout, { key: 'c', tone: 'info' }, 'params.info'),
      h('div', { key: 'g', className: 'pr-calc__grid' }, [
        h(FormField, { key: 'e', id: 'p-effort', label: 'params.effort', hint: 'params.effort.hint' },
          h(Select, Object.assign({ id: 'p-effort', options: pct([25, 30, 35, 40, 45]) }, ctl('effort', V && V.effort, '30')))),
        h(FormField, { key: 'r', id: 'p-rate', label: 'params.rate' },
          h(Select, Object.assign({ id: 'p-rate', options: pct([2, 3, 4, 5], 1) }, ctl('rate', V && V.rate, '3')))),
        h(FormField, { key: 's', id: 'p-sigma', label: 'params.sigma', hint: 'params.sigma.hint' },
          h(Select, Object.assign({ id: 'p-sigma', options: pct([20, 25, 30, 35]) }, ctl('sigma', V && V.sigma, '30')))),
        h(FormField, { key: 'n', id: 'p-term', label: 'params.term', hint: 'params.term.hint' },
          h(Select, Object.assign({ id: 'p-term', options: [25, 30, 35, 40].map(function (x) { return { value: String(x), label: { k: 'params.years', p: { n: x } } }; }) }, ctl('term', V && V.term, '30'))))
      ]),
      h(ChoiceGroup, { key: 'p', label: 'params.profile', value: V ? V.profile : 'couple', onChange: props.onChange && V ? function (v: string) { props.onChange!('profile', v); } : undefined, options: [{ value: 'single', label: 'params.single' }, { value: 'couple', label: 'params.couple' }] }),
      h(Button, { key: 'x', variant: 'ghost', size: 'sm', onClick: props.onReset }, 'params.reset')
    ])
  ]);
}
