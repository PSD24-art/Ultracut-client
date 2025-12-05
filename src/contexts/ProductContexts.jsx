// ProductsContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL || "";
const ProductsContext = createContext(null);

/* -----------------------
   Small helpers
   ----------------------- */
const norm = (s = "") => String(s).toLowerCase();

/* -----------------------
   Product utils (simple)
   - products follow productSchema:
     { sku, title, slug, brand, head, category, price, mrp, stock, images, short, description, specs, meta }
   ----------------------- */
export function createProductUtils(products = []) {
  const list = Array.isArray(products) ? products : [];

  function all() {
    return list;
  }

  function search(q) {
    if (!q) return list;
    const qn = norm(q);
    return list.filter((p) => {
      return (
        norm(p.title).includes(qn) ||
        norm(p.sku).includes(qn) ||
        (p.brand && norm(p.brand).includes(qn)) ||
        (p.head && norm(p.head).includes(qn)) ||
        (p.category && norm(p.category).includes(qn)) ||
        (p.short && norm(p.short).includes(qn)) ||
        (p.slug && norm(p.slug).includes(qn))
      );
    });
  }

  function filterBy(filters = {}) {
    // filters: { brand: string[], category: string[], head: string[], price: {min,max}, inStock: boolean }
    return list.filter((p) => {
      if (filters.brand?.length && !filters.brand.includes(p.brand))
        return false;
      if (filters.category?.length && !filters.category.includes(p.category))
        return false;
      if (filters.head?.length && !filters.head.includes(p.head)) return false;
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

  function sortBy(listToSort = list, key = "price", dir = "asc") {
    const d = dir === "desc" ? -1 : 1;
    return [...listToSort].sort((a, b) => {
      const A = a?.[key];
      const B = b?.[key];
      if (A == null) return 1 * d;
      if (B == null) return -1 * d;
      if (typeof A === "string" && typeof B === "string")
        return A.localeCompare(B) * d;
      return (A - B) * d;
    });
  }

  function paginate(listToPaginate = list, page = 1, perPage = 20) {
    const start = (page - 1) * perPage;
    const data = listToPaginate.slice(start, start + perPage);
    return {
      data,
      total: listToPaginate.length,
      page,
      perPage,
      totalPages: Math.ceil(listToPaginate.length / perPage),
    };
  }

  function uniqueValues(key) {
    const set = new Set();
    for (const p of list) if (p && p[key] != null) set.add(p[key]);
    return Array.from(set);
  }

  return { all, search, filterBy, sortBy, paginate, uniqueValues };
}

/* -----------------------
   Provider (fetch once, optional cache)
   ----------------------- */
export function ProductsProvider({
  children,
  fetchUrl = `${BASE_URL}/products`,
  cacheKey = "uc_products_v1",
  cacheTTL = 1000 * 60 * 60 * 24, // 24h
}) {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    // try cache
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed?.ts &&
          Date.now() - parsed.ts < cacheTTL &&
          Array.isArray(parsed.data)
        ) {
          setProducts(parsed.data);
          setLoading(false);
        }
      }
    } catch (e) {
      // ignore cache errors
    }

    // fetch fresh
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(fetchUrl);
        if (!res.ok)
          throw new Error(`Failed to fetch products (${res.status})`);
        const data = await res.json();
        if (!mounted) return;
        setProducts(data.products);
        setLoading(false);
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ ts: Date.now(), data })
          );
        } catch (e) {}
        // notify other tabs
        window.dispatchEvent(
          new CustomEvent("uc:products:loaded", { detail: { products: data } })
        );
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to fetch products");
        setLoading(false);
      }
    })();

    function onStorage(e) {
      if (e.key === cacheKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.data) setProducts(parsed.data);
        } catch (e) {}
      }
    }

    window.addEventListener("storage", onStorage);
    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
    };
  }, [fetchUrl, cacheKey, cacheTTL]);

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

export function formatPriceINR(n) {
  return typeof n === "number" ? `₹${n.toLocaleString("en-IN")}` : n;
}
