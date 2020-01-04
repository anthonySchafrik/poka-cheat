import React, { Component } from 'react';
import axios from 'axios';

class PokeSearch extends Component {
  state = {
    pokemonName: '',
    pokemon: {}
  };

  handleChange = e => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  fetchPokemon = () => {
    const { pokemonName } = this.state;

    axios.get(`/api/v1/pokemon?pokemon=${pokemonName}`);
  };

  render = () => {
    const { handleChange, fetchPokemon } = this;
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
      </>
    );
  };
}

export default PokeSearch;
