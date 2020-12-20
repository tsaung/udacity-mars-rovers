const createProps = (attrs) => {
  const propsArr = Object.keys(attrs).map((key) => {
    let value = attrs[key];
    value = Array.isArray(value) ? value.join(' ') : value;
    return `${key}="${value}"`;
  });
  return propsArr.join(' ');
};

export const createElem = (tagName, baseAttrs = {}) => {
  return (childHTML = '', attrs = {}) => {
    const propertyMap = Immutable.mergeDeep(baseAttrs, attrs);
    if (typeof tagName === 'function') {
      return tagName(childHTML, propertyMap);
    }
    const props = createProps(propertyMap);
    const inner = typeof childHTML === 'function' ? childHTML() : childHTML;
    return `<${tagName}${props ? ' ' + props : ''}>${inner}</${tagName}>`;
  };
};

export const createElems = (baseFn) => {
  return (values) => {
    return values.map((v) => baseFn(v));
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
      addEventListenerTo(el, ev, evFn);
    });
  } else {
    elms.addEventListener(ev, evFn);
  }
};

export const li = createElem('li');
export const ul = createElem('ul');
export const a = createElem('a');
