# web

Site estático (Vite, React, TypeScript, MapLibre). Importa só `@preco-real/ui` (componentes, i18n, tokens) e `@preco-real/model` (cálculo, no navegador).

```bash
npm run web:dev      # a partir da raiz; constrói o @preco-real/ui antes
npm run web:build    # tsc + vite build → web/dist
npm test -w @preco-real/web
```

## Estrutura
- `public/data/`: gerado por `data-pipeline` (concelhos.geojson, freguesias.geojson, zonas.json, freguesias.json, meta.json).
- `src/lib/router.ts`: roteador mínimo (History API). `/` é pt_pt e `/en/…` é inglês; `?z=código&t=T2&m=price` guarda a seleção do mapa na URL.
- `src/lib/result.ts`: transforma o resultado do modelo nas props do `VerdictCard` (compra e renda).
- `src/ChoroplethMap.tsx`: mapa MapLibre sem mapa-base (só as fronteiras da CAOP), cores lidas dos tokens.
- `src/pages/`: mapa, calculadora, metodologia, privacidade, 404.

O cálculo corre no navegador; nada do que o utilizador escreve sai do dispositivo.
