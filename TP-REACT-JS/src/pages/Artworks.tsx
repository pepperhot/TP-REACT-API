import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Artwork, ArtworkApiResponse } from "../types/Artwork";
import { artistName, imageUrl } from "../utils/artwork";
import { useSelection } from "../context/SelectionContext";

const CATALOGUE_URL =
  "https://api.artic.edu/api/v1/artworks/search?query[bool][must][0][exists][field]=image_id&page=1&limit=24&fields=id,title,artist_title,date_display,image_id";

export default function Artworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [iiifUrl, setIiifUrl] = useState<string | null>(null);
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

        const json: ArtworkApiResponse<Artwork[]> = await response.json();
        setArtworks(json.data);
        setIiifUrl(json.config.iiif_url);
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

      <p className="filters">
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

      <p className="result-count">{visible.length} œuvre(s) sur {artworks.length}</p>

      <ul className="artwork-grid">
        {visible.map((artwork) => {
          const source = imageUrl(iiifUrl, artwork.image_id);

          return (
            <li key={artwork.id}>
              <Link to={`/oeuvres/${artwork.id}`} className="card-image">
                {source ? <img src={source} alt={artwork.title} loading="lazy" /> : <span>Pas d'image</span>}
              </Link>
              <div className="card-body">
                <Link to={`/oeuvres/${artwork.id}`}>{artwork.title}</Link>
                <p>{artistName(artwork)}</p>
              </div>
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
