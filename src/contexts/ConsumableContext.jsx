import React, { createContext, useContext, useEffect, useState } from "react";
import fetchFn from "../utility/FetchFn";

const ConsumablesContext = createContext(null);

export function ConsumablesProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchFn("/consumables", "GET");
      console.log("Data from consumables: ", data);

      setItems(
        (data.consumables || []).map((x) => ({
          ...x,
          slug: String(x.slug).toLowerCase(),
        }))
      );
    } catch (err) {
      console.error("Failed to fetch consumables", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const getBySlug = (slug) =>
    items.find((c) => c.slug === String(slug).toLowerCase());

  return (
    <ConsumablesContext.Provider
      value={{ items, loading, getBySlug, refresh: load }}
    >
      {children}
    </ConsumablesContext.Provider>
  );
}

export function useConsumables() {
  return useContext(ConsumablesContext);
}
