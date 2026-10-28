"""CAOP 2024.1 (DGT) -> concelhos.geojson simplificado em WGS84 + zonas.json (hierarquia).
Uso: python3 scripts/caop_to_geojson.py raw/caop ../web/public/data
Requer: pyogrio, shapely, pyproj.
"""
import glob, json, os, sys
import pyogrio
from shapely import set_precision
from shapely.geometry import mapping

src, out = sys.argv[1], sys.argv[2]
TOL_M = 150  # tolerância de simplificação em metros (CRS projetado)

def layers(pattern_suffix):
    for f in sorted(glob.glob(os.path.join(src, '*', '*.gpkg'))):
        for name, _ in pyogrio.list_layers(f):
            if name.endswith(pattern_suffix) and 'areas' not in name:
                yield f, name

features, meta = [], {}
for f, lay in layers('_municipios'):
    df = pyogrio.read_dataframe(f, layer=lay)
    crs = df.crs
    geo = df.geometry.simplify(TOL_M, preserve_topology=True).to_crs(4326)
    for (_, r), g in zip(df.iterrows(), geo):
        code = str(r['dtmn']).zfill(4)
        g = set_precision(g, 0.0001)
        features.append({
            'type': 'Feature',
            'properties': {'code': code, 'name': r['municipio']},
            'geometry': mapping(g),
        })
        meta[code] = {'code': code, 'level': 'concelho', 'name': r['municipio'], 'parent': 'PT',
                      'district': r['distrito_ilha'], 'nuts3': str(r['nuts3'])}
    print(lay, len(df), crs.to_string() if crs else None)

features.sort(key=lambda x: x['properties']['code'])
os.makedirs(out, exist_ok=True)
with open(os.path.join(out, 'concelhos.geojson'), 'w') as fh:
    json.dump({'type': 'FeatureCollection', 'features': features}, fh, separators=(',', ':'), ensure_ascii=False)
with open(os.path.join('raw', 'concelhos_meta.json'), 'w') as fh:
    json.dump(sorted(meta.values(), key=lambda m: m['code']), fh, ensure_ascii=False)
# freguesias: geometria completa em raw/ (o cli.ts escolhe as que vão para o site)
ffeat, fmeta = [], []
for f, lay in layers('_freguesias'):
    df = pyogrio.read_dataframe(f, layer=lay)
    geo = df.geometry.simplify(TOL_M / 2, preserve_topology=True).to_crs(4326)
    for (_, r), g in zip(df.iterrows(), geo):
        code = str(r['dtmnfr']).zfill(6)
        ffeat.append({'type': 'Feature', 'properties': {'code': code, 'name': r['freguesia'], 'concelho': code[:4]},
                      'geometry': mapping(set_precision(g, 0.0001))})
        fmeta.append({'code': code, 'level': 'freguesia', 'name': r['freguesia'], 'parent': code[:4]})
    print(lay, len(df))
with open(os.path.join('raw', 'freguesias_all.geojson'), 'w') as fh:
    json.dump({'type': 'FeatureCollection', 'features': ffeat}, fh, separators=(',', ':'), ensure_ascii=False)
with open(os.path.join('raw', 'freguesias_meta.json'), 'w') as fh:
    json.dump(fmeta, fh, ensure_ascii=False)
print(len(features), 'concelhos', os.path.getsize(os.path.join(out, 'concelhos.geojson')) // 1024, 'KB')
