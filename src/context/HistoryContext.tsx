import React, { createContext, useContext, useState } from 'react';
import { CIDRRange } from '../types/network';

interface HistoryEntry {
  timestamp: number;
  input: string;
  result: CIDRRange;
}

interface HistoryContextType {
  history: HistoryEntry[];
  addToHistory: (input: string, result: CIDRRange) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType>({
  history: [],
  addToHistory: () => {},
  clearHistory: () => {},
});

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addToHistory = (input: string, result: CIDRRange) => {
    setHistory(prev => [
      { timestamp: Date.now(), input, result },
      ...prev.slice(0, 99), // Keep last 100 entries
    ]);
  };

  const clearHistory = () => setHistory([]);

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => useContext(HistoryContext);