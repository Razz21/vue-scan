import { type ComponentInternalInstance, Fragment, type RendererNode } from 'vue';

export function isRootComponent(instance: ComponentInternalInstance) {
  return instance.root === instance;
}
export function _isFragmentComponent(instance: ComponentInternalInstance) {
  return instance.subTree.type === Fragment;
}

export function getComponentName(instance: ComponentInternalInstance): string {
  return instance.type.__name || instance.type.name || 'AnonymousComponent';
}

export function findRootNode(el: RendererNode) {
  let node = el;
  while (!!node && node.nodeType !== Node.ELEMENT_NODE) {
    node = node.parentNode;
  }

  return node as HTMLElement | null;
}

export function getComponentElement(instance: ComponentInternalInstance): HTMLElement | null {
  const el = instance.vnode?.el;

  if (!el) return null;

  // Try different possible paths to the element
  if (el.nodeType === Node.ELEMENT_NODE) {
    return el as HTMLElement;
  }

  // recursively search for the closest DOM element in Fragment or muli-root components
  return findRootNode(el);
}
export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
