import { defineConfig } from 'vite';

// Bundle de navegador para o artefacto do Design System (window.PrecoReal, React global).
export default defineConfig({
  build: {
    outDir: 'dist-ds',
    emptyOutDir: true,
    lib: { entry: 'src/index.ts', formats: ['iife'], name: 'PrecoReal', fileName: () => 'bundle.js' },
    rollupOptions: { external: ['react'], output: { globals: { react: 'React' }, assetFileNames: 'bundle.css' } },
    cssCodeSplit: false,
    minify: false,
  },
});
