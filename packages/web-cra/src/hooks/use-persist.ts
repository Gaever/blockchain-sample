import { PersistedState, PersistedStateItem } from "@/types";
import { useState } from "react";

export const localStorageKey = "__persisted";

function getState() {
  const persisted = localStorage.getItem(localStorageKey);
  return persisted ? (JSON.parse(persisted) as PersistedState) : null;
}

export default function usePersist(stockId?: string) {
  const [state, setState] = useState<PersistedState | null>(getState());

  function save(stockId: string, newStateItem: PersistedStateItem) {
    const newState = {
      ...state,
      [stockId]: newStateItem,
    };
    setState(newState);
    localStorage.setItem(localStorageKey, JSON.stringify(newState));
  }

  return {
    state,
    save,
    stockState: state?.[String(stockId)],
  };
}
