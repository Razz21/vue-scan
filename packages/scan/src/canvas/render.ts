import type { ActiveRect } from './types';

const RECT_STORAGE_TIMEOUT = 1000;

export function render({
  canvas,
  ctx,
  activeRects,
  dpr,
  duration,
  color,
}: {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  activeRects: Map<number, Partial<ActiveRect>>;
  dpr: number;
  duration: number;
  color: string;
}) {
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

  const now = performance.now();

  activeRects.forEach((activeElement, uid) => {
    const { lastUpdated } = activeElement;
    const timeSinceUpdate = now - lastUpdated;

    if (timeSinceUpdate > RECT_STORAGE_TIMEOUT) {
      activeRects.delete(uid);
      return;
    }

    drawRect({
      ctx,
      color,
      opacity: 1 - timeSinceUpdate / duration,
      rect: activeElement.rect,
      title: activeElement.title,
    });
  });

  return activeRects.size > 0;
}

export function drawRect({
  ctx,
  rect,
  color,
  title,
  opacity,
}: {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
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

  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
  ctx.fillText(title, left + 4, top - 4);
}
