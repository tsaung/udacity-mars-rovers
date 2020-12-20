import {
  Nav,
  MainTabs,
  Home,
  CurrentRoverInfo,
  Rover,
} from './modules/components.js';
import { addEventListenerTo } from './modules/base.js';

let store = Immutable.Map({
  user: Immutable.Map({ name: 'Student' }),
  apod: '',
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  selected_rover: '',
  current_rover_data: null,
  rovers_data: Immutable.Map({}),
});
// add our markup to the page
const root = document.getElementById('root');

/**
 *
 * @param {Immutable.Map} state
 * @param {Object} newState
 */
const updateStore = (state, newState) => {
  store = Immutable.merge(state, Immutable.Map(newState));
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
  addEventListenerTo(
    document.getElementsByClassName('nav-link'),
    'click',
    (ev) => {
      changeRover(ev.target.innerHTML);
    }
  );
};

// create content
const App = (state) => {
  const { apod, rovers, selected_rover, current_rover_data } = state.toObject();
  const active = selected_rover || 'home';
  const pages = rovers.map((p) => p.toLowerCase());
  const nav = Nav(pages, active, changeRover);
  if (!apod) {
    getImageOfTheDay();
    return `<header><h1>Loading...</h1></header>`;
  }
  return `
        <header>
        <h1>Mars Rovers</h1>
        </header>
        <nav>
          ${nav}
        </nav>
        <main>
            <section>
              ${Rover(current_rover_data)}
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.

// const Nav = (menus) => {
//   const aLinks = createElems(createElem('a', { class: ['nav-link'] }))(menus);
//   const liLinks = createElems(createElem('li', { class: ['nav-item'] }))(
//     aLinks
//   );
//   const navTabs = createElem('ul', { class: ['nav', 'nav-tabs'] });

//   const refactored = navTabs(liLinks.join(''));

//   const list = createElems(createElem('li', { class: ['nav-item'] }))(menus);
//   const result = navTabs(list);
//   return refactored;
// };
// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log(photodate.getDate(), today.getDate());

  console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
    return `<p>Loading...</p>`;
  }

  // check if the photo of the day is actually type video!
  if (apod.image.media_type === 'video') {
    return `
            <p>See today's featured video <a href="${apod.image.url}">here</a></p>
            <p>${apod.image.title}</p>
            <p>${apod.image.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

// ------------------------------------------------------  API CALLS

// Example API call
const changeRover = (name) => {
  getRover(name);
};
const getImageOfTheDay = () => {
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));
};

const getRover = (name) => {
  const existing = store.get('rovers_data').get(name);
  if (existing) {
    updateStore(store, {
      current_rover_data: existing,
      selected_rover: name,
    });
  } else {
    updateStore(store, { selected_rover: name });

    fetch('http://localhost:3000/rovers/' + name)
      .then((res) => res.json())
      .then((roverInfo) => {
        updateStore(store, {
          current_rover_data: roverInfo,
          rovers_data: store.get('rovers_data').set(name, roverInfo),
        });
      });
  }
};
