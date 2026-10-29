import { useMemo, useState } from 'react';
import { BottomSheet, LegendScale, MapCanvas, MapToolbar, ZonePanel, useI18n } from '@preco-real/ui';
import { hrefTo } from '../lib/paths';
import { rentZone } from '../lib/rent';
import type { Metric, Msg } from '@preco-real/ui';
import type { Dataset, TypologyKey, Zone } from '../lib/data';
import { periodParts, typologyRecord, useDataset } from '../lib/data';
import { navigate } from '../lib/router';
import type { Route } from '../lib/router';
import { searchZones } from '../lib/search';
import { ChoroplethMap } from '../ChoroplethMap';

const METRICS: Metric[] = ['price', 'change', 'excess'];
const TYPOLOGIES = ['T0', 'T1', 'T2', 'T3', 'T4+'];

/** Painel de renda: mediana de renda da zona e renda que o rendimento local suporta, por tipologia. */
function rentPanelProps(z: Zone, data: Dataset, typology: TypologyKey, route: Route) {
  const rz = rentZone(z, typology, data.meta);
  const calc = `${hrefTo(route.locale, '/calculadora')}?zona=${z.code}&tip=${encodeURIComponent(typology)}&modo=rent`;
  const type = z.level === 'freguesia' ? 'zonekind.parish' : 'zonekind.municipality';
  const base = {
    zone: z.name, mode: 'rent' as const, kind: { k: 'zone.kindShort', p: { type, typ: typology } }, ctaHref: calc,
    methodHref: hrefTo(route.locale, '/metodologia'), source: { k: 'src.zone.rent', p: { period: String(data.meta.rentYear) } },
  };
  if (!rz) return { ...base, state: 'insufficient' as const, reason: 'zone.noRent', parentLabel: 'zone.parentCountry' };
  const x = rz.excess;
  const pct = { num: Math.round(Math.abs(x) * 100), f: 'pct' };
  const none = Math.abs(x) < 0.005;
  const m2 = (n: number) => ({ num: Math.round(n * 100) / 100, f: 'eurM2Month', d: 2 });
  return {
    ...base,
    value: m2(rz.market),
    valueNote: { k: 'zone.valueNote.rent', p: { period: String(data.meta.rentYear) } },
    reference: m2(rz.reference),
    level: rz.verdict,
    excess: none ? 'zone.excessNone' : { k: 'zone.excess', p: { pct: { ...pct, sign: true } } },
    excessNote: none ? 'zone.excessNoneNote' : { k: 'zone.excessNote.rent', p: { pct } },
    rowsTitle: 'zone.byTypologyRef.rent',
    rows: (['T0', 'T1', 'T2', 'T3', 'T4+'] as const).map((t) => ({ label: t, value: m2(rentZone(z, t, data.meta)?.reference ?? 0) })),
  };
}

function zonePanelProps(z: Zone, data: Dataset, typology: TypologyKey, route: Route, rent = false) {
  if (rent) return rentPanelProps(z, data, typology, route);
  const rec = typologyRecord(z, typology);
  const period = { k: 'period.quarter', p: periodParts(data.meta.period) };
  const type = z.level === 'freguesia' ? 'zonekind.parish' : 'zonekind.municipality';
  const calc = `${hrefTo(route.locale, '/calculadora')}?zona=${z.code}&tip=${encodeURIComponent(typology)}`;
  const base = {
    zone: z.name, kind: { k: 'zone.kindShort', p: { type, typ: typology } }, ctaHref: calc,
    methodHref: hrefTo(route.locale, '/metodologia'), source: { k: 'src.zone', p: { period } },
  };
  if (rec.median == null || rec.reference == null) {
    const nat = data.byCode.get('PT');
    const natRec = nat && typologyRecord(nat, typology);
    return { ...base, state: 'insufficient' as const, parentLabel: 'zone.parentCountry', parentValue: natRec?.median != null ? { num: natRec.median, f: 'eurM2' } : undefined };
  }
  const x = rec.excess ?? 0;
  const pct = { num: Math.round(Math.abs(x) * 100), f: 'pct' };
  const none = Math.abs(x) < 0.005;
  const typologies = ['T0', 'T1', 'T2', 'T3', 'T4+'] as const;
  return {
    ...base,
    value: { num: rec.median, f: 'eurM2' },
    valueNote: { k: 'zone.valueNote', p: { period } },
    variation: rec.yoy == null ? undefined : { k: 'zone.variation', p: { pct: { num: Math.round(rec.yoy * 1000) / 10, f: 'pct', sign: true, d: 1 } } },
    variationTone: (rec.yoy ?? 0) < 0 ? ('below' as const) : ('above' as const),
    reference: { num: Math.round(rec.reference), f: 'eurM2' },
    level: rec.verdict ?? 'fair',
    excess: none ? 'zone.excessNone' : { k: 'zone.excess', p: { pct: { ...pct, sign: true } } },
    excessNote: none ? 'zone.excessNoneNote' : { k: 'zone.excessNote', p: { pct } },
    rowsTitle: 'zone.byTypologyRef',
    rows: typologies.map((t) => ({ label: t, value: { num: Math.round(typologyRecord(z, t).reference ?? 0), f: 'eurM2' } })),
  };
}

export function MapPage({ route, compact }: { route: Route; compact: boolean }) {
  const state = useDataset();
  const { t } = useI18n();
  const rent = route.search.get('r') === '1';
  const asked = (METRICS as string[]).includes(route.search.get('m') ?? '') ? (route.search.get('m') as Metric) : 'price';
  // a renda só tem preço e excesso (o INE publica uma única série anual)
  const metric: Metric = rent && asked === 'change' ? 'price' : asked;
  const metricOptions = rent ? [{ value: 'price', label: 'metric.rent' }, { value: 'excess', label: 'metric.excess' }] : undefined;
  const typology = (TYPOLOGIES.includes(route.search.get('t') ?? '') ? route.search.get('t') : 'T2') as TypologyKey;
  const selected = route.search.get('z');
  const [query, setQuery] = useState('');
  const [scale, setScale] = useState<{ low: number; high: number } | null>(null);
  const [api, setApi] = useState<{ zoomIn: () => void; zoomOut: () => void } | null>(null);
  const [snap, setSnap] = useState<'peek' | 'half' | 'full'>('peek');

  const setParams = (patch: Record<string, string | null>) => {
    const q = new URLSearchParams(route.search);
    for (const [k, v] of Object.entries(patch)) (v == null || v === '' ? q.delete(k) : q.set(k, v));
    const s = q.toString();
    navigate(route.path + (s ? '?' + s : ''), { replace: true });
  };
  const select = (code: string) => { setSnap('peek'); setQuery(''); setParams({ z: code }); };

  const hits = useMemo(() => (state.status === 'ready' ? searchZones(state.data, query) : []), [state, query]);

  const legend = (data: Dataset) => {
    void data;
    if (!scale || metric === 'excess') return {};
    const f = metric === 'price' ? (rent ? { f: 'eurM2Month', d: 2 } : { f: 'eurM2' }) : { f: 'pct', d: 1 };
    const v = (n: number) => (metric === 'price' ? (rent ? Math.round(n * 100) / 100 : Math.round(n)) : Math.round(n * 1000) / 10);
    return { low: { num: v(scale.low), ...f }, high: { num: v(scale.high), ...f } };
  };

  if (state.status !== 'ready') {
    return (
      <div className="pr-map-layout">
        <div className="pr-map-layout__main">
          <MapToolbar compact={compact} typology={typology} metric={metric} />
          <MapCanvas app={compact} layers={compact} metric={metric} status={state.status === 'error' ? 'error' : 'loading'} />
        </div>
        <aside className="pr-map-layout__aside"><ZonePanel state="empty" compact={false} badge={false} /></aside>
      </div>
    );
  }
  const data = state.data;
  const zone = selected ? data.byCode.get(selected) ?? null : null;
  const panel = (c: boolean, peek = false) => zone
    ? <ZonePanel compact={c} peek={peek} badge={false} {...(zonePanelProps(zone, data, typology, route, rent) as any)} />
    : <ZonePanel state="empty" compact={c} badge={false} ctaHref={hrefTo(route.locale, '/calculadora')} />;
  const metricLabel = t(rent && metric === 'price' ? 'map.aria.rent' : `map.aria.${metric}`);

  return (
    <div className="pr-map-layout">
      <div className="pr-map-layout__main">
        <MapToolbar
          compact={compact} typology={typology} metric={metric} query={query} suggestions={query.length >= 2 ? hits.map((h) => h.suggestion) : undefined} active={0}
          onQueryChange={setQuery} onSuggestionSelect={(i) => hits[i] && select(hits[i].zone.code)}
          onTypologyChange={(v) => setParams({ t: v === 'T2' ? null : v })} onMetricChange={(m) => setParams({ m: m === 'price' ? null : m })}
          rent={rent} onRentChange={(on) => setParams({ r: on ? '1' : null })} metricOptions={metricOptions}
        />
        <MapCanvas
          app={compact} layers={compact} metric={metric} controls onZoomIn={() => api?.zoomIn()} onZoomOut={() => api?.zoomOut()} onMetricChange={(m) => setParams({ m: m === 'price' ? null : m })} metricOptions={metricOptions}
          surface={<ChoroplethMap data={data} metric={metric} typology={typology} rent={rent} selected={selected} onSelect={select} onScale={setScale} onApi={setApi} ariaLabel={t('map.surfaceAria', { metric: metricLabel })} />}
        >
          <LegendScale metric={metric} compact={compact} title={rent && metric === 'price' ? 'legend.rent.title' : undefined} {...(legend(data) as { low?: Msg; high?: Msg })} />
        </MapCanvas>
      </div>
      <aside className="pr-map-layout__aside">{panel(false)}</aside>
      <div className="pr-map-layout__sheet">
        <BottomSheet snap={zone ? snap : 'peek'} onSnapChange={setSnap}>
          {snap === 'full' && zone ? panel(false) : panel(true, snap === 'peek' && !!zone)}
        </BottomSheet>
      </div>
    </div>
  );
}
