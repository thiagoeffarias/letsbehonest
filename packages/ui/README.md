# @preco-real/ui

Design System do Preço Real em código: tokens CSS, 41 componentes React + TypeScript e catálogos de idioma (`pt_pt`, `en`). Exportado do Design System no Claude Design (ver `CLAUDE.md`); o site (`web/`) importa só este pacote.

## Uso

```tsx
import '@preco-real/ui/tokens.css';
import '@preco-real/ui/styles.css';
import { I18nProvider, Header, LanguageSwitcher, languageOptions, localePath } from '@preco-real/ui';

<I18nProvider locale="pt_pt">
  <Header nav={[{ label: 'nav.map', href: '/', current: true }]} />
</I18nProvider>
```

- Todo o texto passa por **stringKeys** (`"calc.title.buy"`). As props de texto (`title`, `label`, `children`…) aceitam chave, `{ k, p }`, número formatado `{ num, f }` ou dado dinâmico. Ver `I18N.md`.
- `useI18n()` devolve `{ locale, t, tr, fmt }`. Idioma por defeito `pt_pt`; chave em falta mostra `⟦chave⟧`.
- Idioma na URL: `localeFromPath`, `localePath`, `htmlLang`; `languageOptions(hrefFor)` gera as opções do `LanguageSwitcher` a partir do registo `LOCALES`.
- Catálogos também em `@preco-real/ui/i18n/pt_pt.json` e `en.json`.

## Estrutura

```
src/tokens.json            fonte dos tokens (do Design System) → dist/tokens.css (scripts/build-tokens.mjs)
src/styles.css             CSS dos componentes (só tokens semânticos, sem hex)
src/i18n/                  core, I18nProvider, locales/{pt_pt,en}.json
src/components/{atoms,molecules,organisms}/<Nome>/   <Nome>.tsx + README.md (contrato do componente)
tests/                     paridade de catálogos, chaves usadas existem, render SSR de todos os componentes em pt_pt e en
```

## Scripts
`npm run build` (Vite lib + tipos + tokens.css), `npm run typecheck`, `npm test`.

## Adicionar ou alterar um componente
1. Desenhar/alterar primeiro no Design System (Claude Design), com pré-visualização desktop e mobile.
2. Replicar aqui (`src/components/<camada>/<Nome>/`), com interface `<Nome>Props`, só tokens semânticos e só stringKeys.
3. Adicionar chaves aos dois catálogos, exportar em `src/index.ts`, acrescentar caso em `tests/render.test.ts`.

## Notas da exportação
- A partir deste export o TypeScript é a fonte de verdade do código; o Design System continua a ser a fonte do desenho.
- `EffortMeter`: a prop `ref` do Design System chama-se aqui `reference` (`ref` é reservada pelo React).
- `MapCanvas` é o cartograma esquemático do design; o mapa real (MapLibre) será um componente novo, desenhado antes no Design System.
- O nome "Preço Real" no `Header`/`Footer` não é traduzido (nome próprio).
- Os componentes criam elementos com `h()` (`src/h.ts`, `createElement` com filhos permissivos) para aceitar `Msg`; `noImplicitAny` está desligado nos callbacks herdados do bundle.
