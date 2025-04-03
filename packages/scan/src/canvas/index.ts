import type { ComponentData, Options } from '@/core/types';
import { debounce } from '@/core/utils';
import OffscreenCanvasWorker from './offscreen-canvas.worker?worker&inline';
import type { BatchRect } from './types';

const getDpr = () => {
  return Math.min(window.devicePixelRatio || 1, 2);
};

const extractRGB = (color: string): string => {
  // Extract r, g, b from rgba(r, g, b, a) format
  const match = color.match(/^rgba?\((\d+), (\d+), (\d+)(?:, [0-1](?:\.\d+)?)?\)$/);

  if (!match) {
    throw new Error('Invalid color format');
  }

  // Return the "r,g,b" part as a string
  return `${match[1]},${match[2]},${match[3]}`;
};

const MAX_BATCH_SIZE = 500;

export class VueScanCanvas {
  private canvas: HTMLCanvasElement | null = null;
  private options: Options | undefined;
  private worker: Worker | null = null;

  private batchRaF: number | null = null;
  private batch: BatchRect[] = [];
  private batchSize = 0;

  constructor(container: HTMLElement, options?: Options) {
    this.options = options;
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    `;
    container.appendChild(this.canvas);
    this.resizeCanvas();

    this.worker = new OffscreenCanvasWorker({ name: 'VueScanOffscreenCanvas' });
    const offscreenCanvas = this.canvas.transferControlToOffscreen();

    this.worker?.postMessage(
      {
        type: 'init',
        canvas: offscreenCanvas,
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: getDpr(),
        color: extractRGB(this.options.color),
        duration: this.options.duration,
      },
      [offscreenCanvas]
    );

    this.onResizeCanvas = debounce(() => {
      this.resizeCanvas();

      this.worker?.postMessage({
        type: 'resize',
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: getDpr(),
      });
    }, 100);

    window.addEventListener('resize', this.onResizeCanvas);
  }

  public async highlight({ rect, name, uid }: ComponentData) {
    return await new Promise<void>((resolve) => {
      this.batch.push({
        uid,
        name,
        rect,
      });
      this.batchSize++;

      // If batch size exceeds max size, send and reset
      if (this.batchSize >= MAX_BATCH_SIZE) {
        this.sendBatch();
        return resolve();
      }

      if (!this.batchRaF) {
        this.batchRaF = requestIdleCallback(() => {
          if (this.batchSize > 0) {
            this.sendBatch();
          }
        });
      }
      resolve();
    });
  }

  private onResizeCanvas: () => void;

  /**
   * Send the batch to the worker and reset it.
   */
  private sendBatch() {
    const batch = this.batch;

    this.worker?.postMessage({
      type: 'highlight',
      rects: batch,
    });

    this.batch.length = 0;
    this.batchSize = 0;

    if (this.batchRaF !== null) {
      cancelAnimationFrame(this.batchRaF);
      this.batchRaF = null;
    }
  }

  public deleteElement(uid: number) {
    this.worker.postMessage({
      type: 'delete',
      uid,
    });
  }

  private resizeCanvas() {
    if (!this.canvas) return;

    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
  }

  public clear() {
    this.canvas?.remove();
    this.canvas = null;

    window.removeEventListener('resize', this.onResizeCanvas);

    this.worker?.postMessage({
      type: 'clear',
    });

    this.worker?.terminate();
    this.worker = null;
  }
}
