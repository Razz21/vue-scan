import { render } from './render';
import type { ActiveRect } from './types';

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let dpr = 1;

const activeRects: Map<number, Partial<ActiveRect>> = new Map();
let animationFrameId: number | null = null;
let color: string = '65, 184, 131';
let duration = 500;

type Messages =
  | {
      type: 'init';
      canvas: OffscreenCanvas;
      width: number;
      height: number;
      dpr: number;
      color: string;
      duration: number;
    }
  | {
      type: 'highlight';
      rects: Pick<ActiveRect, 'uid' | 'rect' | 'name'>[];
      dpr: number;
    }
  | {
      type: 'resize';
      width: number;
      height: number;
      dpr: number;
    }
  | {
      type: 'delete';
      uid: number;
    }
  | {
      type: 'clear';
    };

const draw = () => {
  if (!canvas || !ctx) return;

  const shouldContinue = render({
    canvas,
    ctx,
    activeRects,
    dpr,
    duration,
    color,
  });

  if (!shouldContinue && animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    return;
  }
  animationFrameId = requestAnimationFrame(draw);
};

addEventListener('message', (event: MessageEvent<Messages>) => {
  const { type } = event.data;

  if (type === 'init') {
    const {
      canvas: offscreenCanvas,
      width,
      height,
      dpr: canvasDpr,
      color: rectColor,
      duration: highlightDuration,
    } = event.data;
    canvas = offscreenCanvas;
    ctx = canvas.getContext('2d');
    dpr = canvasDpr;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    color = rectColor;
    duration = highlightDuration;

    if (ctx) {
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    }
  }

  if (!canvas || !ctx) return;

  if (type === 'highlight') {
    const { rects } = event.data;

    for (let i = 0; i < rects.length; i++) {
      const element = rects[i];
      const outline = {
        ...element,
        renderCount: 1,
        lastUpdated: performance.now(),
        title: `${element.name} x1`,
      };

      const current = activeRects.get(element.uid);
      if (current) {
        current.renderCount = current.renderCount + 1;
        current.title = `${current.name} x${current.renderCount}`;
        current.lastUpdated = performance.now();
        current.rect = element.rect;
      } else {
        activeRects.set(element.uid, outline);
      }
    }

    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(draw);
    }
    return;
  }
  if (type === 'resize') {
    const { width, height, dpr: newDpr } = event.data;
    dpr = newDpr;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    draw();
    return;
  }
  if (type === 'delete') {
    const { uid } = event.data;
    activeRects.delete(uid);
    return;
  }
  if (type === 'clear') {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    activeRects.clear();
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    return;
  }
});
