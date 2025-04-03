import type { Options } from './types';

export const defaultOptions: Options = {
  duration: 600,
  color: 'rgba(65, 184, 131)', // Vue green color
  enabled: true,
  includeComponents: [],
  excludeComponents: [],
  logToConsole: false,
};

export const DevToolsHooks = {
  APP_INIT: 'app:init',
  APP_UNMOUNT: 'app:unmount',
  COMPONENT_UPDATED: 'component:updated',
  COMPONENT_ADDED: 'component:added',
  COMPONENT_REMOVED: 'component:removed',
  COMPONENT_EMIT: 'component:emit',
  PERFORMANCE_START: 'perf:start',
  PERFORMANCE_END: 'perf:end',
} as const;
