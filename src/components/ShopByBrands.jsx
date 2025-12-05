// src/components/ShopByBrands.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContexts";

function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ShopByBrands() {
  const navigate = useNavigate();
  const { products: rawProducts, loading } = useProducts();

  // normalize to array no matter what shape provider gave us
  const products = useMemo(() => {
    if (Array.isArray(rawProducts)) return rawProducts;
    if (rawProducts?.data && Array.isArray(rawProducts.data))
      return rawProducts.data;
    if (rawProducts?.products && Array.isArray(rawProducts.products))
      return rawProducts.products;
    // fallback empty array
    return [];
  }, [rawProducts]);

  const brands = useMemo(() => {
    const counts = {};
    for (const p of products) {
      const name = (p?.brand || "Unknown").trim();
      counts[name] = (counts[name] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count], i) => ({
        id: i + 1,
        name,
        slug: slugify(name),
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  function openBrand(name) {
    navigate(`/brands/${encodeURIComponent(slugify(name))}`);
  }

  if (loading) {
    return (
      <section id="brands" className="w-full py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          Loading brands…
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section id="brands" className="w-full py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          No brands available
        </div>
      </section>
    );
  }

  return (
    <section id="brands" className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Shop by Brands
          </h2>
          <a href="#shop" className="text-sm text-blue-600 hidden sm:inline">
            View All
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {brands.map((b) => (
            <button
              key={b.id + b.name}
              onClick={() => openBrand(b.name)}
              className="bg-white border rounded-md shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                <span className="text-sm text-gray-400">
                  {b.name.slice(0, 2).toUpperCase()}
                </span>
              </div>

              <div className="w-full flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">
                  {b.name}
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md ml-3">
                  {b.count}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
