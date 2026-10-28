Cabeçalho com a marca "Preço **Real**". Em desktop mostra a navegação; com `compact` (mobile) mostra o botão de menu (ícone `menu`, alvo de 44px) que abre o `MobileMenu`. Props: `nav` `[{label,href,current}]`, `compact`, `compactNav` (mantém os links em mobile), `brandHref`, `menuHref`.

- A página atual leva `current` (sublinhado vermelho e `aria-current`).

- Em desktop inclui o `LanguageSwitcher` à direita da navegação (`lang` com as props do seletor, ou `lang={false}` para esconder). Em mobile o idioma muda-se no `MobileMenu`.
