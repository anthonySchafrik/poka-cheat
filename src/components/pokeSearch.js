import React, { Component } from 'react';
import axios from 'axios';

class PokeSearch extends Component {
  state = {
    pokemonName: '',
    pokemon: { types: [], stats: [] }
  };

  handleChange = e => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  fetchPokemon = async () => {
    const { pokemonName } = this.state;

    let pokeData;

    try {
      pokeData = await axios.get(
        `/api/v1/pokemon?pokemon=${pokemonName.toLowerCase()}`
      );
    } catch (error) {
      alert(error.data);
    }

    const { data } = pokeData;

    this.setState({ pokemon: data });
  };

  render = () => {
    const { handleChange, fetchPokemon } = this;
    const { types, stats } = this.state.pokemon;

    return (
      <>
        <div>
          Welcome to poka-cheat. Simply type in the name of the pokemon your
          battling to return its type and base stats
        </div>

        <div>
          <input
            onChange={handleChange}
            type="text"
            name="pokemonName"
            placeholder="Enter pokemon name"
          />
          <button onClick={fetchPokemon}>Search</button>
        </div>

        <div>
          <h3>Types</h3>
          {types.map((type, i) => {
            return <div key={i}>{type}</div>;
          })}
        </div>

        <div>
          <h3>Base stats</h3>

          {stats.map((x, i) => {
            const { stat, base } = x;
            return (
              <div key={i}>
                <div>{stat}</div>
                <div>{base}</div>
              </div>
            );
          })}
        </div>
      </>
    );
  };
}

export default PokeSearch;
