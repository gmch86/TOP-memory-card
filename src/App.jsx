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

function Card() {
  // TODO...
  return (
    <div className="card">
      <img src="" alt="" />
    </div>
  );
}

function App() {
  // TODO...
  return <div className="pokemon-cards"></div>;
}

export default App;
