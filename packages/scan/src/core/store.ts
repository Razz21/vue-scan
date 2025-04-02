import { logger } from '@/utils/logger';
import type { ComponentInternalInstance } from 'vue';
import type { ComponentData } from './types';
import { getComponentElement, getComponentName, isRootComponent } from './utils';

export class VueScanStore {
  private store: Map<number, ComponentData>;

  constructor() {
    this.store = new Map();
  }

  private async getTrackedInstance(instance: ComponentInternalInstance) {
    return new Promise<ComponentData | undefined>((resolve) => {
      const component = this.store.get(instance.uid);
      if (component) {
        return resolve(component);
      }

      const el = getComponentElement(instance);
      const name = getComponentName(instance);
      if (!el?.isConnected) {
        logger.error(
          `Failed to track component element for "${name}", received "${el}". Skipping.`
        );
        return resolve(undefined);
      }
      const trackedData = {
        name,
        uid: instance.uid,
        el: new WeakRef(el),
        instance: new WeakRef(instance),
        lastUpdated: 0,
        renderCount: 0,
        rect: el.getBoundingClientRect(),
      };
      this.store.set(instance.uid, trackedData);
      resolve(trackedData);
    });
  }

  async trackRender(instance: ComponentInternalInstance) {
    if (isRootComponent(instance)) return;

    return await this.getTrackedInstance(instance);
  }

  getStore(): Map<number, ComponentData> {
    return this.store;
  }

  deleteElement(uid: number): boolean {
    return this.store.delete(uid);
  }

  getInstance(uid: number): ComponentData | undefined {
    return this.store.get(uid);
  }

  clear(): void {
    this.store.clear();
  }
}
