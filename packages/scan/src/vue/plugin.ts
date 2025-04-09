import { VueScanCanvas } from '@/canvas';
import { initCanvasContainer } from '@/canvas/render';
import { DevToolsHooks, defaultOptions } from '@/core/constants';
import { createDevToolsHook } from '@/core/hook';
import { VueScanInstrumentation } from '@/core/instrumentation';
import { VueScanStore } from '@/core/store';
import type { Options } from '@/core/types';
import { getComponentName } from '@/core/utils';
import { logger } from '@/utils/logger';
import { type Plugin, getCurrentInstance } from 'vue';

// -----------------------------------

createDevToolsHook();

const VueScanPlugin: Plugin<Partial<Options>> = {
  install(app, customOptions) {
    const options = { ...defaultOptions, ...customOptions };

    if (!options.enabled) {
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

    app.mixin({
      beforeUnmount() {
        // TODO: hook up into global event
        const instance = getCurrentInstance();
        requestIdleCallback(() => instrumentation.delete(instance.uid), { timeout: 1000 });
      },
    });

    setInterval(() => {
      requestIdleCallback(() => instrumentation.garbageCollectElements());
    }, 5000);

    /*
     * onUnmount is available from Vue 3.5.0
     */
    app.onUnmount?.(() => {
      instrumentation.clear();
    });
  },
};

export default VueScanPlugin;
