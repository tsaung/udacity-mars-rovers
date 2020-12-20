const fetch = require('node-fetch');

const getManifestUrl = (name) => {
  return `https://api.nasa.gov/mars-photos/api/v1/manifests/${name}?api_key=${process.env.API_KEY}`;
};

const getPhotoURL = (name, date) => {
  return `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`;
};

const getManifestOf = async (roverName) => {
  const url = getManifestUrl(roverName);
  const rawResult = await fetch(url).then((res) => res.json());
  return rawResult;
};

const mapRoverResponse = (rawResp) => {
  const manifest = rawResp.photo_manifest;
  return {
    name: manifest.name,
    landing_date: manifest.landing_date,
    launch_date: manifest.launch_date,
    status: manifest.status,
    max_date: manifest.max_date,
  };
};

const getPhotosFor = async (name, date) => {
  const url = getPhotoURL(name, date);
  return fetch(url).then((res) => res.json());
};

const getRovers = async (...names) => {
  const requests = names.map((name) => getManifestOf(name));
  const results = await Promise.all(requests);
  return results.map(mapRoverResponse);
};

module.exports.getPhotosFor = getPhotosFor;
module.exports.getRovers = getRovers;
