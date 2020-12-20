import { ul, li, a, createElem } from './base.js';

export const CurrentRoverInfo = (detail) => {
  if (!detail) {
    return `<h3>Please select a rover to reveal detail infos</h3>`;
  } else {
    return `<h3>Currently selected rover: ${detail}`;
  }
};
/**
 * @param  {Array} menus
 * @param  {String} active
 */
export const Nav = (menus, active = '') => {
  const defaultLinkClasses = ['nav-link'];

  const result = menus.map((m) => {
    const linkClasses = [...defaultLinkClasses];
    if (active.toLowerCase() === m.toLowerCase()) {
      linkClasses.push('active');
    }
    const link = a(m, {
      id: m + '-tab',
      class: linkClasses,
      href: `#${m}`,
      role: 'tab',
      'data-toggle': 'tab',
      'aria-controls': m,
    });

    const listItem = li(link, { class: 'nav-item' });
    return listItem;
  });

  return ul(result.join(''), {
    class: ['nav', 'nav-tabs'],
    id: 'roverTabs',
    role: 'tablist',
  });
};

export const Home = (apod) => {
  if (!apod) {
    return `<p>Loading</p>`;
  } else {
    return `<p>There should be </p>`;
  }
};

export const Rover = (roverInfo) => {
  if (!roverInfo) {
    return `Please select an rover`;
  }
  const dataList = createElem('dl', { class: ['row'] });
  const resultArr = Object.keys(roverInfo).map((key) => {
    return `<dt class="col-sm-3">
    ${key}
    </dt>
    <dd class="col-sm-9">${roverInfo[key]}</dd>`;
  });
  const result = dataList(resultArr.join(''));
  return result;
};
export const RoverInfo = (infos) => {
  const dataList = createElem('dl', { class: ['row'] });
  const resultArr = Object.keys(detail).map((key) => {
    return `<dt class="col-sm-3">
    ${key}
    </dt>
    <dd class="col-sm-9">${detail[key]}</dd>`;
  });
  const result = dataList(resultArr.join(''));
  return result;
};

export const MainTabs = (mapObj) => {
  const tabsArr = Object.keys(mapObj).map((name) => {
    const { active, content } = mapObj[name];
    return createTab(name, active, content);
  });
  return tabsArr.join('');
};

const createTab = (name, isActive, content = '') => {
  const createTabElem = createElem('div', {
    id: name,
    class: ['tab-pane', 'fade', 'show'],
    'aria-labelledby': `${name}-tab`,
  });

  const result = createTabElem(content, { class: isActive ? ['active'] : [] });
  return result;
};
