import type { VueScanCanvas } from '@/canvas';
import type { ComponentInternalInstance } from 'vue';
import type { VueScanStore } from './store';
import type { Options } from './types';

export class VueScanInstrumentation {
  constructor(
    private options: Options,
    private store: VueScanStore,
    private canvas: VueScanCanvas
  ) {}

  async track(instance: ComponentInternalInstance): Promise<void> {
    const data = await this.store.trackRender(instance);
    if (!data) return;
    await this.canvas.highlight(data);
  }

  delete(uid: number): void {
    this.store.deleteElement(uid);
    this.canvas.deleteElement(uid);
  }

  clear(): void {
    this.canvas.clear();
    this.store.clear();
  }

  garbageCollectElements(): void {
    this.store.getStore().forEach((data) => {
      const instance = data.instance.deref();
      const el = data.el?.deref();

      if (!(instance && el?.isConnected)) {
        this.delete(data.uid);
      }
    });
  }
}
