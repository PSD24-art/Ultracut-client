// src/contexts/ProductsContext.jsx
import React, { createContext, useContext } from "react";
import productsData from "../data/products.json";

const ProductsContext = createContext([]);

export function ProductsProvider({ children }) {
  // productsData is already parsed at build time
  return (
    <ProductsContext.Provider value={productsData}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
