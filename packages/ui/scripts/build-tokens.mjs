// Gera dist/tokens.css a partir de src/tokens.json (fonte: Design System no Claude Design).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(resolve(root, 'src/tokens.json'), 'utf8'));
const themes = tokens.color.themes.map((t) => t.id);
const first = themes[0];

const val = (v, theme) => {
  if (v && typeof v === 'object') v = v[theme] ?? v[first];
  return typeof v === 'string' && v.startsWith('{') && v.endsWith('}') ? `var(--${v.slice(1, -1)})` : v;
};

let css = `/* ${tokens.name ?? 'Design System'}: gerado de tokens.json, não editar */\n`;
const themed = [...tokens.color.tokens, ...(tokens.shadow?.tokens ?? [])];
const block = (theme, selector, isFirst) => {
  css += `${selector} {\n`;
  for (const t of themed) {
    if (isFirst || (t.value && typeof t.value === 'object' && theme in t.value)) css += `  --${t.name}: ${val(t.value, theme)};\n`;
  }
  css += '}\n';
};
block(first, `:root, [data-theme="${first}"]`, true);
for (const th of themes.slice(1)) block(th, `[data-theme="${th}"]`, false);

css += ':root {\n';
for (const [fam, data] of Object.entries(tokens)) {
  if (['name', 'version', 'color', 'type', 'shadow'].includes(fam)) continue;
  for (const t of data.tokens) css += `  --${t.name}: ${t.value};\n`;
}
for (const [k, v] of Object.entries(tokens.type.families)) css += `  --font-${k}: ${v};\n`;
css += '}\n';
for (const g of tokens.type.groups) {
  for (const s of g.styles) {
    css += `.${s.name} { font-family: var(--font-${s.family ?? g.family}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight}; }\n`;
  }
}
mkdirSync(resolve(root, 'dist'), { recursive: true });
writeFileSync(resolve(root, 'dist/tokens.css'), css);
console.log('dist/tokens.css', css.length, 'bytes');
