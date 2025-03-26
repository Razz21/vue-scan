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

  track(instance: ComponentInternalInstance): void {
    const data = this.store.trackRender(instance);
    if (data) {
      this.canvas.highlight(data);
    }
  }

  delete(uid: number): void {
    this.store.deleteElement(uid);
    this.canvas.deleteElement(uid);
  }

  clear(): void {
    this.canvas.clear();
    this.store.clear();
  }
}
