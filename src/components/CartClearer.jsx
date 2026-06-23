"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export function CartClearer() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Wipe localStorage directly so it cannot reload even if the session
    // resolves after this effect fires (which it often does on the success page).
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("resellhub_cart_")) {
        localStorage.removeItem(key);
      }
    }
    // Also clear in-memory state via context.
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
