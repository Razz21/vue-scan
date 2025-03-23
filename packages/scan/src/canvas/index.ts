import { componentStore } from '@/core/store';
import type { Options } from '@/core/types';

let canvasContainer: HTMLElement | null = null;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number | null = null;

export function initializeCanvas(options: Options) {
  if (canvasContainer) {
    resizeCanvas();
    return;
  }
  canvasContainer = document.createElement('div');
  canvasContainer.id = 'vue-scan-container';
  canvasContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 99999;
  `;

  canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';

  canvasContainer.appendChild(canvas);
  document.body.appendChild(canvasContainer);

  ctx = canvas.getContext('2d');

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);

  startRenderLoop(options);
}

export function resizeCanvas() {
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight;

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;

  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
}

export function startRenderLoop(options: Options) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  let needsRedraw = true;

  function render() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (!canvas || !ctx) return;

    // Only redraw if needed
    if (needsRedraw) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      let hasActiveHighlight = false;

      componentStore.getComponents().forEach((data, uid) => {
        const el = data.el?.deref();
        if (!el?.isConnected) {
          componentStore.delete(uid);
          return;
        }

        const timeSinceUpdate = now - data.lastUpdated;

        // If within highlight duration, draw highlight
        if (timeSinceUpdate <= options.duration) {
          try {
            const rect = el.getBoundingClientRect();

            // Skip elements with zero dimensions
            if (rect.width <= 0 || rect.height <= 0) return;

            const opacity = 1 - timeSinceUpdate / options.duration;
            if (!ctx) return;

            const left = Math.max(0, rect.left);
            const top = Math.max(0, rect.top);
            const width = Math.max(1, rect.width);
            const height = Math.max(1, rect.height);

            // Outline rect
            ctx.fillStyle = options.color.replace(/[\d.]+\)$/, `${opacity * 0.6})`);
            ctx.strokeStyle = options.color.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.lineWidth = 2;
            ctx.fillRect(left, top, width, height);
            ctx.strokeRect(left, top, width, height);

            // Header
            ctx.font = '12px Consolas, monospace';
            const textToDisplay = `${data.componentName} x${data.renderCount}`;
            const textHeight = 16;

            ctx.fillStyle = options.color.replace(/[\d.]+\)$/, `${Math.min(opacity + 0.2, 0.6)})`);
            ctx.fillRect(left, top - textHeight, width, textHeight);

            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fillText(textToDisplay, left + 4, top - 4);

            hasActiveHighlight = true;
          } catch (_error) {
            // Silently ignore rendering errors
            componentStore.delete(uid);
          }
        }
      });

      // Only redraw next frame if we have active highlights
      needsRedraw = hasActiveHighlight;
    } else {
      const now = performance.now();

      componentStore.getComponents().forEach((data) => {
        const el = data.el?.deref();
        if (el?.isConnected) {
          const timeSinceUpdate = now - data.lastUpdated;
          if (timeSinceUpdate <= options.duration) {
            needsRedraw = true;
          }
        }
      });
    }

    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);
}

export function cleanupCanvas() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (canvasContainer && canvasContainer.parentNode) {
    canvasContainer.parentNode.removeChild(canvasContainer);
    canvasContainer = null;
    canvas = null;
    ctx = null;
  }

  window.removeEventListener('resize', resizeCanvas);
}
