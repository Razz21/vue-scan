import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    exclude: ["@razz21/vue-scan"]
  }
});
