# Vamos ser honestos (Let's be honest)

Nome público do site (chaves `brand.*` nos catálogos i18n). "Preço Real" é o nome de código interno (pacotes `@preco-real/*`, Design System).

Serviço público gratuito: mapa de preços de imóveis em Portugal (MVP), depois extensão de browser. Plano: ver `docs/plan.md`.

## Design de referência (ler antes de implementar qualquer UI)
Leia com a ferramenta Artifact (`action: read`, `path: project/README.md` etc.). Os links são privados da conta do autor.
- Design System (tokens, README): https://claude.ai/artifact/EDp7P1MGidKArz2gZWRGDJ  (ler `project/README.md` e `project/tokens.json`)
- Ecrãs (mapa desktop, mobile, calculadora, metodologia): https://claude.ai/artifact/AGcS1WnvjPrRPQ64Hu9xKP  (ler `project/canvas.json` e cada `project/*.dc.html`)

Regras: usar os tokens (cores, tipografia, espaçamento, raios) em CSS variables; veredictos com palavra + ícone; texto 4.5:1; mobile-first; valores marcados `[...]` nos ecrãs são placeholders, não dados reais.

## Regras de processo do Design System
- Todo o componente visual novo é primeiro desenhado no Design System (Claude Design, com pré-visualização desktop e mobile) e só depois exportado para código em `packages/ui` (`@preco-real/ui`). Nunca criar UI em código sem componente prévio.
- Atomic design: Átomos → Moléculas → Organismos → Templates. Componentes só usam tokens semânticos (`color-*`, `space-*`, `radius-*`, `size-*`, `elevation-*`, classes de tipografia), nunca primitivos nem valores literais.
- Cor de destaque e de ação: vermelho da bandeira (`color-accent`, `color-action-primary`). Teal = dados e apoio. Veredictos = laranja/azul com palavra e ícone.
- O site (`web/`) importa apenas `@preco-real/ui`.

## Modelo de preço
- Modelo v0.2 (Preço de Referência por Acessibilidade), com decisões e factos de 28/10/2026: `docs/modelo-preco-referencia.md`. O site mede o que o rendimento local suporta, não o que o mercado aceita, e diz isso na página. Hipóteses próprias levam selo "hipótese do projeto". Linguagem: "acima da referência", nunca "ilegal"; sem nomes de vendedores.

## i18n (regra obrigatória)
- Nenhum texto de UI literal em componentes ou páginas: tudo usa **stringKeys** (`nav.map`, `meth.title`…) resolvidas por `useI18n().tr/t` a partir de ficheiros em `i18n/<locale>.json`.
- Locales: `pt_pt` (default, BCP47 `pt-PT`) e `en`. Fallback para `pt_pt`; chave em falta aparece como `⟦chave⟧` (falha o teste de chaves).
- Números/moedas/percentagens via `{num,f,sign,d}` e chaves `fmt.*`, nunca concatenados à mão.
- Seletor de idioma: dropdown (`LanguageSwitcher`) no Header desktop; no mobile, no menu e no rodapé. Idioma na URL: `/` = pt_pt, `/en/` = en, com `hreflang`.
- Novo texto → adicionar a chave nos dois ficheiros (fonte: Design System `project/i18n/` e `i18n.md`) antes de usar.

## Código (`packages/ui`)
- `@preco-real/ui` (React + TS, tokens CSS, `I18nProvider`, catálogos `pt_pt`/`en`) já exportado do Design System v10; ver `packages/ui/README.md`.
- Verificar com `npm run ui:typecheck`, `npm run ui:test` e `npm run ui:build` na raiz. Os catálogos vivem em `packages/ui/src/i18n/locales/`.

## Modelo e dados
- `packages/model` (`@preco-real/model`): modelo v0.2 em funções puras (testado contra o exemplo do documento: Portugal ≈154 mil €, Lisboa ≈258 mil €). Vetustez = CIMI art. 44 (escalão "41–60 anos" usa 0,60, média de 0,65 e 0,55).
- `data-pipeline`: esquema, junção e cálculo prontos; descarregadores INE/CAOP pendentes de acesso de rede (ver `data-pipeline/README.md`). Nunca preencher dados em falta com valores inventados.
- Dados reais gerados em `web/public/data/` (concelhos.geojson, zonas.json, meta.json) a partir de INE 0012234/0012749/0012600 e CAOP 2025 (+ freguesias.geojson/json); `raw/` não vai para o repositório.
- Backlog, dívida técnica e decisões a rever: `docs/backlog/` (`backlog.md`, `decisoes-a-rever.md`). Registar aí qualquer decisão de modelo ou de dados que mereça confirmação.

## Web (`web/`)
- App estática: mapa MapLibre (concelhos e freguesias), calculadora (compra e renda), metodologia, privacidade; PT/EN por URL. Ver `web/README.md`.
- Comandos na raiz: `npm run web:dev`, `npm run web:build`, `npm run ui:test`, `npm run model:test`.
- Aviso: o mapa real e alguns comportamentos interativos foram feitos em código antes de existirem no Design System (D13); desenhar no Design System antes de evoluir.
- Design System v7.2 e telas v16 reconciliados com o código; o bundle do Design System gera-se com `npm run build:ds -w @preco-real/ui` (dist-ds) e publica-se no artefacto.
