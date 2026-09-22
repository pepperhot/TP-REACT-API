import { Link, Route, Routes } from "react-router-dom";
import Artworks from "./pages/Artworks";
import ArtworkDetails from "./pages/ArtworkDetails";
import Selection from "./pages/Selection";
import Proposer from "./pages/Proposer";
import { useSelection } from "./context/SelectionContext";

export default function App() {
  const { selection } = useSelection();

  return (
    <>
      <h1>Art Institute</h1>

      <nav>
        <Link to="/">Catalogue</Link>{" | "}
        <Link to="/selection">Ma sélection ({selection.length})</Link>{" | "}
        <Link to="/proposer">Proposer</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Artworks />} />
        <Route path="/oeuvres/:id" element={<ArtworkDetails />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/proposer" element={<Proposer />} />
        <Route path="*" element={<p>Page introuvable.</p>} />
      </Routes>
    </>
  );
}
