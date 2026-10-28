# Preço Real — mapa gratuito de preços de imóveis em Portugal

## Context
Serviço público gratuito para ajudar compradores a perceber se o preço pedido por um imóvel é realista e quanta margem de negociação existe. Decisões tomadas com o utilizador:
- **MVP = mapa de calor** por zona (sem scraping, só dados oficiais abertos).
- **Fase 2 = extensão de browser** que lê o anúncio que o utilizador já está a ver (Idealista/Imovirtual) e compara com a mediana da zona. Evita scraping server-side e risco legal.
- **Stack = site estático**, sem backend, alojamento gratuito.

O diretório de trabalho (`/home/user`) está vazio: projeto novo (greenfield).

## Fontes de dados (a validar no passo 1)
- **INE** – preço mediano de venda por m² de alojamentos familiares (trimestral, NUTS III/concelho/freguesia quando disponível), por tipologia (apartamento/moradia). API/ficheiros abertos do INE.
- **INE** – valor mediano de avaliação bancária (€/m², mensal, concelho): proxy do preço "pedido/esperado".
- **CAOP (DGT)** – limites administrativos (distrito, concelho, freguesia) em GeoJSON, simplificados para web.
- Opcional: relatórios públicos de preços de pedido (Idealista/Casa Sapo), usados só com atribuição, nunca scraping.

**Margem especulativa** (honestidade metodológica): = (preço de pedido/avaliação mediano − preço de transação mediano) / preço de pedido. É uma *estimativa* derivada de proxies, não uma medida direta; mostrar sempre como "margem de negociação estimada" com aviso e fonte, e não para zonas com amostra pequena.

## Arquitetura
```
/data-pipeline   Python: descarrega INE + CAOP, limpa, junta por código DICO,
                 calcula €/m² por tipologia e margem, exporta GeoJSON/JSON
                 (corrido manualmente ou por GitHub Action trimestral)
/web             Vite + TypeScript + MapLibre GL (tiles OSM/Protomaps ou
                 CARTO gratuito); choropleth por concelho -> freguesia ao fazer zoom
/extension       (Fase 2) Manifest V3; content script lê preço, área, tipologia,
                 localização do DOM do anúncio; compara com o JSON estático do site
```
Hosting: Cloudflare Pages ou GitHub Pages; dados são ficheiros estáticos versionados.

## Passos
0. **Design primeiro (Claude Design = tipo de artefacto "Design")**: (a) criar artefacto *Design System* (cores do choropleth acessíveis, tipografia, espaçamento, componentes: mapa, legenda, painel de zona, seletores, calculadora, avisos de metodologia); (b) criar artefacto *Design* com ecrãs desktop/mobile (mapa, painel de zona, calculadora, metodologia, depois UI da extensão); (c) o utilizador revê e aprova; (d) guardar os links dos artefactos em `CLAUDE.md` do projeto — agentes de implementação leem-nos com `Artifact action:read` e seguem tokens/layouts. Opcional mais tarde: `/design-sync` (DesignSync) para sincronizar a biblioteca de componentes em código com o design system.
1. **Pesquisa/validação de dados**: confirmar quais indicadores INE existem ao nível freguesia/concelho, formato, licença e códigos territoriais. Decide a granularidade final.
2. **Pipeline de dados**: scripts em `data-pipeline/` → `web/public/data/{concelhos,freguesias}.geojson` + `meta.json` (data de atualização, fontes, nº de transações).
3. **Mapa (web)**: choropleth, seletor de tipologia (T0–T4+, apartamento/moradia), seletor métrica (€/m², variação anual, margem estimada), tooltip/painel lateral da zona, pesquisa por morada/concelho, legenda acessível, mobile-first.
4. **Calculadora simples** na UI: introduzir preço, área, zona → "acima/abaixo da mediana" e margem estimada (base para a extensão).
5. **Páginas informativas**: Metodologia, Fontes, Limitações, RGPD (sem cookies/analytics invasivos).
6. **Deploy** gratuito + domínio.
7. **Fase 2 – extensão**: parsers por portal isolados (um ficheiro cada, fáceis de reparar), UI injetada com veredicto, tudo local no browser (sem enviar dados do utilizador).

## Verificação
- Pipeline: testes com `pytest` (junção de códigos, medianas, tratamento de células suprimidas pelo INE); comparar 3–4 concelhos manualmente com o site do INE.
- Web: correr `npm run dev`, abrir com Playwright (já instalado), screenshots desktop/mobile, confirmar choropleth, filtros e tooltip; Lighthouse para performance/acessibilidade.
- Extensão: carregar unpacked em Chromium, testar em anúncios reais e confirmar leitura correta dos campos.

## Riscos
- Granularidade freguesia pode ser escassa em zonas rurais → mostrar "dados insuficientes" e agregar ao nível superior.
- Margem especulativa depende de proxies → comunicar incerteza.
- Parsers da extensão quebram quando os portais mudam o HTML → isolar e testar.
