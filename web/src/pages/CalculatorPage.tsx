import { useEffect, useMemo, useState } from 'react';
import { Button, Callout, CalculatorForm, EmptyState, ParameterPanel, Text, VerdictCard, useI18n } from '@preco-real/ui';
import { hrefTo } from '../lib/paths';
import type { CalculatorField, Msg } from '@preco-real/ui';
import type { AgeBucket, Condition, Typology } from '@preco-real/model';
import type { Zone } from '../lib/data';
import { typologyRecord, useDataset } from '../lib/data';
import type { Route } from '../lib/router';
import { searchZones } from '../lib/search';
import { DEFAULT_USER_PARAMS, buildResult } from '../lib/result';
import type { CalcInput, UserParams } from '../lib/result';

interface Form {
  mode: 'buy' | 'rent'; zoneText: string; zoneCode: string | null; typology: string; area: string; price: string;
  condition: string; age: string; light: boolean;
}

const parse = (s: string) => { const n = Number(s.replace(/\s/g, '').replace(',', '.')); return Number.isFinite(n) && n > 0 ? n : null; };
const toTypology = (v: string): Typology => (v === 'typology.t4more' ? 'T4+' : (v as Typology));

export function CalculatorPage({ route, compact }: { route: Route; compact: boolean }) {
  const state = useDataset();
  const { t } = useI18n();
  const [form, setForm] = useState<Form>({
    mode: route.search.get('modo') === 'rent' ? 'rent' : 'buy', zoneText: '', zoneCode: null,
    typology: route.search.get('tip') === 'T4+' ? 'typology.t4more' : route.search.get('tip') || 'T2',
    area: '', price: '', condition: 'good', age: '9_15', light: true,
  });
  const [errors, setErrors] = useState<{ zone?: Msg; area?: Msg; price?: Msg }>({});
  const [submitted, setSubmitted] = useState<Form | null>(null);
  const [user, setUser] = useState<UserParams>(DEFAULT_USER_PARAMS);

  // zona vinda do mapa (?zona=código)
  const zonaParam = route.search.get('zona');
  useEffect(() => {
    if (state.status === 'ready' && zonaParam) {
      const z = state.data.byCode.get(zonaParam);
      if (z) setForm((f) => ({ ...f, zoneText: z.name, zoneCode: z.code }));
    }
  }, [state.status, zonaParam]);

  const hits = useMemo(
    () => (state.status === 'ready' && form.zoneText.length >= 2 && !form.zoneCode ? searchZones(state.data, form.zoneText) : []),
    [state, form.zoneText, form.zoneCode],
  );

  const onField = (name: CalculatorField, value: string | boolean) => {
    setForm((f) => (name === 'zone' ? { ...f, zoneText: String(value), zoneCode: null } : name === 'light' ? { ...f, light: !!value } : { ...f, [name]: String(value) }));
  };

  const submit = () => {
    if (state.status !== 'ready') return;
    const e: typeof errors = {};
    let code = form.zoneCode;
    if (!code) {
      const exact = searchZones(state.data, form.zoneText).filter((h) => h.zone.name.toLowerCase() === form.zoneText.trim().toLowerCase());
      if (exact.length === 1) code = exact[0].zone.code;
    }
    if (!code) e.zone = form.zoneText ? 'calc.pickZone' : 'calc.error.zone';
    if (!parse(form.area)) e.area = 'calc.error.area';
    if (!parse(form.price)) e.price = 'calc.error.price';
    setErrors(e);
    if (Object.keys(e).length) { setSubmitted(null); return; }
    setForm((f) => ({ ...f, zoneCode: code }));
    setSubmitted({ ...form, zoneCode: code });
  };

  const buy = form.mode === 'buy';
  const title = buy ? 'calc.title.buy' : 'calc.title.rent';
  let right: JSX.Element;
  if (state.status !== 'ready') {
    right = <EmptyState icon={state.status === 'error' ? 'alert' : 'map-pin'} title={state.status === 'error' ? 'map.loadError' : 'map.loading'} compact />;
  } else if (!submitted) {
    right = <EmptyState icon="info" title="calc.empty.title" body="calc.empty.body" />;
  } else {
    const data = state.data;
    const zone = data.byCode.get(submitted.zoneCode!) as Zone;
    const nat = data.byCode.get('PT') ?? null;
    const input: CalcInput = {
      mode: submitted.mode, zone, typology: toTypology(submitted.typology), area: parse(submitted.area)!, asking: parse(submitted.price)!,
      condition: submitted.condition as Condition, age: submitted.age as AgeBucket, light: submitted.light,
    };
    const hasData = submitted.mode === 'buy' ? typologyRecord(zone, input.typology).median != null : zone.rentPerM2 != null;
    const result = hasData ? buildResult(input, data.meta, user, nat) : null;
    if (!result) {
      const natMedian = nat ? typologyRecord(nat, input.typology).median : null;
      const fallback = `${hrefTo(route.locale, '/calculadora')}?zona=PT&tip=${encodeURIComponent(input.typology)}&modo=${submitted.mode}`;
      right = (
        <div className="pr-split__intro">
          <EmptyState
            icon="alert" title={{ k: 'calc.nodata.title', p: { zone: zone.name } }} actionLabel="calc.nodata.action" actionVariant="secondary" actionHref={fallback}
            body={{ k: 'calc.nodata.body', p: { v: natMedian != null ? { num: natMedian, f: 'eurM2' } : '—' } }}
          />
          <Callout tone="warning" title="calc.nodata.cTitle">calc.nodata.cBody</Callout>
        </div>
      );
    } else {
      right = <VerdictCard compact={compact} badge={false} methodHref={hrefTo(route.locale, '/metodologia')} {...(result as any)} />;
    }
  }

  const params = (
    <ParameterPanel
      values={user} onChange={(n, v) => setUser((u) => ({ ...u, [n]: n === 'profile' ? v : Number(v) }))} onReset={() => setUser(DEFAULT_USER_PARAMS)}
    />
  );
  const formEl = (
    <CalculatorForm
      mode={form.mode} zone={form.zoneText} area={form.area} price={form.price} typology={form.typology} condition={form.condition} age={form.age} light={form.light}
      profile={user.profile} onProfileChange={(v) => setUser((u) => ({ ...u, profile: v }))}
      errors={errors} zoneSuggestions={form.zoneText.length >= 2 && !form.zoneCode ? hits.map((h) => h.suggestion) : undefined}
      onZoneSelect={(i) => hits[i] && setForm((f) => ({ ...f, zoneText: hits[i].zone.name, zoneCode: hits[i].zone.code }))}
      onFieldChange={onField} onModeChange={(m) => { setForm((f) => ({ ...f, mode: m })); setSubmitted(null); }} onSubmit={submit}
    />
  );
  void t;
  if (compact) {
    return (
      <main className="pr-stack">
        <Text variant="display-md" as="h1">{title}</Text>
        <Text tone="secondary">calc.intro.short</Text>
        {formEl}
        {submitted ? right : null}
        {params}
      </main>
    );
  }
  return (
    <main className="pr-split">
      <div className="pr-split__intro">
        <Text variant="display-lg" as="h1">{title}</Text>
        <Text tone="secondary">calc.intro</Text>
        {formEl}
        {params}
      </div>
      <div>{right}</div>
    </main>
  );
}
