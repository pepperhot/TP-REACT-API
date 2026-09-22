import { Link } from "react-router-dom";
import { artistName } from "../utils/artwork";
import { useSelection } from "../context/SelectionContext";

export default function Selection() {
  // Même sélection que sur les autres pages : elle vient du contexte.
  const { selection, toggleSelection } = useSelection();

  if (selection.length === 0) return <p>Aucune œuvre sélectionnée.</p>;

  return (
    <>
      <h2>Ma sélection</h2>
      <ul>
        {selection.map((artwork) => (
          <li key={artwork.id}>
            <Link to={`/oeuvres/${artwork.id}`}>{artwork.title}</Link>
            {" — "}
            {artistName(artwork)}
            <button onClick={() => toggleSelection(artwork)}>Retirer</button>
          </li>
        ))}
      </ul>
    </>
  );
}
