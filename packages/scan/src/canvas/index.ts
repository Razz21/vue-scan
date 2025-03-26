import type { Options } from '@/core/types';

type ActiveRect = {
  el: WeakRef<Element>;
  name: string;
  lastUpdated: number;
  renderCount: number;
  title: string;
  rect?: DOMRect;
};

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

export class VueScanCanvas {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private options: Partial<Options>;
  private activeRects: Map<number, ActiveRect> = new Map();

  constructor(container: HTMLElement, options: Partial<Options> = {}) {
    this.options = options;
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this.resizeCanvas();

    this.boundResizeCanvas = this.resizeCanvas.bind(this);

    window.addEventListener('resize', this.boundResizeCanvas);
  }

  private boundResizeCanvas: () => void;

  public highlight({
    el,
    name,
    uid,
    renderCount,
    lastUpdated,
  }: {
    el: WeakRef<HTMLElement>;
    name: string;
    uid: number;
    renderCount: number;
    lastUpdated: number;
  }) {
    this.activeRects.set(uid, {
      el,
      name,
      lastUpdated,
      renderCount,
      title: `${name} x${renderCount}`,
    });

    if (!this.animationFrameId) {
      this.render();
    }
  }

  public deleteElement(uid: number) {
    this.activeRects.delete(uid);

    if (this.activeRects.size === 0 && this.animationFrameId != null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;

      if (this.canvas && this.ctx) {
        const dpr = getDpr();
        this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
      }
    }
  }

  private resizeCanvas() {
    if (!this.canvas) return;

    const dpr = getDpr();
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    this.canvas.width = displayWidth * dpr;
    this.canvas.height = displayHeight * dpr;

    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;

    if (this.ctx) {
      this.ctx.resetTransform();
      this.ctx.scale(dpr, dpr);
    }
  }

  private render() {
    if (!this.canvas || !this.ctx) return;
    this.animationFrameId = requestAnimationFrame(() => this.render());

    const dpr = getDpr();
    this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);

    const now = performance.now();

    const { duration } = this.options;
    const colorRgb = extractRGB(this.options.color);
    const ctx = this.ctx;

    this.activeRects.forEach((activeElement, uid) => {
      const { el, lastUpdated } = activeElement;
      const timeSinceUpdate = now - lastUpdated;
      const element = el?.deref();

      if (timeSinceUpdate > duration) {
        this.activeRects.delete(uid);
        return;
      }

      if (!element?.isConnected) return;

      if (!activeElement.rect) {
        activeElement.rect = element.getBoundingClientRect();
      }

      this.drawRect({
        ctx,
        color: colorRgb,
        opacity: 1 - timeSinceUpdate / duration,
        rect: activeElement.rect,
        title: activeElement.title,
      });
    });

    if (this.activeRects.size === 0 && this.animationFrameId != null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private drawRect({
    ctx,
    rect,
    color,
    title,
    opacity,
  }: {
    ctx: CanvasRenderingContext2D;
    rect: DOMRect;
    color: string;
    title: string;
    opacity: number;
  }) {
    const { left, top, width, height } = rect;

    // Outline rect
    ctx.fillStyle = `rgba(${color},${opacity * 0.6})`;
    ctx.strokeStyle = `rgba(${color},${opacity})`;
    ctx.lineWidth = 2;
    ctx.fillRect(left, top, width, height);
    ctx.strokeRect(left, top, width, height);

    // Header
    ctx.font = '12px Consolas, monospace';
    const textHeight = 16;

    ctx.fillStyle = `rgba(${color},${Math.min(opacity + 0.2, 0.6)})`;
    ctx.fillRect(left, top - textHeight, width, textHeight);

    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillText(title, left + 4, top - 4);
  }

  public clear() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.canvas?.remove();
    this.canvas = null;
    this.ctx = null;
    this.activeRects.clear();

    window.removeEventListener('resize', this.boundResizeCanvas);
  }
}
