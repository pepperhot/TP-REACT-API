import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Artwork } from "../types/Artwork";

type SelectionValue = {
  selection: Artwork[];
  toggleSelection: (artwork: Artwork) => void;
  isSelected: (id: number) => boolean;
  clearSelection: () => void;
};

const STORAGE_KEY = "tp-react-selection";

const SelectionContext = createContext<SelectionValue | null>(null);

// Relit la sélection enregistrée ; le stockage peut être indisponible (navigation privée).
function loadSelection(): Artwork[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Garde la sélection en mémoire, la partage à toutes les pages et la conserve entre deux visites.
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Artwork[]>(loadSelection);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // Pas de stockage : la sélection reste valable jusqu'à la fermeture de l'onglet.
    }
  }, [selection]);

  function toggleSelection(artwork: Artwork) {
    setSelection((previous) =>
      previous.some((item) => item.id === artwork.id)
        ? previous.filter((item) => item.id !== artwork.id)
        : [...previous, artwork]
    );
  }

  function isSelected(id: number) {
    return selection.some((item) => item.id === id);
  }

  function clearSelection() {
    setSelection([]);
  }

  return (
    <SelectionContext.Provider value={{ selection, toggleSelection, isSelected, clearSelection }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error("useSelection doit être utilisé dans <SelectionProvider>.");
  }

  return context;
}
