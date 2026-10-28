import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// O site importa só @preco-real/ui; em desenvolvimento aponta para o código-fonte do pacote.
export default defineConfig({
  // GitHub Pages serve em /<repo>/; defina BASE_PATH (ex.: /preco-real/) no build. Domínio próprio: omitir.
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@preco-real\/ui$/, replacement: resolve(__dirname, '../packages/ui/src/index.ts') },
      { find: /^@preco-real\/model$/, replacement: resolve(__dirname, '../packages/model/src/index.ts') },
    ],
  },
  build: { chunkSizeWarningLimit: 1100 },
  test: { environment: 'node' },
});
