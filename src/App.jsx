import { useState, useEffect } from "react";
import "./App.css";

// Fetch pokemon resource list
if (!sessionStorage.getItem("resourceList")) {
  console.log("Fetching pokemon data...");
  await fetch("https://pokeapi.co/api/v2/pokemon?limit=-1")
    .then((res) => res.json())
    .then(({ results }) => {
      sessionStorage.setItem("resourceList", JSON.stringify(results));
    });
}

const resourceList = JSON.parse(sessionStorage.getItem("resourceList"));

function getRandomItemsFromArray(array, count = 10) {
  const result = [];
  const arr = [...array];

  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (arr.length - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
    result.push(arr[i]);
  }

  return result;
}

function Card({ name, url }) {
  // TODO...
  return (
    <div className="card">
      <img src="" alt={name} />
    </div>
  );
}

function App() {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    const randomPokemon = getRandomItemsFromArray(resourceList, 10);
    setPokemon(randomPokemon);
  }, []);

  return (
    <div className="pokemon-cards">
      {pokemon.map(({ name, url }) => (
        <Card key={name} url={url} />
      ))}
    </div>
  );
}

export default App;
