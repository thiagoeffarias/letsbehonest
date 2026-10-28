import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Metric } from '@preco-real/ui';
import type { Dataset, FeatureCollection, TypologyKey } from './lib/data';
import { metricValue, thresholds, tierOf } from './lib/tiers';

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const ramp = (metric: Metric) => [1, 2, 3, 4, 5].map((i) => css(`--color-${metric === 'excess' ? 'excess' : 'data'}-ramp-${i}`));
const MAINLAND: [number, number, number, number] = [-9.6, 36.9, -6.1, 42.2];

export interface ChoroplethMapProps {
  data: Dataset;
  metric: Metric;
  typology: TypologyKey;
  selected: string | null;
  onSelect: (code: string) => void;
  /** Extremos da escala (para a legenda). */
  onScale?: (range: { low: number; high: number } | null) => void;
  ariaLabel: string;
  /** Entrega os comandos de zoom (ligados ao `MapControls` do Design System). */
  onApi?: (api: { zoomIn: () => void; zoomOut: () => void }) => void;
}

export function ChoroplethMap(props: ChoroplethMapProps) {
  const { data, metric, typology, selected } = props;
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const ready = useRef(false);
  const onSelect = useRef(props.onSelect);
  onSelect.current = props.onSelect;
  // estado mais recente para o `sync`, que vive no efeito de montagem
  const latest = useRef({ painted: null as any, metric, selected });

  // atribui o tom de cada polígono para a métrica e tipologia atuais
  const painted = useMemo(() => {
    const vals = data.concelhos.filter((z) => z.code !== 'PT').map((z) => metricValue(z, metric, typology)).filter((v): v is number => v != null);
    const th = thresholds(vals, metric);
    const tag = (fc: FeatureCollection, byCode: (code: string) => number | null): FeatureCollection => ({
      ...fc,
      features: fc.features.map((f) => ({ ...f, properties: { ...f.properties, tier: tierOf(byCode(f.properties.code), th) } })),
    });
    const valueOf = (code: string) => { const z = data.byCode.get(code); return z ? metricValue(z, metric, typology) : null; };
    return {
      concelhos: tag(data.concelhosGeo, valueOf),
      freguesias: tag(data.freguesiasGeo, valueOf),
      low: vals.length ? Math.min(...vals) : null,
      high: vals.length ? Math.max(...vals) : null,
    };
  }, [data, metric, typology]);

  latest.current = { painted, metric, selected };

  useEffect(() => {
    props.onScale?.(painted.low != null && painted.high != null ? { low: painted.low, high: painted.high } : null);
  }, [painted]);

  useEffect(() => {
    if (!el.current) return;
    const m = new maplibregl.Map({
      container: el.current,
      style: { version: 8, sources: {}, layers: [{ id: 'bg', type: 'background', paint: { 'background-color': css('--color-surface-sunken') } }] },
      bounds: MAINLAND, fitBoundsOptions: { padding: 24 }, minZoom: 4, maxZoom: 13,
      attributionControl: false, dragRotate: false, pitchWithRotate: false, touchPitch: false,
    });
    m.touchZoomRotate.disableRotation();
    props.onApi?.({ zoomIn: () => m.zoomIn(), zoomOut: () => m.zoomOut() });
    m.on('load', () => {
      const noData = css('--color-data-no-data');
      const fill = (metricKey: Metric) => ['match', ['get', 'tier'], 1, ramp(metricKey)[0], 2, ramp(metricKey)[1], 3, ramp(metricKey)[2], 4, ramp(metricKey)[3], 5, ramp(metricKey)[4], noData];
      m.addSource('concelhos', { type: 'geojson', data: latest.current.painted.concelhos as any, promoteId: 'code' });
      m.addSource('freguesias', { type: 'geojson', data: latest.current.painted.freguesias as any, promoteId: 'code' });
      m.addLayer({ id: 'concelhos-fill', type: 'fill', source: 'concelhos', paint: { 'fill-color': fill(latest.current.metric) as any } });
      m.addLayer({ id: 'concelhos-line', type: 'line', source: 'concelhos', paint: { 'line-color': css('--color-surface-page'), 'line-width': 0.6 } });
      m.addLayer({ id: 'freguesias-fill', type: 'fill', source: 'freguesias', minzoom: 8.5, filter: ['==', ['get', 'hasData'], true], paint: { 'fill-color': fill(latest.current.metric) as any } });
      m.addLayer({ id: 'freguesias-line', type: 'line', source: 'freguesias', minzoom: 8.5, paint: { 'line-color': css('--color-surface-page'), 'line-width': 0.5 } });
      for (const s of ['concelhos', 'freguesias']) {
        m.addLayer({
          id: `${s}-selected`, type: 'line', source: s, filter: ['==', ['get', 'code'], ''],
          paint: { 'line-color': css('--color-accent'), 'line-width': 3 }, ...(s === 'freguesias' ? { minzoom: 8.5 } : {}),
        });
      }
      m.on('click', (e) => {
        const fs = m.queryRenderedFeatures(e.point, { layers: ['freguesias-fill', 'concelhos-fill'] });
        const hit = fs.find((f) => f.layer.id === 'freguesias-fill') ?? fs[0];
        if (hit) onSelect.current(String(hit.properties!.code));
      });
      m.on('mousemove', (e) => { m.getCanvas().style.cursor = m.queryRenderedFeatures(e.point, { layers: ['concelhos-fill'] }).length ? 'pointer' : ''; });
      ready.current = true;
      sync();
    });
    map.current = m;
    const sync = () => {
      const mm = map.current;
      if (!mm || !ready.current) return;
      const { painted: pt, metric: mt, selected: sel } = latest.current;
      (mm.getSource('concelhos') as maplibregl.GeoJSONSource).setData(pt.concelhos as any);
      (mm.getSource('freguesias') as maplibregl.GeoJSONSource).setData(pt.freguesias as any);
      const colors = ramp(mt);
      for (const l of ['concelhos-fill', 'freguesias-fill']) mm.setPaintProperty(l, 'fill-color', ['match', ['get', 'tier'], 1, colors[0], 2, colors[1], 3, colors[2], 4, colors[3], 5, colors[4], css('--color-data-no-data')]);
      for (const l of ['concelhos-selected', 'freguesias-selected']) mm.setFilter(l, ['==', ['get', 'code'], sel ?? '']);
    };
    (m as any)._sync = sync;
    return () => { ready.current = false; m.remove(); map.current = null; };
  }, []);

  useEffect(() => { (map.current as any)?._sync?.(); }, [painted, metric, selected]);

  // voa até à zona escolhida (pesquisa ou clique)
  useEffect(() => {
    const m = map.current;
    if (!m || !selected) return;
    const f = [...data.freguesiasGeo.features, ...data.concelhosGeo.features].find((x) => x.properties.code === selected)
      ?? data.concelhosGeo.features.find((x) => x.properties.code === selected.slice(0, 4));
    if (!f) return;
    const b = new maplibregl.LngLatBounds();
    const walk = (c: any): void => { if (typeof c[0] === 'number') b.extend(c as [number, number]); else c.forEach(walk); };
    walk(f.geometry.coordinates);
    m.fitBounds(b, { padding: { top: 60, bottom: 60, left: 60, right: 60 }, maxZoom: 10, duration: 600 });
  }, [selected, data]);

  return <div ref={el} role="application" aria-label={props.ariaLabel} style={{ width: '100%', height: '100%' }} />;
}
