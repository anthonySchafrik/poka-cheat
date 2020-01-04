module.exports.fetchPokemon = async (req, res) => {
  console.log(req.query.pokemon);
  res.status(200).send('good');
};
