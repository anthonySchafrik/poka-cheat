const axios = require('axios');

const pokemonApi = 'https://pokeapi.co/api/v2/pokemon/';

module.exports.fetchPokemon = async (req, res) => {
  const { pokemon } = req.query;

  const pokemonData = await axios.get(`${pokemonApi}/${pokemon}`);

  const { types, stats } = pokemonData.data;

  const pokemonPackage = {
    types: [],
    stats: []
  };

  if (types.length > 1) {
    types.forEach(type => {
      const { name } = type.type;

      pokemonPackage.types.push(name);
    });
  } else {
    pokemonPackage.types.push(types[0].type.name);
  }

  stats.forEach(x => {
    const { base_stat, stat } = x;
    const { name } = stat;
    pokemonPackage.stats.push({ stat: name, base: base_stat });
  });

  res.status(200).send(pokemonPackage);
};
