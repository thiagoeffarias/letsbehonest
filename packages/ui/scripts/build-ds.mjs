// Gera dist-ds/ para publicar no artefacto Design System do Claude Design:
// bundle.js (window.PrecoReal), bundle.css, tokens.json e i18n/*.json.
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
execSync('npx vite build -c vite.ds.config.ts', { cwd: root, stdio: 'inherit' });

const names = [];
for (const layer of ['atoms', 'molecules', 'organisms']) {
  for (const d of readdirSync(resolve(root, 'src/components', layer))) names.push(d);
}
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: 'PrecoReal', components: names.map((name) => ({ name })) })} */\n`;
const out = resolve(root, 'dist-ds');
writeFileSync(resolve(out, 'bundle.js'), header + readFileSync(resolve(out, 'bundle.js'), 'utf8'));
mkdirSync(resolve(out, 'i18n'), { recursive: true });
cpSync(resolve(root, 'src/i18n/locales'), resolve(out, 'i18n'), { recursive: true });
cpSync(resolve(root, 'src/tokens.json'), resolve(out, 'tokens.json'));
console.log('dist-ds pronto:', names.length, 'componentes');
