import { useEffect, useState } from "react";

export default function Card({ name, url, handleReplace, handleShuffle }) {
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
          console.error("No image found. Replacing Pokemon...");
          handleReplace();
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
  }, [name, url, handleReplace]);

  return (
    <div className="card" onClick={handleShuffle}>
      {image ? <img src={image} alt={name} /> : <p>Loading...</p>}
    </div>
  );
}
