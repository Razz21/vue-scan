import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), dts({ rollupTypes: true })],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  base: './',
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: ['offscreen-canvas.worker'],
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, './src/index.ts'),
        nuxt: resolve(__dirname, './src/nuxt/module.ts'),
        plugin: resolve(__dirname, './src/nuxt/plugin.ts'),
      },
      name: 'VueScan',
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'min.js'}`,
    },
    rollupOptions: {
      external: ['vue', 'nuxt', 'nuxt/app', 'nuxt/schema', '@nuxt/kit'],
      output: {
        preserveModules: true,
        globals: {
          vue: 'Vue',
          nuxt: 'Nuxt',
        },
      },
    },
  },
});
