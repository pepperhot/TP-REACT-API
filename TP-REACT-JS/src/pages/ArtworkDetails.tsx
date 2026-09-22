import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Artwork } from "../types/Artwork";
import { artistName, imageUrl } from "../utils/artwork";
import { useSelection } from "../context/SelectionContext";

export default function ArtworkDetails() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toggleSelection, isSelected } = useSelection();

  // L'effet se relance à chaque changement d'identifiant dans l'URL.
  useEffect(() => {
    async function loadArtwork() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.artic.edu/api/v1/artworks/${id}?fields=id,title,artist_title,date_display,image_id`
        );

        // Identifiant inconnu : l'API répond 404, donc response.ok vaut false.
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const json = await response.json();
        setArtwork(json.data);
      } catch {
        setError(`Aucune œuvre ne correspond à l'identifiant ${id}.`);
      } finally {
        setLoading(false);
      }
    }

    loadArtwork();
  }, [id]);

  if (loading) return <p>Chargement de la fiche...</p>;

  if (error || !artwork) {
    return (
      <>
        <h2>Œuvre introuvable</h2>
        <p>{error}</p>
        <Link to="/">Retour au catalogue</Link>
      </>
    );
  }

  const source = imageUrl(artwork.image_id);

  return (
    <>
      <h2>{artwork.title}</h2>
      {source && <img src={source} alt={artwork.title} width="300" />}
      <p>{artistName(artwork)}</p>
      <p>{artwork.date_display ?? "Date inconnue"}</p>
      <button onClick={() => toggleSelection(artwork)}>
        {isSelected(artwork.id) ? "Retirer de ma sélection" : "Ajouter à ma sélection"}
      </button>
      <p>
        <Link to="/">Retour au catalogue</Link>
      </p>
    </>
  );
}
