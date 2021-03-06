import { Main, Nav } from './modules/components.js';
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

  const nav = document.getElementById('nav');
  if (nav) {
    const addClickHandlerToNav = addEventListenerTo(nav, 'click');
    const removeClickHandlerFromNav = addClickHandlerToNav((ev) => {
      ev.stopPropagation();
      if(ev.target.classList.contains('nav-item')){
        changeRover(ev.target.innerHTML);
      }
    });
  }
};

// create content
const App = (state) => {
  const { apod, rovers, selected_rover, rovers_data } = state.toObject();
  if (!apod) {
    getImageOfTheDay();
    return `<header><h1>Loading...</h1></header>`;
  }
  const current_rover_data = rovers_data.get(selected_rover);
  const active = selected_rover;
  const pages = rovers.map((p) => p.toLowerCase());
  return `
        <header>
        <h1 class="underline">Mars Rovers</h1>
        </header>
        <nav>
          ${Nav(pages, active)}
        </nav>
        <main>
            <section>
              ${Main({ selected_rover, current_rover_data, apod })}
            </section>
        </main>
        <footer>Copyleft <span class="copy-left">&copy;</span> Hello World &#128529;. No Rights Reserved</footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  API CALLS

const changeRover = (name) => {
  const selected_rover = store.get('selected_rover');
  if (selected_rover === name) {
    return;
  }
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
        const rover = { ...roverInfo };
        rover.photos = rover.photos.map((p) => p.img_src);
        updateStore(store, {
          rovers_data: store.get('rovers_data').set(name, rover),
        });
      });
  }
};
