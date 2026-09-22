import { createContext, useContext, useState, type ReactNode } from "react";
import type { Artwork } from "../types/Artwork";

type SelectionValue = {
  selection: Artwork[];
  toggleSelection: (artwork: Artwork) => void;
  isSelected: (id: number) => boolean;
};

const SelectionContext = createContext<SelectionValue | null>(null);

// Garde la sélection en mémoire et la partage à toutes les pages.
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Artwork[]>([]);

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

  return (
    <SelectionContext.Provider value={{ selection, toggleSelection, isSelected }}>
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
