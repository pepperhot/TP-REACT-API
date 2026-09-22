import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Artwork } from "../types/Artwork";
import { artistName, imageUrl } from "../utils/artwork";
import { useSelection } from "../context/SelectionContext";

const CATALOGUE_URL =
  "https://api.artic.edu/api/v1/artworks?page=1&limit=24&fields=id,title,artist_title,date_display,image_id";

export default function Artworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [artist, setArtist] = useState("");
  const { toggleSelection, isSelected } = useSelection();

  useEffect(() => {
    async function loadArtworks() {
      try {
        const response = await fetch(CATALOGUE_URL);

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const json = await response.json();
        setArtworks(json.data);
      } catch {
        setError("Impossible de charger le catalogue.");
      } finally {
        setLoading(false);
      }
    }

    loadArtworks();
  }, []);

  // Ces deux listes se déduisent des œuvres chargées : pas de state en plus.
  const artists = [...new Set(artworks.map(artistName))].sort();
  const visible = artworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(search.toLowerCase()) &&
      (artist === "" || artistName(artwork) === artist)
  );

  if (loading) return <p>Chargement du catalogue...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h2>Catalogue</h2>

      <p>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un titre"
        />
        <select value={artist} onChange={(event) => setArtist(event.target.value)}>
          <option value="">Tous les artistes</option>
          {artists.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </p>

      <p>{visible.length} œuvre(s) sur {artworks.length}</p>

      <ul>
        {visible.map((artwork) => {
          const source = imageUrl(artwork.image_id);

          return (
            <li key={artwork.id}>
              {source && <img src={source} alt={artwork.title} width="120" />}
              <Link to={`/oeuvres/${artwork.id}`}>{artwork.title}</Link>
              {" — "}
              {artistName(artwork)}
              <button onClick={() => toggleSelection(artwork)}>
                {isSelected(artwork.id) ? "Retirer" : "Ajouter"}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
