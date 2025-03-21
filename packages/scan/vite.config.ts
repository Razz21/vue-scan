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
  build: {
    target: 'esnext',
    sourcemap: true,
    lib: {
      entry: [resolve(__dirname, 'src/index.ts')],
      name: 'VueScan',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'min.js'}`,
    },
  },
});
