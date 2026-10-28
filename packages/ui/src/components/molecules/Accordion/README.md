Secção recolhível (`details`/`summary`) para reduzir o scroll em mobile. Props: `title`, `meta` (texto curto à direita), `open`, `id` (âncora), `children`.

- O cabeçalho é um alvo de 48px com chevron que roda. O estado aberto/fechado também é lido por leitores de ecrã.
- Em mobile: o primeiro bloco útil abre; o resto fica fechado. Secções críticas (resultado, aviso do modelo) não ficam recolhidas.
