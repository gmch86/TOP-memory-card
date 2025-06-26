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
  const [image, setImage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchImage() {
      // Check localStorage first
      const cached = localStorage.getItem(`pokemonImage-${name}`);
      if (cached) {
        setImage(cached);
        return;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const image = json.sprites?.other?.["official-artwork"]?.front_default;

        if (!image) {
          console.error("No image found. Replacing pokemon...");
          // TODO...
        } else if (!ignore) {
          localStorage.setItem(`pokemonImage-${name}`, image);
          setImage(image);
        }
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchImage();

    return () => {
      ignore = true;
    };
  }, [name, url]);

  return (
    <div className="card">
      <img src={image} alt={name} />
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
        <Card key={name} name={name} url={url} />
      ))}
    </div>
  );
}

export default App;
