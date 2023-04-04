"use strict";

const pokemons = require("./pokemon.js");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/pokemons", (req, res) => res.send({ data: pokemons }));
app.get("/api/pokemons/:pokemonId", (req, res) => {
  const pokemon = pokemons.find(
    (pokemon) => pokemon.id === parseInt(req.params.pokemonId)
  );

  if (!pokemon) {
    res.status(404).send({
      status: "Not found",
      code: "404",
      title: "Resource does not exist",
      description: `We could not find a pokemon with id: ${req.params.pokemonId}`,
    });
    return;
  }

  res.send({ data: pokemon });
});
app.post("/api/pokemons", (req, res) => {
  const { name, type, abilities } = req.body;
  if (!name || !type || !abilities) {
    res.status(400).send({
      error: "Name, type, and abilities required",
    });
  } else {
    const nextId = parseInt(pokemons[pokemons.length - 1].id, 10) + 1;
    //removed .toString() from id below since it was stopping the ability to patch and put using the new id numbers created with post
    const newPokemon = {
      id: nextId,
      name,
      type,
      abilities,
    };
    pokemons.push(newPokemon);
    res.status(201).send({ data: newPokemon });
  }
});
app.patch("/api/pokemons/:pokemonId", (req, res) => {
  const id = parseInt(req.params.pokemonId);
  const index = pokemons.findIndex((pokemon) => pokemon.id === id);
  if (index < 0) {
    res.status(404).send({
      errors: [
        {
          status: "Not found",
          code: "404",
          title: "Resource does not exist",
          description: `We could not find a pokemon with id: ${id}`,
        },
      ],
    });
  } else {
    const { id, ...theRest } = req.body;
    const updatedPokemon = Object.assign({}, pokemons[index], theRest);
    pokemons[index] = updatedPokemon;
    res.send({ data: updatedPokemon });
  }
});
app.put("/api/pokemons/:pokemonId", (req, res) => {
  const id = parseInt(req.params.pokemonId);
  const index = pokemons.findIndex((pokemon) => pokemon.id === id);
  const { name, type, abilities } = req.body;

  if (index < 0) {
    res.status(404).send({
      errors: [
        {
          status: "Not found",
          code: "404",
          title: "Resource does not exist",
          description: `We could not find a pokemon with id: ${id}`,
        },
      ],
    });
  } else if (!name || !type || !abilities) {
    res.status(400).send({
      error: "Name, type, and abilities required",
    });
  } else {
    const updatedPokemon = { id, name, type, abilities };
    pokemons[index] = updatedPokemon;
    res.send({ data: updatedPokemon });
  }
});
app.delete("/api/pokemons/:pokemonId", (req, res) => {
  const id = parseInt(req.params.pokemonId);
  const index = pokemons.findIndex((pokemon) => pokemon.id === id);
  if (index < 0) {
    res.status(404).send({
      errors: [
        {
          status: "Not found",
          code: "404",
          title: "Resource does not exist",
          description: `We could not find a pokemon with id: ${id}`,
        },
      ],
    });
  } else {
    const updatedPokemon = pokemons.splice(index, 1);
    res.send({ data: updatedPokemon[0] });
  }
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Server listening on port ${port} ...`));
