import { createList, createElement } from './base.js';

const createNavList = createList('ul', { class: ['nav'] });
const createImageList = createList('ul', { id: 'gallery' });

/**
 * @param  {Array} menus
 * @param  {String} active
 */
export const Nav = (menus, active = '') => {
  let activeIndex = menus.indexOf(active.toLowerCase());
  const result = createNavList(menus, { class: ['nav-item'] }, activeIndex);
  return result;
};
/**
 *
 * @param {Array} photos
 */
export const ImageGallery = (photos) => {
  if (!photos || !photos.length) {
    return `<h3>No images found</h3>`;
  }
  const images = photos.map((img) =>
    createElement('img', { class: ['rover-image'], src: img })
  );
  const imageList = createImageList(images, {
    class: ['gallery-item'],
  });
  return imageList;
};

export const Main = (state) => {
  const { selected_rover, current_rover_data, apod } = state;
  const Loading = createLoading(apod);
  if (!selected_rover) {
    return Loading('Please select a rover');
  } else {
    return Rover(current_rover_data, selected_rover, Loading);
  }
};

export const createLoading = (apod) => {
  return (text) => {
    const data = apod.image;
    const imageUrl =
      data.media_type === 'image'
        ? data.hdurl
        : 'https://apod.nasa.gov/apod/image/2012/VolcanicConjunction_Sojuel_1500.jpg';
    return `
    <div id="loading">
      <div>
        <h4 class="underline">${text}</h4>
      </div>
      <img src="${imageUrl}"/>
    </div>
  `;
  };
};

export const Rover = (rover, selected_rover, loadingFn) => {
  if (!rover || rover.name.toLowerCase() !== selected_rover) {
    return loadingFn(`Enjoy APOD while loading data for ${selected_rover}...`);
  }
  return `
  <div id="rover">
    <div id="rover-info">
    ${RoverInfo(rover)}
    </div>
    <div>
      <h2 class="underline">Latest Images</h2>
    </div>

    ${ImageGallery(rover.photos)}
  </div>
  `;
};

export const RoverInfo = (infos) => {
  const { name, launch_date, landing_date, status, max_date } = infos;
  const items = [
    `Name: ${name}`,
    `Launch Date:${launch_date}`,
    `Landing Date: ${landing_date}`,
    `Status: ${status}`,
    `Date the most recent photos were taaken: ${max_date}`,
  ];
  return createList('ul')(items);
};
