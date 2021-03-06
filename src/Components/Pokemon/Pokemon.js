import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import pokemonBackground from "../../utils/pokemonTypesColours";
import "./styling/Pokemon.css";
import Header from "./Header";
import About from "./About";
import Stats from "./Stats";
import Evolution from "./Evolution";
import Moves from "./Moves";
import Image from "../Image";

function Pokemon() {
  let { id } = useParams();
  const [pokemon, setPokemon] = useState([]);
  const [evolution, setEvolution] = useState([]);
  const [displayComponent, setDisplayComponent] = useState("AboutComp");
  const eventhandler = (comp) => setDisplayComponent(comp);
  const fetchBaseUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const evoUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  const components = {
    AboutComp: <About pokemon={pokemon} />,
    StatsComp: <Stats pokemon={pokemon} />,
    EvolutionComp: <Evolution pokemon={evolution} onChange={eventhandler} />,
    MovesComp: <Moves pokemon={pokemon} />,
  };

  function importAll(r) {
    return r.keys().map(r);
  }

  const images = importAll(
    require.context("../../utils/official-artwork", true, /\.webp$/)
  );

  const sortable = Object.values(images).sort(
    (a, b) =>
      a.default.split("/")[3].split(".")[0] -
      b.default.split("/")[3].split(".")[0]
  );

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(`${fetchBaseUrl}`);
      const evoResp = await fetch(`${evoUrl}`);
      const data = await response.json();
      const evoData = await evoResp.json();
      const evoChainResp = await fetch(evoData.evolution_chain.url);
      const evoChainData = await evoChainResp.json();
      setPokemon(data);
      return setEvolution(evoChainData);
    };

    fetchPokemon();
  }, [fetchBaseUrl, evoUrl]);

  return pokemon.id && evolution.chain ? (
    <div
      className="pokemon__container"
      style={{
        backgroundColor: `#${pokemonBackground[pokemon.types[0].type.name]}`,
      }}
    >
      <div className="pokemon__main">
        <section className="pokemon__mainContainer">
          <div
            className="card__mainText"
            style={{
              color: `${
                pokemon.types[0].type.name === "electric" ||
                pokemon.types[0].type.name === "ground" ||
                pokemon.types[0].type.name === "flying" ||
                pokemon.types[0].type.name === "steel" ||
                pokemon.types[0].type.name === "ice"
                  ? "black"
                  : "white"
              }`,
            }}
          >
            <h2>{`${pokemon.name}`}</h2>
            {pokemon.id < 10 ? (
              <h3>#00{pokemon.id}</h3>
            ) : pokemon.id < 100 ? (
              <h3>#0{pokemon.id}</h3>
            ) : (
              <h3>#{pokemon.id}</h3>
            )}
            <div className="pokemon__typeContainer">
              {pokemon.types.map((type) => {
                return (
                  <div className="pokemon__type" key={type.type.name}>
                    {type.type.name}
                  </div>
                );
              })}
            </div>
          </div>
          <figure className="pokemon__imgContainer">
            <Image
              src={sortable[(id - 1)].default}
              id={id}
              alt="Pokemon offical artwork"
            />
          </figure>
        </section>
      </div>
      <section className="pokemon__information">
        <Header onChange={eventhandler} />
        {components[displayComponent]}
      </section>
    </div>
  ) : (
    <h1>Loading</h1>
  );
}

export default Pokemon;
