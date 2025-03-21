import type { ComponentInternalInstance, setDevtoolsHook } from 'vue';
import type { DevToolsHooks } from './constants';

type DevToolsHookEvent = (typeof DevToolsHooks)[keyof typeof DevToolsHooks];

type DevToolsHook = Parameters<typeof setDevtoolsHook>[0] & {
  on: <Handler extends Function>(event: DevToolsHookEvent, handler: Handler) => void;
  off: <Handler extends Function>(event: DevToolsHookEvent, handler: Handler) => void;
};

declare global {
  interface Window {
    __VUE_DEVTOOLS_GLOBAL_HOOK__: DevToolsHook;
  }
}

declare module 'vue' {
  interface ComponentInternalInstance {
    setupState: Record<string | symbol, any>;
  }
}

type HookHandlerArgs<T extends ComponentInternalInstance = ComponentInternalInstance> = [
  app: T['appContext']['app'],
  uid: T['uid'],
  parentUid: NonNullable<T['parent']>['uid'] | undefined,
  component: T,
];
export type HookHandler<T extends ComponentInternalInstance = ComponentInternalInstance> = (
  ...args: HookHandlerArgs<T>
) => void;

type PerfHookType = 'init' | 'mount' | 'patch' | 'render' | 'hydrate';

type PerfHookHandlerArgs<T extends ComponentInternalInstance = ComponentInternalInstance> = [
  app: T['appContext']['app'],
  uid: T['uid'],
  component: T,
  type: PerfHookType,
  time: number,
];

export type PerfHookHandler<T extends ComponentInternalInstance = ComponentInternalInstance> = (
  ...args: PerfHookHandlerArgs<T>
) => void;

export interface Options {
  duration?: number; // How long the highlight effect lasts (ms)
  color?: string; // Highlight color
  enabled?: boolean; // Whether highlighting is enabled by default
  includeComponents?: string[]; // Only track these components (if empty, track all)
  excludeComponents?: string[]; // Don't track these components
  logToConsole?: boolean; // Whether to log re-renders to console
}

// Component tracking - store component instances and their render count
export interface ComponentData {
  el?: WeakRef<HTMLElement>;
  instance: WeakRef<ComponentInternalInstance>;
  renderCount: number;
  lastUpdated: number;
  componentName: string;
  componentUid: number;
}
