Seletor de idioma. `variant` omitido: menu (desktop) com botão "PT ▾" e lista de idiomas; `variant="inline"`: chips (menu mobile e rodapé compacto). Props: `value` (por defeito o idioma do `I18n`), `options` `[{value, short, label, tag, href}]`, `onChange(valor)`, `open`.

- Cada opção mostra o nome na própria língua e leva `hreflang`. O idioma atual tem visto e fundo suave.
- Por defeito `pt_pt`. Ver "Internacionalização" para as regras de chaves.
