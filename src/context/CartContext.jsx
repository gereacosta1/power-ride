//src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "power_ride_cart_v1";

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function loadCart() {
  if (typeof window === "undefined") return { items: [] };
  return safeParse(window.localStorage.getItem(STORAGE_KEY), { items: [] });
}

function saveCart(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clampQty(q) {
  const n = Number(q || 0);
  if (Number.isNaN(n)) return 1;
  return Math.max(1, Math.min(99, Math.floor(n)));
}

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD_ITEM": {
      const { product, qty = 1 } = action.payload;
      const next = [...state.items];
      const idx = next.findIndex((x) => x.slug === product.slug);
      if (idx >= 0) {
        next[idx] = { ...next[idx], qty: clampQty(next[idx].qty + qty) };
      } else {
        next.push({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: Number(product.price || 0), // dollars
          image: product.image,
          qty: clampQty(qty)
        });
      }
      return { ...state, items: next };
    }

    case "REMOVE_ITEM": {
      const slug = action.payload;
      return { ...state, items: state.items.filter((x) => x.slug !== slug) };
    }

    case "SET_QTY": {
      const { slug, qty } = action.payload;
      return {
        ...state,
        items: state.items.map((x) => (x.slug === slug ? { ...x, qty: clampQty(qty) } : x))
      };
    }

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: loadCart() });
  }, []);

  useEffect(() => {
    saveCart(state);
  }, [state]);

  const api = useMemo(() => {
    const items = state.items;

    const count = items.reduce((acc, it) => acc + (Number(it.qty) || 0), 0);
    const subtotal = items.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);

    // “Completo” pero simple por ahora:
    // - shipping: 0 (o podés poner flat rate más adelante)
    // - tax: 0 (o podés aplicar %)
    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;

    return {
      items,
      count,
      subtotal,
      shipping,
      tax,
      total,
      addItem: (product, qty = 1) => dispatch({ type: "ADD_ITEM", payload: { product, qty } }),
      removeItem: (slug) => dispatch({ type: "REMOVE_ITEM", payload: slug }),
      setQty: (slug, qty) => dispatch({ type: "SET_QTY", payload: { slug, qty } }),
      clear: () => dispatch({ type: "CLEAR" })
    };
  }, [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
