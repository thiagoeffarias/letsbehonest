# Backlog

Prioridade: P1 (bloqueia lançamento), P2 (antes de v1), P3 (depois). Tipo: `task`, `debt` (dívida técnica), `strategy`.

## Dados
- [x] Freguesias: 306 com dado próprio + polígonos de 55 concelhos (D11). Falta o zoom no mapa (app `web/`) e a herança visual do concelho.
- [ ] **P2 task** Tabela do Arrendamento Acessível (Portaria 454/2026/1, T0–T5 por concelho). Bloqueio: `files.diariodarepublica.pt` (PDF oficial, 1.ª série n.º 198) e `portaldahabitacao.pt` não resolvem nesta sessão; precisam de ser permitidos. Não usar a imprensa como fonte da tabela (só confirmaria exemplos: Lisboa T0 785 €, Porto T0 652 €).
- [ ] **P3 task** Contagem de transações por concelho: o INE só publica a nível regional (0012787); a supressão do INE faz de proxy (D12). Sem solução oficial conhecida; rever quando o INE alargar.
- [x] CAOP 2025 integrada (D10).
- [ ] **P2 task** Índice de remunerações do INE para a atualização do rendimento (D4).
- [ ] **P3 task** Série trimestral de rendas por concelho (D9).

## Modelo
- [ ] **P1 strategy** Revisão externa por avaliador imobiliário/economista antes do lançamento (documento §7.7).
- [ ] **P2 task** Calibrar `C_q`, `s(A)`, áreas de referência e custo de reabilitação (D7, §9 do modelo).
- [ ] **P2 task** Teste de sensibilidade publicado (σ, esforço, taxa, pesos) em 20 concelhos.
- [ ] **P2 task** Reescrever o exemplo §6 do modelo só com a série de 12 meses (D3).

## Interface e código
- [x] Processo reconciliado (Design System v7.2 e telas v16): `MapControls`, estados do mapa (`status`), props de comportamento documentadas, textos com dados reais, telas novas (mapa a carregar e com erro, sugestões de zona). O bundle do Design System passa a ser gerado do código (`npm run build:ds -w @preco-real/ui`). Falta desenhar o mapa MapLibre em si com o mapa-base/zoom das freguesias em detalhe (o espaço reservado está documentado).
- [ ] **P2 debt** Chunk de 1 MB no `web` (MapLibre): carregar o mapa com `import()` e mostrar o resto da página primeiro.
- [ ] **P2 task** Testes de ponta a ponta (Playwright) do `web`: mapa, pesquisa, calculadora, troca de idioma, mobile; o guião usado na verificação manual está no histórico da sessão.
- [ ] **P2 task** Acessibilidade do mapa: navegação por teclado entre zonas e lista textual equivalente (hoje a pesquisa é a alternativa).
- [ ] **P3 task** Paleta do mapa em tema escuro (as cores são lidas dos tokens ao carregar; não reagem à troca de tema).
- [x] App `web/` (Vite, React, MapLibre): mapa, calculadora (compra e renda), metodologia, privacidade, 404, menu mobile, PT/EN por URL.
- [ ] **P1 task** Deploy estático gratuito (Cloudflare Pages ou GitHub Pages) com `BASE_URL`, redirecionamento SPA (`/en/*`) e cabeçalhos de cache para `/data`.
- [x] `packages/ui` com `noImplicitAny` ligado.
- [ ] **P2 debt** `packages/ui`: `h()` permissivo; dividir `styles.css` por componente.
- [ ] **P2 task** Componente de mapa real (MapLibre) desenhado antes no Design System.
- [ ] **P2 task** Alinhar a prop `EffortMeter.reference` no Design System (era `ref`).
- [ ] **P3 task** Extensão de browser (fase 2).

## Antes do lançamento (placeholders visíveis)
- [ ] **P1 task** `priv.rights.body` ainda mostra "[email]": definir o contacto de privacidade.
- [ ] **P1 task** `common.placeholderPerM2` ("[valor] €/m²") só existe nos ecrãs do Design System; remover da interface se aparecer.
- [ ] **P1 task** `meth.src.rent` cita a Portaria 454/2026/1 como fonte, mas o teto ainda não entra nos cálculos (tabela em falta): ajustar o texto ou integrar a tabela.
- [ ] **P2 task** `meth.draft` ("Rascunho…") sai quando o modelo for revisto por especialista.
