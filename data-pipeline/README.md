# data-pipeline

Transforma dados oficiais em ficheiros estáticos para o mapa (`web/public/data/*.json`).

```
fontes (raw/)  →  normalizar (schema.ts)  →  buildZones (modelo)  →  zones.json + meta.json
```

## Estado
- ✅ Esquema, junção e modelo (`src/schema.ts`, `src/build-zones.ts`); T0..T4+ partilham a mediana da zona (o INE não publica por tipologia ao nível local).
- ✅ INE (`scripts/fetch.sh`, `src/sources/ine.ts`): `0012234` mediana de venda 12 meses (categoria Total, concelhos), `0012749` rendimento mediano declarado (2024), `0012600` renda mediana de novos contratos (2024). A API falha de forma intermitente; o script repete.
- ✅ CAOP 2025 (`scripts/caop_to_geojson.py`): 308 concelhos (≈ 600 KB) → `concelhos.geojson`; freguesias → `freguesias.geojson` (614 polígonos de 55 concelhos) + `freguesias.json` (306 com mediana própria; as outras herdam o concelho).
- ✅ `npm run build:zones` → `web/public/data/zonas.json` + `meta.json` (309 zonas; 4 sem dado por supressão do INE). Testes de sanidade sobre o conjunto gerado.
- ⏳ Teto do Arrendamento Acessível (`files.diariodarepublica.pt` e `portaldahabitacao.pt` bloqueados) e contagem de transações por concelho (o INE só publica a nível regional). Ver `docs/backlog/`.

## Reproduzir
```bash
data-pipeline/scripts/fetch.sh
# CAOP 2025: https://geo2.dgterritorio.gov.pt/caop/CAOP_{Continente,RAA,RAM}_2025-gpkg.zip → raw/caop/2025/{Continente,RAA,RAM}/
pip install geopandas pyogrio shapely pyproj
python3 scripts/caop_to_geojson.py raw/caop/2025 ../web/public/data
npm run build:zones
```

## Fontes e hosts a permitir
| Dado | Fonte | Host |
|---|---|---|
| Mediana de venda €/m² por concelho/NUTS III e tipologia, trimestral | INE, API de indicadores | `www.ine.pt` |
| Rendimento mediano declarado por município | INE, Estatísticas do Rendimento ao Nível Local | `www.ine.pt` |
| Renda mediana de novos contratos €/m² | INE | `www.ine.pt` |
| Limites concelho/freguesia (CAOP) | DGT | `www.dgterritorio.gov.pt` ou `dados.gov.pt` |
| Teto do Arrendamento Acessível (Portaria 454/2026/1) | Diário da República | `diariodarepublica.pt` (ainda inacessível) |

Os códigos dos indicadores do INE ainda têm de ser confirmados contra o catálogo (não os inventamos).

## Próximos passos
1. Tabela da Portaria 454/2026/1 e custo de reabilitação.
2. Rever com especialista de avaliação imobiliária antes do lançamento (parâmetros marcados como hipótese).
