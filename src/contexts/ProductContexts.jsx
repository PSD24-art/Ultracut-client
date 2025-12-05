// ProductsContext.jsx
// Single-file React provider + hook + utility helpers for Ultracut
// Usage: Wrap your App with <ProductsProvider> and use useProducts() in pages/components.
const BASE_URL = import.meta.env.VITE_BASE_URL;

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ProductsContext = createContext(null);

// --- Basic helpers (search / filter / sort / paginate) ---
function normalizeString(s = "") {
  return String(s).toLowerCase();
}

export function createProductUtils(products = []) {
  // safe copy
  const list = Array.isArray(products) ? products : [];

  function search(q) {
    if (!q) return list;
    const qn = normalizeString(q);
    return list.filter((p) => {
      return (
        normalizeString(p.title).includes(qn) ||
        normalizeString(p.sku).includes(qn) ||
        normalizeString(p.brand).includes(qn) ||
        normalizeString(p.short).includes(qn) ||
        normalizeString(p.category).includes(qn) ||
        normalizeString(p.head).includes(qn) ||
        (p.slug && normalizeString(p.slug).includes(qn))
      );
    });
  }

  function filterBy(filters = {}) {
    // filters: { brand: string[], category: string[], price: { min, max }, inStock: boolean }
    return list.filter((p) => {
      if (filters.brand && filters.brand.length) {
        if (!filters.brand.includes(p.brand)) return false;
      }
      if (filters.category && filters.category.length) {
        if (!filters.category.includes(p.category)) return false;
      }
      if (filters.inStock != null) {
        if (filters.inStock && !(p.stock > 0)) return false;
        if (!filters.inStock && p.stock > 0) return false;
      }
      if (filters.price) {
        const { min = -Infinity, max = Infinity } = filters.price;
        if (typeof p.price === "number") {
          if (p.price < min || p.price > max) return false;
        }
      }
      return true;
    });
  }

  function sortBy(listToSort = list, sortKey = "price", direction = "asc") {
    const dir = direction === "desc" ? -1 : 1;
    const copy = [...listToSort];
    copy.sort((a, b) => {
      const A = a[sortKey];
      const B = b[sortKey];
      if (A == null) return 1 * dir;
      if (B == null) return -1 * dir;
      if (typeof A === "string" && typeof B === "string")
        return A.localeCompare(B) * dir;
      return (A - B) * dir;
    });
    return copy;
  }

  function paginate(listToPaginate = list, page = 1, perPage = 20) {
    const start = (page - 1) * perPage;
    return {
      data: listToPaginate.slice(start, start + perPage),
      total: listToPaginate.length,
      page,
      perPage,
      totalPages: Math.ceil(listToPaginate.length / perPage),
    };
  }

  function uniqueValues(key) {
    const s = new Set();
    for (const p of list) if (p && p[key]) s.add(p[key]);
    return Array.from(s);
  }

  return {
    all: () => list,
    search,
    filterBy,
    sortBy,
    paginate,
    uniqueValues,
  };
}

// --- ProductsProvider: fetch once, cache in localStorage, provide state + helpers ---
export function ProductsProvider({
  children,
  fetchUrl = `${BASE_URL}/products`,
  cacheKey = "uc_products_v1",
  cacheTTL = 1000 * 60 * 60 * 24,
}) {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load from cache (localStorage) first
  useEffect(() => {
    let mounted = true;

    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        // parsed: { ts, data }
        if (
          parsed &&
          parsed.ts &&
          Date.now() - parsed.ts < cacheTTL &&
          Array.isArray(parsed.data)
        ) {
          setProducts(parsed.data);
          setLoading(false);
        }
      }
    } catch (e) {
      console.warn("Products cache read failed", e);
    }

    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error("Failed to fetch products: " + res.status);
        const data = await res.json();
        // console.log("Data from Product context: ", data);

        if (!mounted) return;
        setProducts(data);
        setLoading(false);
        // save cache
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ ts: Date.now(), data })
          );
        } catch (e) {
          console.warn("Products cache write failed", e);
        }
        // broadcast to other tabs
        window.dispatchEvent(
          new CustomEvent("uc:products:loaded", { detail: { products: data } })
        );
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setError(err.message || "Unknown");
        setLoading(false);
      }
    }

    // Always fetch fresh copy in background (if no fresh cached copy exists we still fetch).
    fetchData();

    // listen for cross-tab updates
    function onStorage(e) {
      if (e.key === cacheKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.data) setProducts(parsed.data);
        } catch (err) {}
      }
    }

    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
    };
  }, [fetchUrl, cacheKey, cacheTTL]);

  // memoized utils
  const utils = useMemo(() => createProductUtils(products || []), [products]);

  const value = useMemo(
    () => ({ products, loading, error, utils, setProducts }),
    [products, loading, error, utils]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx;
}

// --- Example tiny helpers you can import elsewhere ---
export function formatPriceINR(n) {
  if (typeof n !== "number") return n;
  return `₹${n.toLocaleString("en-IN")}`;
}

// End of file
