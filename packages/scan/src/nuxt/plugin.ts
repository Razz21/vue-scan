import { VueScanCanvas } from '@/canvas';
import { initCanvasContainer } from '@/canvas/render';
import { DevToolsHooks } from '@/core/constants';
import { VueScanInstrumentation } from '@/core/instrumentation';
import { VueScanStore } from '@/core/store';
import { getComponentName } from '@/core/utils';
import { logger } from '@/utils/logger';
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import { getCurrentInstance } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  const options = useRuntimeConfig().public.vueScan;

  if (!options?.enabled) {
    return;
  }

  logger.setOptions({ enabled: options.logToConsole });

  const canvasContainer = initCanvasContainer();
  const canvas = new VueScanCanvas(canvasContainer, options);
  const componentStore = new VueScanStore();
  const instrumentation = new VueScanInstrumentation(options, componentStore, canvas);
  const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
  if (!hook) {
    logger.error('__VUE_DEVTOOLS_GLOBAL_HOOK__ not available');
    instrumentation.clear();
    return;
  }

  hook.on(DevToolsHooks.COMPONENT_ADDED, (_app, _uid, _parentUid, component) => {
    requestIdleCallback(async () => await instrumentation.track(component));
    logger.log('COMPONENT_ADDED', getComponentName(component));
  });

  hook.on(DevToolsHooks.COMPONENT_UPDATED, (_app, _uid, _parentUid, component) => {
    requestIdleCallback(async () => await instrumentation.track(component));
    logger.log('COMPONENT_UPDATED', getComponentName(component));
  });

  hook.on(DevToolsHooks.COMPONENT_REMOVED, (_app, uid, _parentUid, component) => {
    /*
     * This hook may not be called at all. Fallbacking to mixin -> beforeUnmount()
     */
    requestIdleCallback(() => instrumentation.delete(uid), { timeout: 1000 });
    logger.log('COMPONENT_REMOVED', getComponentName(component));
  });

  hook.on(DevToolsHooks.APP_UNMOUNT, (_app) => {
    logger.log('APP_UNMOUNT');
  });

  nuxtApp.vueApp.mixin({
    beforeUnmount() {
      // TODO: hook up into global event
      const instance = getCurrentInstance();
      requestIdleCallback(() => instrumentation.delete(instance.uid), { timeout: 1000 });
    },
  });

  setInterval(() => {
    requestIdleCallback(() => instrumentation.garbageCollectElements());
  }, 5000);

  nuxtApp.hook('app:error', () => {
    // TODO: clear instrumentation before app destroy
    instrumentation.clear();
  });
});
