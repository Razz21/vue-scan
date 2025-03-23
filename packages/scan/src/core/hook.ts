import { logger } from '@/utils/logger';
import type { App, ComponentInternalInstance } from 'vue';
import { DevToolsHooks } from './constants';

export type HookHandlerArgs = [
  app: App,
  uid: number,
  parentUid: number,
  component: ComponentInternalInstance,
];

type PerfHookType = 'init' | 'mount' | 'patch' | 'render' | 'hydrate';

export type PerfHookHandlerArgs = [
  app: App,
  uid: number,
  component: ComponentInternalInstance,
  type: PerfHookType,
  time: number,
];

type AppHookHandlerArgs = [
  app: App,
  version: string,
  { Fragment: any; Text: any; Comment: any; Static: any },
];

interface EventPayloadMap {
  // Component events
  [DevToolsHooks.COMPONENT_ADDED]: HookHandlerArgs;
  [DevToolsHooks.COMPONENT_UPDATED]: HookHandlerArgs;
  [DevToolsHooks.COMPONENT_REMOVED]: HookHandlerArgs;
  [DevToolsHooks.COMPONENT_EMIT]: [app: App, component: ComponentInternalInstance, event: string, params: any[]];
  // App events
  [DevToolsHooks.APP_INIT]: AppHookHandlerArgs;
  [DevToolsHooks.APP_UNMOUNT]: [app: App];
  // Performance
  [DevToolsHooks.PERFORMANCE_START]: PerfHookHandlerArgs;
  [DevToolsHooks.PERFORMANCE_END]: PerfHookHandlerArgs;

  [key: string]: unknown[];
}

type EventHandlerMap = {
  [E in keyof EventPayloadMap]: (...args: EventPayloadMap[E]) => void;
};

type AnyFunction = (...args: any[]) => any;

type DevToolsHook = {
  appRecords: any[];
  enabled?: boolean;
  events: Map<keyof EventPayloadMap, AnyFunction[]>;
  emit: <E extends keyof EventPayloadMap>(event: E, ...payload: EventPayloadMap[E]) => void;
  off: <E extends keyof EventHandlerMap>(event: E, handler: EventHandlerMap[E]) => void;
  on: <E extends keyof EventHandlerMap>(event: E, handler: EventHandlerMap[E]) => void;
  once: <E extends keyof EventHandlerMap>(event: E, handler: EventHandlerMap[E]) => void;
};

declare global {
  interface Window {
    __VUE_DEVTOOLS_GLOBAL_HOOK__: DevToolsHook;
  }
}

export function createDevToolsHook() {
  if (typeof window === 'undefined') {
    logger.error('window is not available');
    return;
  }

  window.__VUE_DEVTOOLS_GLOBAL_HOOK__ ??= {
    appRecords: [],
    enabled: true,
    events: new Map(),
    on(event, handler) {
      if (!this.events.has(event)) this.events.set(event, []);

      this.events.get(event).push(handler);
    },
    once(event, handler) {
      logger.debug('once', event);
      const onceFn = (...args: unknown[]) => {
        handler(...(args as any));
        this.off(event, onceFn);
      };
      this.on(event, onceFn);
    },

    emit(event, ...args) {
      logger.debug('emit', event, args);
      if (this.events.has(event)) this.events.get(event).forEach((fn) => fn(...args));
    },
    off(event, handler) {
      logger.debug('off', event);
      if (!this.events.has(event)) return;

      const handlers = this.events.get(event);
      const index = handlers.indexOf(handler);
      if (index !== -1) handlers.splice(index, 1);
    },
  };
  return window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
