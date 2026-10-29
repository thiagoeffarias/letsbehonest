import { h } from '../../../h';
import type { Msg, Suggestion } from '../../../types';
import { SuggestionList } from '../../molecules/SuggestionList';
import { cx } from '../../../utils';
import { i18nText } from '../../../i18n';
import { Button } from '../../atoms/Button';
import { Checkbox } from '../../atoms/Checkbox';
import { Select } from '../../atoms/Select';
import { Switch } from '../../atoms/Switch';
import { TextInput } from '../../atoms/TextInput';
import { ChoiceGroup } from '../../molecules/ChoiceGroup';
import { FormField } from '../../molecules/FormField';

export type CalculatorField = 'zone' | 'typology' | 'area' | 'price' | 'condition' | 'age' | 'light';

export interface CalculatorFormProps {
  mode?: "buy" | "rent";
  errors?: { zone?: Msg; area?: Msg; price?: Msg };
  typologies?: string[];
  typology?: string;
  zone?: string;
  area?: string | number;
  price?: string | number;
  condition?: string;
  age?: string;
  light?: boolean;
  advancedOpen?: boolean;
  /** Sugestões de zona sob o campo; `onZoneSelect` recebe o índice escolhido. */
  zoneSuggestions?: Suggestion[];
  onZoneSelect?: (index: number) => void;
  onFieldChange?: (name: CalculatorField, value: string | boolean) => void;
  /** Quem paga: uma pessoa ou casal. Mostra-se na compra e na renda. */
  profile?: 'single' | 'couple';
  onProfileChange?: (profile: 'single' | 'couple') => void;
  onModeChange?: (mode: 'buy' | 'rent') => void;
  onSubmit?: () => void;
  className?: string;
}

/* CalculatorForm: campos da calculadora */
export function CalculatorForm(props: CalculatorFormProps) {
  var rent = props.mode === 'rent';
  var controlled = !!props.onFieldChange;
  var change = function (name: CalculatorField) { return function (v: string | boolean) { if (props.onFieldChange) props.onFieldChange(name, v); }; };
  var val = function (v: string | number | undefined, fallback?: string) { return controlled ? { value: v == null ? (fallback || '') : String(v) } : { defaultValue: v == null ? fallback : String(v) }; };
  var err = props.errors || {};
  var opts = (props.typologies || ['T0', 'T1', 'T2', 'T3', 'typology.t4more']).map(function (x) { return { value: x, label: x }; });
  var cond = ['excellent', 'good', 'fair', 'poor', 'bad', 'ruin'].map(function (k) { return { value: k, label: 'cond.' + k }; });
  var age = ['0_2', '2_8', '9_15', '16_25', '26_40', '41_60', '60plus'].map(function (k) { return { value: k, label: 'age.' + k }; });
  return h('form', { className: cx('pr-calc', props.className), onSubmit: function (e: { preventDefault(): void }) { e.preventDefault(); if (props.onSubmit) props.onSubmit(); }, noValidate: true }, [
    h(ChoiceGroup, { key: 'm', label: 'calc.mode.label', value: rent ? 'rent' : 'buy', onChange: props.onModeChange as any, options: [{ value: 'buy', label: 'calc.mode.buy' }, { value: 'rent', label: 'calc.mode.rent' }] }),
    h('div', { key: 'g', className: 'pr-calc__grid' }, [
      h(FormField, { key: 'z', id: 'calc-zone', label: 'calc.zone', className: 'pr-calc__wide', error: err.zone },
        h('div', { className: 'pr-calc__zone' }, [h(TextInput, Object.assign({ key: 'i', id: 'calc-zone', placeholder: 'calc.zone.placeholder', invalid: !!err.zone, onChange: change('zone') }, val(props.zone))),
          props.zoneSuggestions ? h(SuggestionList, { key: 's', items: props.zoneSuggestions, query: props.zone, active: 0, onSelect: props.onZoneSelect }) : null])),
      h(FormField, { key: 't', id: 'calc-typ', label: 'typology.label' },
        h(Select, Object.assign({ id: 'calc-typ', options: opts, onChange: change('typology') }, val(props.typology, 'T2')))),
      h(FormField, { key: 'a', id: 'calc-area', label: 'calc.area', hint: 'calc.area.hint', error: err.area },
        h(TextInput, Object.assign({ id: 'calc-area', inputMode: 'numeric', placeholder: 'calc.area.placeholder', invalid: !!err.area, onChange: change('area') }, val(props.area)))),
      h(FormField, { key: 'p', id: 'calc-price', label: rent ? 'calc.rent' : 'calc.price', hint: rent ? 'calc.rent.hint' : 'calc.price.hint', className: 'pr-calc__wide', error: err.price },
        h(TextInput, Object.assign({ id: 'calc-price', inputMode: 'numeric', placeholder: rent ? 'calc.rent.placeholder' : 'calc.price.placeholder', invalid: !!err.price, onChange: change('price') }, val(props.price))))
    ]),
    h(Switch, { key: 'pf', id: 'calc-profile', checked: (props.profile || 'couple') === 'couple', onChange: props.onProfileChange ? function (on: boolean) { props.onProfileChange!(on ? 'couple' : 'single'); } : undefined }, rent ? 'calc.profile' : 'calc.profile.buy'),
    h('details', { key: 'd', className: 'pr-calc__more', open: !!props.advancedOpen }, [
      h('summary', { key: 's', className: 'body-strong' }, i18nText('calc.more')),
      h('div', { key: 'b', className: 'pr-calc__grid pr-calc__grid--more' }, [
        h(FormField, { key: 'c', id: 'calc-cond', label: 'calc.condition' },
          h(Select, Object.assign({ id: 'calc-cond', options: cond, onChange: change('condition') }, val(props.condition, 'good')))),
        h(FormField, { key: 'i', id: 'calc-age', label: 'calc.age' },
          h(Select, Object.assign({ id: 'calc-age', options: age, onChange: change('age') }, val(props.age, '9_15')))),
        h('div', { key: 'l', className: 'pr-calc__wide' }, h(Checkbox, Object.assign({ id: 'calc-light', onChange: change('light') }, controlled ? { checked: props.light !== false } : { defaultChecked: props.light !== false }), 'calc.light'))
      ])
    ]),
    h(Button, { key: 'b', variant: 'primary', size: 'lg', type: 'submit', fullWidth: true }, rent ? 'calc.submit.rent' : 'calc.submit.buy')
  ]);
}
