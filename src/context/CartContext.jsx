"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const { data: session, isPending } = useSession();
  const [cartItems, setCartItems] = useState([]);
  // Tracks which localStorage key is currently loaded so the save effect always
  // writes to the right key even during a user switch.
  const activeKeyRef = useRef(null);

  const userId = session?.user?.id || session?.user?.email;
  const cartKey =
    !isPending && userId ? `resellhub_cart_${userId}` : null;

  // Load the correct cart whenever the authenticated user changes.
  // Runs on session resolve/switch — NOT on every page navigation.
  useEffect(() => {
    if (isPending) return;

    if (!cartKey) {
      activeKeyRef.current = null;
      setCartItems([]);
      return;
    }

    activeKeyRef.current = cartKey;
    const saved = localStorage.getItem(cartKey);
    setCartItems(saved ? JSON.parse(saved) : []);
  }, [cartKey, isPending]);

  // Persist cart changes. Uses a ref so it always writes to the key that was
  // loaded, never to a key that belongs to a different user.
  useEffect(() => {
    const key = activeKeyRef.current;
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((i) => i._id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty < 1) return removeFromCart(productId);
    setCartItems((prev) =>
      prev.map((i) => (i._id === productId ? { ...i, quantity: qty } : i))
    );
  };

  // Remove from localStorage immediately so the load effect cannot reload stale
  // items if it fires after this (e.g. on the payment success page).
  const clearCart = () => {
    const key = activeKeyRef.current;
    if (key) localStorage.removeItem(key);
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartCtx.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}
