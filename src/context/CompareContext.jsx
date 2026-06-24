"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CompareCtx = createContext(null);
export const useCompare = () => useContext(CompareCtx);

const MAX = 3;
const KEY  = "resellhub_compare";

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setCompareItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(compareItems));
  }, [compareItems]);

  const isInCompare  = (id) => compareItems.some(p => p._id === id);

  const addToCompare = (product) => {
    if (isInCompare(product._id)) {
      toast("Already in compare list", { icon: "⚖️", duration: 1500 });
      return;
    }
    if (compareItems.length >= MAX) {
      toast.error(`Compare supports up to ${MAX} products`);
      return;
    }
    setCompareItems(prev => [...prev, product]);
    toast.success("Added to compare", { duration: 1500 });
  };

  const removeFromCompare = (id) =>
    setCompareItems(prev => prev.filter(p => p._id !== id));

  const clearCompare = () => setCompareItems([]);

  return (
    <CompareCtx.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareCtx.Provider>
  );
}
