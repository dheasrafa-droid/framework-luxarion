import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib' || mode === 'cdn';

  return {
    plugins: isLib ? [] : [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: isLib
      ? {
          outDir: 'dist',
          emptyOutDir: false,
          lib: {
            entry: path.resolve(__dirname, 'src/engine/Luxarion.ts'),
            name: 'Luxarion',
            fileName: (format) => {
              if (format === 'umd') return 'luxarion.umd.js';
              if (format === 'es') return 'luxarion.es.js';
              if (format === 'iife') return 'luxarion.global.js';
              return `luxarion.${format}.js`;
            },
            formats: ['umd', 'es', 'iife'],
          },
          rollupOptions: {
            external: [],
            output: {
              format: 'umd',
              name: 'Luxarion',
              exports: 'named',
              globals: {},
            },
          },
          sourcemap: true,
          minify: 'esbuild',
        }
      : {
          outDir: 'dist',
        },
  };
});
