import { defaultOptions } from '@/core/constants';
import type { Options } from '@/core/types';
import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    vueScan: Options;
  }
  interface PublicRuntimeConfig {
    vueScan?: Options;
  }
}

export default defineNuxtModule<Options>({
  meta: {
    name: '@razz21/vue-scan/nuxt',
    configKey: 'vueScan',
  },
  defaults: {
    ...defaultOptions,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public ||= {};
    nuxt.options.runtimeConfig.public.vueScan = { ...options };

    addPlugin({
      src: resolver.resolve('plugin'),
      mode: 'client',
      name: 'vue-scan-plugin',
    });
  },
});
