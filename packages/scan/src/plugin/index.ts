import { VueScanCanvas } from '@/canvas';
import { DevToolsHooks, defaultOptions } from '@/core/constants';
import { createDevToolsHook } from '@/core/hook';
import { VueScanInstrumentation } from '@/core/instrumentation';
import { VueScanStore } from '@/core/store';
import type { Options } from '@/core/types';
import { getComponentName } from '@/core/utils';
import { logger } from '@/utils/logger';
import { type Plugin, getCurrentInstance } from 'vue';

// -----------------------------------

function initCanvasContainer() {
  const canvasContainer = document.createElement('div');
  canvasContainer.id = 'vue-scan-container';
  canvasContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 99999;
  `;
  document.body.appendChild(canvasContainer);

  return canvasContainer;
}

const VueScanPlugin = (customOptions: Partial<Options> = {}): Plugin => {
  const options = { ...defaultOptions, ...customOptions };
  if (!options.enabled)
    return {
      install() {},
    };

  createDevToolsHook();
  logger.setOptions({ enabled: options.logToConsole });

  const canvasContainer = initCanvasContainer();
  const canvas = new VueScanCanvas(canvasContainer, options);
  const componentStore = new VueScanStore();
  const instrumentation = new VueScanInstrumentation(options, componentStore, canvas);

  return {
    install(app) {
      const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
      if (!hook) {
        logger.error('__VUE_DEVTOOLS_GLOBAL_HOOK__ not available');
      }

      hook.on(DevToolsHooks.COMPONENT_ADDED, (_app, _uid, _parentUid, component) => {
        instrumentation.track(component);
        logger.log('COMPONENT_ADDED', getComponentName(component));
      });

      hook.on(DevToolsHooks.COMPONENT_UPDATED, (_app, _uid, _parentUid, component) => {
        instrumentation.track(component);
        logger.log('COMPONENT_UPDATED', getComponentName(component));
      });

      hook.on(DevToolsHooks.COMPONENT_REMOVED, (_app, uid, _parentUid, component) => {
        /*
         * This hook may not be called at all. Fallbacking to mixin -> beforeUnmount()
         */
        instrumentation.delete(uid);
        logger.log('COMPONENT_REMOVED', getComponentName(component));
      });

      hook.on(DevToolsHooks.APP_UNMOUNT, (_app) => {
        logger.log('APP_UNMOUNT');
      });

      app.mixin({
        beforeUnmount() {
          // TODO: hook up into global event
          const instance = getCurrentInstance();
          instrumentation.delete(instance.uid);

          logger.log('COMPONENT_REMOVED', getComponentName(instance));
        },
      });

      /*
       * onUnmount is available from Vue 3.5.0
       */
      app.onUnmount?.(() => {
        instrumentation.clear();
      });
    },
  };
};

export default VueScanPlugin;
