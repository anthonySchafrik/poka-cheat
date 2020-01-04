const express = require('express');
const { fetchPokemon } = require('../controller/pokemonController');

const apiBase = '/pokemon';

const router = express.Router();

router.get(apiBase, fetchPokemon);

module.exports = router;
