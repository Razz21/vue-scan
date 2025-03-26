import { logger } from '@/utils/logger';
import type { ComponentInternalInstance } from 'vue';
import type { ComponentData } from './types';
import { getComponentElement, getComponentName, isRootComponent } from './utils';

export class VueScanStore {
  private store: Map<number, ComponentData>;

  constructor() {
    this.store = new Map();
  }

  /**
   * Register component for tracking
   */
  private getTrackedInstance(instance: ComponentInternalInstance) {
    const component = this.store.get(instance.uid);
    if (component) {
      return component;
    }

    const el = getComponentElement(instance);
    const name = getComponentName(instance);
    if (!el) {
      logger.error(
        `Failed to track component element for "${name}", received "${el}". Skipping.`
      );
      return;
    }
    const trackedData = {
      name,
      uid: instance.uid,
      el: new WeakRef(el),
      instance: new WeakRef(instance),
      lastUpdated: 0,
      renderCount: 0,
    };
    this.store.set(instance.uid, trackedData);
    return trackedData;
  }

  /**
   * Track component render
   */
  trackRender(instance: ComponentInternalInstance) {
    // skip root component
    if (isRootComponent(instance)) return;

    const data = this.getTrackedInstance(instance);
    if (!data) return;

    const el = data.el.deref();
    if (!el) {
      // Element was garbage collected - clean up this entry
      this.store.delete(instance.uid);
      return;
    }

    // Increment render count
    data.renderCount++;
    data.lastUpdated = performance.now();

    return data;
  }

  /**
   * Get all tracked components
   */
  getStore(): Map<number, ComponentData> {
    return this.store;
  }

  deleteElement(uid: number): boolean {
    return this.store.delete(uid);
  }

  /**
   * Get a specific component by UID
   */
  getInstance(uid: number): ComponentData | undefined {
    return this.store.get(uid);
  }

  /**
   * Clear all tracked components
   */
  clear(): void {
    this.store.clear();
  }
}
