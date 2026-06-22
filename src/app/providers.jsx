"use client";

import { useEffect } from "react";
import { CartProvider } from "@/context/CartContext";

export function ThemeProvider({ children }) {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <CartProvider>{children}</CartProvider>;
}
