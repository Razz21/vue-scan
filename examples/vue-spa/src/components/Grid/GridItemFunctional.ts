import { type FunctionalComponent, h } from 'vue';

const GridItemFunctional: FunctionalComponent = (_, { slots }) => {
  return h(
    'div',
    { class: 'grid-item' },
    slots?.default?.()
  );
};
export default GridItemFunctional;
