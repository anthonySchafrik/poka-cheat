require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const log = require('./utils').log;

const app = express();
const port = process.env.port;

const pokemonRoute = require('./routes/pokemonRoute');

const apiBase = '/api/v1';

app.use(apiBase, pokemonRoute);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  log(`server is listing on port ${port}`);
});
