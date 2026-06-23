"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
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

  return (
    <CartProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontWeight: "500",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#059669", secondary: "#fff" } },
          error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </CartProvider>
  );
}
