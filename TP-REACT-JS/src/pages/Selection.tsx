import { Link } from "react-router-dom";
import { artistName, imageUrl, IIIF_URL } from "../utils/artwork";
import { useSelection } from "../context/SelectionContext";

export default function Selection() {
  // Même sélection que sur les autres pages : elle vient du contexte.
  const { selection, toggleSelection, clearSelection } = useSelection();

  if (selection.length === 0) {
    return (
      <section className="empty-state">
        <h2>Ma sélection</h2>
        <p>Aucune œuvre sélectionnée.</p>
        <p>Cliquez sur « Ajouter » dans le catalogue pour en sélectionner.</p>
        <Link className="counter" to="/">Parcourir le catalogue</Link>
      </section>
    );
  }

  return (
    <>
      <div className="page-head">
        <h2>Ma sélection</h2>
        <p>{selection.length} œuvre(s) enregistrée(s) sur cet appareil</p>
        <button type="button" className="counter" onClick={clearSelection}>
          Tout retirer
        </button>
      </div>

      <ul className="artwork-grid">
        {selection.map((artwork) => {
          const source = imageUrl(IIIF_URL, artwork.image_id);

          return (
            <li key={artwork.id}>
              <Link to={`/oeuvres/${artwork.id}`} className="card-image">
                {source ? <img src={source} alt={artwork.title} loading="lazy" /> : <span>Pas d'image</span>}
              </Link>
              <div className="card-body">
                <Link to={`/oeuvres/${artwork.id}`}>{artwork.title}</Link>
                <p>{artistName(artwork)}</p>
              </div>
              <button onClick={() => toggleSelection(artwork)}>Retirer</button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
