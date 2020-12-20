require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const fns = require('./fns');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// your API calls

app.get('/apod', async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log('error:', err);
  }
});

app.get('/rovers', async (req, res) => {
  const results = await fns.getRovers('curiosity', 'opportunity', 'spirit');
  return res.send({
    data: results,
  });
});

app.get('/rovers/:roverName', async (req, res) => {
  const { roverName } = req.params;
  const result = await fns.getRovers(roverName);
  return res.send({
    data: result,
  });
});

app.get('/rovers/:roverName/photos', async (req, res) => {
  let { date } = req.query;
  const { roverName } = req.params;
  if (!date) {
    const manifest = await fns.getRovers(roverName);
    date = manifest[0].max_date;
  }
  const result = await fns.getPhotosFor(roverName, date);
  res.send(result);
});

app.listen(port, () =>
  console.log(`Mars Rovers app listening on port ${port}!`)
);
