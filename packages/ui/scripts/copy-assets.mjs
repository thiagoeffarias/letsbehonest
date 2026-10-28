// Copia catálogos de idioma para dist/i18n (consumíveis por ferramentas externas).
import { cpSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(resolve(root, 'dist/i18n'), { recursive: true });
cpSync(resolve(root, 'src/i18n/locales'), resolve(root, 'dist/i18n'), { recursive: true });
// o Vite emite o CSS importado em src/index.ts como dist/style.css; expomos como styles.css
const emitted = resolve(root, 'dist/style.css');
if (existsSync(emitted)) renameSync(emitted, resolve(root, 'dist/styles.css'));
