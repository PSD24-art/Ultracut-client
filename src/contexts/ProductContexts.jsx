// src/contexts/ProductContexts.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);   // ALWAYS array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const res = await fetch("/products.json"); // from public folder
        if (!res.ok) throw new Error("Failed to load products.json");

        const data = await res.json();

        if (mounted) {
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            console.error("products.json is not an array");
            setProducts([]);
          }
        }
      } catch (err) {
        console.error("Products load error:", err);
        if (mounted) {
          setError(err.message || "Failed to load products");
          setProducts([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      products,        // always []
      loading,
      error,
    }),
    [products, loading, error]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts must be used inside ProductsProvider");
  }
  return ctx;
}
