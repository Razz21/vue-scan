import type { ComponentInternalInstance } from 'vue';
import type { ComponentData } from './types';
import { getComponentElement, getComponentName, isRootComponent } from './utils';

export class DataStore {
  private components: Map<number, ComponentData>;

  constructor() {
    this.components = new Map();
  }

  /**
   * Register component for tracking
   */
  trackComponent(instance: ComponentInternalInstance): ComponentData | undefined {
    const el = getComponentElement(instance);
    const componentName = getComponentName(instance);

    if (!this.components.has(instance.uid)) {
      const trackedData = {
        componentName,
        componentUid: instance.uid,
        el: new WeakRef(el),
        instance: new WeakRef(instance),
        lastUpdated: 0,
        renderCount: 0,
      };
      this.components.set(instance.uid, trackedData);
      return trackedData;
    }

    return this.components.get(instance.uid);
  }

  /**
   * Highlight a component on re-render
   */
  markActive(instance: ComponentInternalInstance): void {
    // skip root component
    if (isRootComponent(instance)) return;
    let data = this.components.get(instance.uid);

    if (!data) {
      data = this.trackComponent(instance);
    }

    const el = data.el?.deref();
    if (!el) {
      // Element was garbage collected - clean up this entry
      this.components.delete(instance.uid);
      return;
    }

    // Increment render count
    data.renderCount++;
    data.lastUpdated = performance.now();
  }

  /**
   * Get all tracked components
   */
  getComponents(): Map<number, ComponentData> {
    return this.components;
  }

  delete(uid: number): boolean {
    return this.components.delete(uid);
  }

  /**
   * Get a specific component by UID
   */
  getComponent(uid: number): ComponentData | undefined {
    return this.components.get(uid);
  }

  /**
   * Clear all tracked components
   */
  clear(): void {
    this.components.clear();
  }

  [Symbol.iterator]() {
    return this.components[Symbol.iterator]();
  }
}

// Create a singleton instance
export const componentStore = new DataStore();
