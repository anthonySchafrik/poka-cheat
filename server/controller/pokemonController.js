const axios = require('axios');
const cheerio = require('cheerio');

const pokemonApi = 'https://pokeapi.co/api/v2/pokemon/';

const pokemonBackUp = 'https://www.serebii.net/pokedex-swsh/';

const fetchData = async pokemon => {
  const pokemonPackage = {
    types: [],
    stats: []
  };

  const result = await axios.get(`${pokemonBackUp}/${pokemon}/`);

  const $ = cheerio.load(result.data);

  // console.log(
  //   cheerio.html($('.fooinfo')).split(' ')
  //   // $('td[class=fooinfo]').html()
  // );

  const type = cheerio.html($('.typeimg')).split(' ');

  type.forEach(x => {
    const { types, stats } = pokemonPackage;

    let type;
    const findAlt = x.slice(0, 3);

    if (findAlt === 'alt') {
      const findDash = x.indexOf('-');

      type = x.slice(5, findDash);

      if (!types.includes(type)) {
        types.push(type);
      }
    }
  });
  console.log(pokemonPackage);
};

module.exports.fetchPokemon = async (req, res) => {
  const { pokemon } = req.query;
  const pokemonPackage = {
    types: [],
    stats: []
  };
  try {
    const pokemonData = await axios.get(`${pokemonApi}/${pokemon}`);

    const { types, stats } = pokemonData.data;

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
  } catch (error) {
    const { status } = error.response;
    console.log(error.response);

    if (status === 404) {
      fetchData(pokemon);
    }
  }

  res.status(200).send(pokemonPackage);
};
