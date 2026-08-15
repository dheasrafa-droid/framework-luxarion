import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Luxarion',
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'luxarion.es.js';
        if (format === 'umd') return 'luxarion.umd.js';
        if (format === 'iife') return 'luxarion.global.js';
        return `luxarion.${format}.js`;
      }
    },
    rollupOptions: {
      external: [],
      output: {
        exports: 'named',
        globals: {}
      }
    },
    sourcemap: true,
    minify: 'esbuild'
  }
});
