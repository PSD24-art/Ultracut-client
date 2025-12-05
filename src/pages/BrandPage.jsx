// src/pages/BrandPage.jsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../contexts/ProductContexts";

function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BrandPage() {
  const { brand: brandSlug } = useParams(); // slug from URL
  const { products, loading } = useProducts();

  // normalize products array
  const productArray = Array.isArray(products)
    ? products
    : products && products.products && Array.isArray(products.products)
      ? products.products
      : products && products.data && Array.isArray(products.data)
        ? products.data
        : [];

  // find a canonical brand name by matching slugified brand
  const brandName = useMemo(() => {
    if (!productArray.length) return decodeURIComponent(brandSlug || "");
    const brands = Array.from(
      new Set(productArray.map((p) => p.brand || "Unknown"))
    );
    const found = brands.find((b) => slugify(b) === String(brandSlug));
    return found || decodeURIComponent(brandSlug || "");
  }, [productArray, brandSlug]);

  // filter products with that exact brand name
  const filtered = useMemo(() => {
    if (!productArray.length) return [];
    return productArray.filter((p) => (p.brand || "") === brandName);
  }, [productArray, brandName]);

  return (
    <main className="w-full py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Products by {brandName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {loading && <div className="text-gray-600">Loading products…</div>}

        {!loading && filtered.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <p className="text-gray-600 mb-4">
              No products found for this brand.
            </p>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              Go Home
            </Link>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div
                key={p.id || p._id || p.slug}
                className="bg-white border rounded-md p-3"
              >
                <Link
                  to={`/consumables/${p.category}/${encodeURIComponent(p.title)}`}
                >
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden mb-3">
                    <img
                      src={p.images?.[0] || p.image || ""}
                      alt={p.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {p.title}
                  </div>
                </Link>
                <div className="text-xs text-gray-500 mt-2">₹{p.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
