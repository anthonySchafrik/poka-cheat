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

  const stat = cheerio.html($('.fooinfo')).split(' ');
  const type = cheerio.html($('.typeimg')).split(' ');

  const htmlFilter = stat.filter(x => {
    const start = x.indexOf('>');
    const end = x.indexOf('<');
    const t = x.slice(0, start + 1);
    const y = x.slice(end);

    if (t === 'class="fooinfo">' && y === '</td><td') {
      return x;
    }
  });

  const htmlStats = htmlFilter.slice(Math.max(htmlFilter.length - 6, 1));

  const Stats = htmlStats.map(x => {
    const start = x.indexOf('>');
    const end = x.indexOf('<');

    const stat = x.slice(start + 1, end);

    return stat;
  });

  pokemonPackage.stats = [
    { stat: 'hp', base: Stats[0] },
    { stat: 'attack', base: Stats[1] },
    { stat: 'defense', base: Stats[2] },
    { stat: 'special-attack', base: Stats[3] },
    { stat: 'special-defense', base: Stats[4] },
    { stat: 'speed', base: Stats[5] }
  ];

  type.forEach(x => {
    const { types } = pokemonPackage;

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
