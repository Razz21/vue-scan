import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    ['@razz21/vue-scan/nuxt', {}],
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  vueScan: {
    // options
  },
});