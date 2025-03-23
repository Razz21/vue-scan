import { createDevToolsHook } from '@/core/hook';
import { type Plugin, getCurrentInstance, nextTick } from 'vue';
import { cleanupCanvas, initializeCanvas } from '../canvas';
import { DevToolsHooks, defaultOptions } from '../core/constants';
import { componentStore } from '../core/store';
import type { Options } from '../core/types';
import { getComponentName } from '../core/utils';
import { logger } from '../utils/logger';

// -----------------------------------

createDevToolsHook();

const VueScanPlugin: Plugin<Partial<Options>> = {
  install(app, customOptions) {
    const options = { ...defaultOptions, ...customOptions };

    if (!options.enabled) return;
    logger.setOptions({ enabled: options.logToConsole });

    if (!window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      logger.error('__VUE_DEVTOOLS_GLOBAL_HOOK__ not available');
      return;
    }
    const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    hook.on(DevToolsHooks.COMPONENT_ADDED, (_app, _uid, _parentUid, component) => {
      componentStore.markActive(component);
      logger.log('COMPONENT_ADDED', getComponentName(component));
    });

    hook.on(DevToolsHooks.COMPONENT_UPDATED, (_app, _uid, _parentUid, component) => {
      componentStore.markActive(component);
      logger.log('COMPONENT_UPDATED', getComponentName(component));
    });

    hook.on(DevToolsHooks.COMPONENT_REMOVED, (_app, uid, _parentUid, component) => {
      /*
       * This hook may not be called at all. Fallbacking to mixin -> beforeUnmount()
       */
      componentStore.delete(uid);
      logger.log('COMPONENT_REMOVED', getComponentName(component));
    });

    hook.on(DevToolsHooks.APP_UNMOUNT, (_app) => {
      if (options.logToConsole) logger.log('APP_UNMOUNT');
    });

    app.mixin({
      beforeUnmount() {
        // TODO: hook up into global event
        const instance = getCurrentInstance();
        componentStore.delete(instance.uid);

        logger.log('COMPONENT_REMOVED', getComponentName(instance));
      },
    });

    nextTick(() => {
      initializeCanvas(options);
    });

    app.onUnmount(() => {
      cleanupCanvas();
    });
  },
};

export default VueScanPlugin;
