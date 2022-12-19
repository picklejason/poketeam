const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const fetch = require("node-fetch");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
require("dotenv").config();

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const databaseAndCollection = {
  db: process.env.MONGO_DB_NAME,
  collection: process.env.MONGO_COLLECTION,
};

const portNumber = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${userName}:${password}@cluster0.tl7li.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const collection = client
  .db(databaseAndCollection.db)
  .collection(databaseAndCollection.collection);
try {
  client.connect();
} catch (err) {
  console.error(err);
}

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/create", async (req, res) => {
  try {
    let pokemons = await getAllPokemons();
    res.render("create", { pokemons });
  } catch (err) {
    console.error(err);
  }
});

app.post(
  "/processTeam",
  check("name")
    .notEmpty()
    .withMessage("Name cannot be empty.")
    .isLength({ max: 30 })
    .withMessage("Name cannot be longer than 30 characters.")
    .matches(/^[\w\s-]+/)
    .withMessage(
      "Name can only contain letters, numbers, spaces, dashes and underscores."
    ),
  check("pokemons")
    .notEmpty()
    .withMessage("You must select at least one Pokémon."),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let p = await addPokemon(req.body);
      let pokemons = req.body.pokemons;
      const sprites = await Promise.all(
        pokemons.map(async (pokemon) => {
          let p = await fetchPokemon(pokemon);
          let sprite = p.sprites.other["official-artwork"].front_default;
          return sprite;
        })
      );
      let data = {
        name: req.body.name,
        pokemons,
        sprites,
      };
      res.render("team", data);
    } catch (err) {
      console.error(err);
    }
  }
);

app.get("/view/:name", async (req, res) => {
  try {
    const p = await collection.findOne({ name: req.params.name });
    let pokemons = p.pokemons;
    let sprites = [];
    const results = await Promise.all(
      pokemons.map(async (pokemon) => {
        let p = await fetchPokemon(pokemon);
        let sprite = p.sprites.other["official-artwork"].front_default;
        return sprite;
      })
    );

    results.forEach((result) => {
      sprites.push(result);
    });

    let data = {
      name: req.params.name,
      pokemons,
      sprites,
    };
    res.render("team", data);
  } catch (err) {
    console.error(err);
  }
});

app.get("/pokemon/:pokemon", async (req, res) => {
  try {
    let p = await fetchPokemon(req.params.pokemon);
    let data = {
      name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
      sprite: p.sprites.other["official-artwork"].front_default,
      type: p.types
        .map(
          (type) =>
            type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
        )
        .join(" / "),
      id: p.id,
      weight: p.weight,
      height: p.height,
    };
    res.render("pokemon", data);
  } catch (err) {
    console.error(err);
  }
});

app.get("/archive", async (req, res) => {
  try {
    let [trainers, pages, current] = await getAllTrainers(req);
    let sprites = [];
    for (const t of trainers) {
      let pokemons = t.pokemons;
      const results = await Promise.all(
        pokemons.map(async (pokemon) => {
          let p = await fetchPokemon(pokemon);
          let sprite = p.sprites.front_default;
          return sprite;
        })
      );
      sprites.push(results);
    }
    res.render("archive", { trainers, sprites, pages, current });
  } catch (err) {
    console.error(err);
  }
});

async function fetchPokemon(pokemon) {
  try {
    if (myCache.has(pokemon)) {
      return myCache.get(pokemon);
    } else {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
      const data = await res.json();
      myCache.set(pokemon, data, 3600);
      return data;
    }
  } catch (err) {
    console.log(err);
  }
}

async function getAllPokemons() {
  try {
    if (myCache.has("allPokemons")) {
      return myCache.get("allPokemons");
    } else {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=-1`);
      const data = await res.json();
      myCache.set("allPokemons", data, 3600);
      return data;
    }
  } catch (err) {
    console.log(err);
  }
}

async function addPokemon(body) {
  try {
    const query = { name: body.name };
    const doc = await collection.findOne(query);
    if (doc) {
      const update = { $set: { pokemons: body.pokemons } };
      await collection.updateOne(query, update);
      return `Trainer updated, added ${body.pokemons} to ${body.name}`;
    } else {
      const doc = {
        name: body.name,
        pokemons: body.pokemons,
      };
      await collection.insertOne(doc);
      return `New Trainer ${body.name} added with team ${body.pokemons}`;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getAllTrainers(req) {
  const perPage = 8;
  const total = await collection.countDocuments();
  const pages = Math.ceil(total / perPage);
  const page = req.query.page || 1;
  const startFrom = (page - 1) * perPage;
  const result = await collection
    .find({})
    .skip(startFrom)
    .limit(perPage)
    .toArray();
  return [result, pages, page];
}

app.listen(portNumber);
console.log(`Web server started and running at http://localhost:${portNumber}`);
