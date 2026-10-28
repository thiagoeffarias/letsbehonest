import { localePath } from '@preco-real/ui';
import type { Locale } from '@preco-real/ui';

/** Prefixo de implantação (ex.: /preco-real no GitHub Pages; vazio no domínio próprio). */
export const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/** Caminho para usar em `href`: idioma + prefixo de implantação. Para `navigate()` usar `localePath`. */
export const hrefTo = (locale: Locale, page: string) => BASE + localePath(locale, page);
