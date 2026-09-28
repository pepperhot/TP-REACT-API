import { NavLink, Route, Routes } from "react-router-dom";
import Artworks from "./pages/Artworks";
import ArtworkDetails from "./pages/ArtworkDetails";
import Selection from "./pages/Selection";
import Proposer from "./pages/Proposer";
import { useSelection } from "./context/SelectionContext";

export default function App() {
  const { selection } = useSelection();

  return (
    <div className="museum-shell">
      <header className="site-header">
        <p className="museum-kicker">Collection en ligne</p>
        <h1>Art Institute</h1>

        <nav className="site-nav">
          <NavLink to="/" end>Catalogue</NavLink>
          <NavLink to="/selection">
            Ma sélection <span className="badge">{selection.length}</span>
          </NavLink>
          <NavLink to="/proposer">Proposer une œuvre</NavLink>
        </nav>
      </header>

      <div className="ticks"></div>

      <main className="site-content">
        <Routes>
          <Route path="/" element={<Artworks />} />
          <Route path="/oeuvres/:id" element={<ArtworkDetails />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="/proposer" element={<Proposer />} />
          <Route path="*" element={<p>Page introuvable.</p>} />
        </Routes>
      </main>
    </div>
  );
}
