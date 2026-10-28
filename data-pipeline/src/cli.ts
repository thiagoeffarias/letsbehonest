/**
 * Junta os dados em bruto (raw/) e escreve web/public/data/zonas.json + meta.json.
 *   npm run build:zones
 * Descarregar antes: scripts/fetch.sh  e  scripts/caop_to_geojson.py
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildZones } from './build-zones.ts';
import { parseIncome, parseIndicator, parseMedians, parseRents } from './sources/ine.ts';
import type { DatasetMeta, ZoneMeta } from './schema.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const raw = (f: string) => JSON.parse(readFileSync(resolve(root, 'raw', f), 'utf8'));
const out = resolve(root, '../web/public/data');

const PERIOD = process.env.PERIOD ?? '2.º Trimestre de 2026';
/** Atualização do rendimento desde o ano do dado até ao período do preço (hipótese: +5,5%/ano, doc. §6). */
const INCOME_GROWTH = 0.055;

const prices = raw('ine_0012234.json');
const { rows: incomes, year: incomeYear } = parseIncome(raw('ine_0012749.json'));
const { rows: rents, year: rentYear } = parseRents(raw('ine_0012600.json'));
const allMedians = parseMedians(prices, PERIOD);
const medians = allMedians;
const pricePeriodYear = Number(PERIOD.match(/(\d{4})$/)![1]);
const incomeUpdate = Math.pow(1 + INCOME_GROWTH, pricePeriodYear - incomeYear);

const concelhos: ZoneMeta[] = raw('concelhos_meta.json').map((m: any) => ({
  code: m.code, level: 'concelho', name: m.name, parent: 'PT',
}));
const parishMeta: ZoneMeta[] = raw('freguesias_meta.json');
// só as freguesias com mediana própria no INE; as restantes herdam o concelho no mapa
const parishWithData = new Set(allMedians.filter((m) => m.level === 'freguesia' && m.median != null).map((m) => m.code));
const parishes = parishMeta.filter((p) => parishWithData.has(p.code));
const zones: ZoneMeta[] = [{ code: 'PT', level: 'concelho', name: 'Portugal', parent: null }, ...concelhos, ...parishes];

const records = buildZones(zones, medians, incomes, { incomeUpdate, minTransactions: 0 }, rents);

const ind = parseIndicator(prices);
const meta: DatasetMeta = {
  modelVersion: '0.2',
  period: PERIOD,
  generatedAt: new Date().toISOString(),
  incomeYear,
  rentYear,
  sources: [
    { id: 'ine-0012234', name: 'INE: valor mediano das vendas de alojamentos familiares (últimos 12 meses, €/m²)', url: 'https://www.ine.pt/xurl/indx/0012234/PT', retrievedAt: ind.DataUltimoAtualizacao },
    { id: 'ine-0012749', name: 'INE: valor mediano do rendimento bruto declarado por sujeito passivo (€)', url: 'https://www.ine.pt/xurl/indx/0012749/PT', retrievedAt: parseIndicator(raw('ine_0012749.json')).DataUltimoAtualizacao },
    { id: 'ine-0012600', name: 'INE: valor mediano das rendas de novos contratos de arrendamento (€/m²)', url: 'https://www.ine.pt/xurl/indx/0012600/PT', retrievedAt: parseIndicator(raw('ine_0012600.json')).DataUltimoAtualizacao },
    { id: 'dgt-caop-2025', name: 'DGT: Carta Administrativa Oficial de Portugal 2025', url: 'https://www.dgterritorio.gov.pt/cartografia/cartografia-tematica/caop', retrievedAt: '2026-10-28' },
  ],
};

mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, 'zonas.json'), JSON.stringify(records.filter((r) => r.level === 'concelho')));
writeFileSync(resolve(out, 'freguesias.json'), JSON.stringify(records.filter((r) => r.level === 'freguesia')));

// geometria: freguesias dos concelhos com pelo menos uma freguesia com dado (as outras ficam com o concelho inteiro)
const concelhosComDados = new Set(parishes.map((p) => p.parent));
const allGeo = raw('freguesias_all.geojson');
const feats = allGeo.features.filter((f: any) => concelhosComDados.has(f.properties.concelho));
for (const f of feats) f.properties.hasData = parishWithData.has(f.properties.code);
writeFileSync(resolve(out, 'freguesias.geojson'), JSON.stringify({ type: 'FeatureCollection', features: feats }));
console.log(`${parishes.length} freguesias com dado em ${concelhosComDados.size} concelhos; ${feats.length} polígonos`);
writeFileSync(resolve(out, 'meta.json'), JSON.stringify({ ...meta, incomeUpdate }, null, 2));
const withRef = records.filter((r) => r.level === 'concelho' && r.typologies[0].reference != null).length;
console.log(`${records.filter((r) => r.level === 'concelho').length} concelhos, ${withRef} com referência, atualização do rendimento ×${incomeUpdate.toFixed(3)}`);
