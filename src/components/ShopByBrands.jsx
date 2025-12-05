// src/components/ShopByBrands.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContexts"; // ensure this path matches your file

const fallbackBrands = [
  { id: 1, name: "Brand A", image: "" },
  { id: 2, name: "Brand B", image: "" },
  { id: 3, name: "Brand C", image: "" },
  { id: 4, name: "Brand D", image: "" },
];

function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ShopByBrands() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  // Normalize products to an array (handle unexpected shapes)
  const productArray = useMemo(() => {
    if (Array.isArray(products)) return products;
    if (!products) return [];
    if (products.products && Array.isArray(products.products))
      return products.products;
    if (products.data && Array.isArray(products.data)) return products.data;
    console.warn("ShopByBrands: unexpected products shape", products);
    return [];
  }, [products]);

  // Build brand list with counts
  const brands = useMemo(() => {
    if (!productArray.length)
      return fallbackBrands.map((b) => ({ ...b, count: 0 }));

    const counts = productArray.reduce((acc, p) => {
      const name = (p && p.brand && String(p.brand).trim()) || "Unknown";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts)
      .map((name, idx) => ({
        id: idx + 1,
        name,
        slug: slugify(name),
        image: "", // optional: read from product.meta.brandLogo if you add it later
        count: counts[name],
      }))
      .sort((a, b) => b.count - a.count);
  }, [productArray]);

  function openBrand(name) {
    const slug = slugify(name);
    navigate(`/brands/${encodeURIComponent(slug)}`);
  }

  return (
    <section id="brands" className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Shop by Brands
          </h2>
          <a
            href="#shop"
            className="text-sm text-blue-600 hover:underline hidden sm:inline"
          >
            View All
          </a>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(brands.length ? brands : fallbackBrands).map((b) => (
            <button
              key={b.id + b.name}
              onClick={() => openBrand(b.name)}
              className="bg-white border rounded-md shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md hover:cursor-pointer transition text-left"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                {b.image ? (
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-400">
                    {b.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="w-full flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">
                  {b.name}
                </div>
                {typeof b.count === "number" && (
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md ml-3">
                    {b.count}
                  </div>
                )}
              </div>

              {loading && (
                <div className="text-xs text-gray-400 mt-2">Loading…</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
