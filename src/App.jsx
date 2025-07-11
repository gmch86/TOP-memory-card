import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Card";

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

function App() {
  const [resourceList, setResourceList] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    async function loadPokemonList() {
      const cached = localStorage.getItem("resourceList");
      if (cached) {
        setResourceList(JSON.parse(cached));
        return;
      }

      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=-1");
        const json = await res.json();
        localStorage.setItem("resourceList", JSON.stringify(json.results));
        setResourceList(json.results);
      } catch (error) {
        console.error("Failed to fetch resource list:", error);
      }
    }

    loadPokemonList();
  }, []);

  useEffect(() => {
    if (resourceList.length > 0) {
      const randomPokemon = getRandomItemsFromArray(resourceList, 10);
      setPokemon(randomPokemon);
    }
  }, [resourceList]);

  function replacePokemon(name) {
    const currentPokemon = new Set(pokemon.map((p) => p.name));
    const available = resourceList.filter((p) => !currentPokemon.has(p.name));
    const [replacement] = getRandomItemsFromArray(available, 1);
    setPokemon((prev) => prev.map((p) => (p.name === name ? replacement : p)));
  }

  function shufflePokemon(name) {
    if (history.includes(name)) {
      if (score > bestScore) {
        setBestScore(score);
      }
      setScore(0);
      setHistory([]);
    } else {
      setHistory([...history, name]);
      setScore((score) => score + 1);
    }

    setPokemon(getRandomItemsFromArray(pokemon));
  }

  function resetGame() {
    setScore(0);
    setBestScore(0);
    setHistory([]);
    setPokemon(getRandomItemsFromArray(resourceList, 10));
  }

  return (
    <div className="app-container">
      <div className="scoreboard">
        <p>
          Score: <strong>{score}</strong>
        </p>
        <p>
          Best Score: <strong>{bestScore}</strong>
        </p>
        <button onClick={resetGame}>Reset Game</button>
      </div>

      <div className="pokemon-cards">
        {pokemon.map(({ name, url }) => (
          <Card
            key={name}
            name={name}
            url={url}
            handleReplace={() => replacePokemon(name)}
            handleShuffle={() => shufflePokemon(name)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
