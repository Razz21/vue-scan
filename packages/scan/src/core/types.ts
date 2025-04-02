import type { ComponentInternalInstance } from 'vue';

declare module 'vue' {
  interface ComponentInternalInstance {
    setupState: Record<string | symbol, any>;
  }
}

export interface Options {
  duration: number; // How long the highlight effect lasts (ms)
  color: string; // Highlight color
  enabled: boolean; // Whether highlighting is enabled by default
  includeComponents: string[]; // Only track these components (if empty, track all)
  excludeComponents: string[]; // Don't track these components
  logToConsole: boolean; // Whether to log re-renders to console
}

// Component tracking - store component instances and their render count
export interface ComponentData {
  rect: DOMRect;
  el: WeakRef<HTMLElement>;
  instance: WeakRef<ComponentInternalInstance>;
  renderCount: number;
  lastUpdated: number;
  name: string;
  uid: number;
}
