const createProps = (attrs) => {
  const propsArr = Object.keys(attrs).map((key) => {
    let value = attrs[key];
    value = Array.isArray(value) ? value.join(' ') : value;
    return `${key}="${value}"`;
  });
  return propsArr.join(' ');
};

export const createElement = (tagName, attrs = {}, inner = '') => {
  const props = createProps(attrs);
  return `<${tagName}${props ? ' ' + props : ''}>${inner}</${tagName}>`;
};

export const createList = (tagName, attrs = {}) => {
  return (inputs, baseAttrs = {}, activeIndex) => {
    const children = inputs.map((elem, i) => {
      const childAttr = {};
      if (i === activeIndex) {
        childAttr.class = ['active'];
      }
      return createElement(
        'li',
        Immutable.mergeDeep(baseAttrs, childAttr),
        elem
      );
    });
    return createElement(tagName, attrs, children.join(''));
  };
};

/**
 * @param  {HTMLElement} html
 * @param  {string} tag
 * @param  {Function} listener
 */
export const addEventListenerTo = (elms, ev, evFn) => {
  if (elms.length) {
    Array.prototype.forEach.call(elms, (el) => {
      el.addEventListener(ev, evFn);
    });
  }
};