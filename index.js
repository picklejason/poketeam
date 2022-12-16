const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const fetch = require("node-fetch");
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
    pick = `<select name=pokemons id=pokemons required>`;
    pokemons = await getAllPokemons();
    pokemons.results.forEach((pokemon) => {
      pick += `<option value="${pokemon.name}">${pokemon.name}</option>`;
    });
    pick += `</select>`;
    res.render("create", { pick: pick });
  } catch (err) {
    console.error(err);
  }
});

app.post("/processTeam", async (req, res) => {
  try {
    let p = await addPokemon(req.body);
    let pokemons = req.body.pokemons;
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
      name: req.body.name,
      sprites: sprites,
    };
    res.render("team", data);
  } catch (err) {
    console.error(err);
  }
});

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
      sprites: sprites,
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
    console.log(data);
    res.render("pokemon", data);
  } catch (err) {
    console.error(err);
  }
});

app.get("/archive", async (req, res) => {
  try {
    let trainers = await getAllTrainers();
    var table = "<table border='1'><tr><th>Name</th><th>Pokémons</th></tr>";
    for (const t of trainers) {
      let pokemons = t.pokemons;
      let sprites = [];
      const results = await Promise.all(
        pokemons.map(async (pokemon) => {
          let p = await fetchPokemon(pokemon);
          let sprite =
            p.sprites.versions["generation-viii"].icons.front_default;
          return sprite;
        })
      );
      results.forEach((result) => {
        sprites.push(result);
      });
      table += `<tr><td><a href="/view/${t.name}">${t.name}</a></td><td>`;
      sprites.forEach((s) => {
        table += `<a href="/pokemon/${s.match(/\d+/)[0]}"><img src="${s}"></a>`;
      });
      table += `</td></tr>`;
    }
    res.render("archive", { table });
  } catch (err) {
    console.error(err);
  }
});

async function fetchPokemon(pokemon) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getAllPokemons() {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=493`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function addPokemon(body) {
  try {
    const query = { name: body.name };
    const doc = await collection.findOne(query);
    console.log(query);
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

async function getAllTrainers() {
  const cursor = collection.find({});
  const result = await cursor.toArray();
  return result;
}

app.listen(portNumber);
console.log(`Web server started and running at http://localhost:${portNumber}`);
