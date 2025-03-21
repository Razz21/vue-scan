import { type App, type Plugin, getCurrentInstance, nextTick } from 'vue';
import { cleanupCanvas, initializeCanvas } from '../canvas';
import { DevToolsHooks, defaultOptions } from '../core/constants';
import { componentStore } from '../core/store';
import type { HookHandler, Options } from '../core/types';
import { getComponentName } from '../core/utils';
import { logger } from '../utils/logger';

// -----------------------------------

const VueScanPlugin: Plugin<Options> = {
  install(app: App, customOptions: Options) {
    const options = { ...defaultOptions, ...customOptions };

    if (!options.enabled) return;

    if (!window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      logger.error('__VUE_DEVTOOLS_GLOBAL_HOOK__ not available');
      return;
    }
    const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    hook.on<HookHandler>(DevToolsHooks.COMPONENT_ADDED, (_app, _uid, _parentUid, component) => {
      componentStore.markActive(component);
      if (options.logToConsole) {
        logger.log('COMPONENT_ADDED', getComponentName(component));
      }
    });

    hook.on<HookHandler>(DevToolsHooks.COMPONENT_UPDATED, (_app, _uid, _parentUid, component) => {
      componentStore.markActive(component);
      if (options.logToConsole) {
        logger.log('COMPONENT_UPDATED', getComponentName(component));
      }
    });

    hook.on<HookHandler>(DevToolsHooks.COMPONENT_REMOVED, (_app, uid, _parentUid, component) => {
      /*
       * This hook may not be called at all. Fallbacking to mixin -> beforeUnmount()
       */
      componentStore.delete(uid);
      if (options.logToConsole) {
        logger.log('COMPONENT_REMOVED', getComponentName(component));
      }
    });

    hook.on<HookHandler>(DevToolsHooks.APP_UNMOUNT, (_app, _uid, _parentUid, _component) => {
      if (options.logToConsole) logger.log('APP_UNMOUNT');
    });

    app.mixin({
      beforeUnmount() {
        // TODO: hook up into global event
        const instance = getCurrentInstance();
        componentStore.delete(instance.uid);

        if (options.logToConsole) {
          logger.log('COMPONENT_REMOVED', getComponentName(instance));
        }
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
