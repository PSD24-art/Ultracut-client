// src/pages/BrandPage.jsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../contexts/ProductContexts";
import ProductCard from "../components/ProductCard";

function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function addToBag(item) {
  const raw = localStorage.getItem("uc_cart_v1");
  const cart = raw ? JSON.parse(raw) : [];
  const id = item._id || item.id;
  const found = cart.find((c) => c.id === id);

  if (found) found.qty = (found.qty || 1) + 1;
  else
    cart.push({
      id,
      title: item.title,
      price: item.price,
      mrp: item.mrp,
      image: item.images?.[0],
      qty: 1,
    });

  localStorage.setItem("uc_cart_v1", JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart-updated", { detail: { cart } }));
  alert(`${item.title} added to bag`);
}

function buyNow(item) {
  navigate("/checkout", {
    state: {
      items: [
        {
          id: item._id || item.id,
          title: item.title,
          price: item.price,
          qty: 1,
        },
      ],
    },
  });
}

export default function BrandPage() {
  const { brand: brandSlug } = useParams();
  console.log(brandSlug);

  const products = useProducts();

  // canonical brand display name
  const brandName = useMemo(() => {
    if (!products.length) return decodeURIComponent(brandSlug || "");
    const brands = Array.from(
      new Set(products.map((p) => p.brand || "Unknown")),
    );
    const found = brands.find((b) => slugify(b) === String(brandSlug));
    return found || decodeURIComponent(brandSlug || "");
  }, [products, brandSlug]);

  // filter products by canonical brand name
  const filtered = useMemo(() => {
    if (!products.length) return [];
    return products.filter((p) => (p.brand || "") === brandName);
  }, [products, brandName]);

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

        {filtered.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <p className="text-gray-600 mb-4">
              No products found for this brand.
            </p>
            l
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              Go Home
            </Link>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <ProductCard
                key={item._id || item.id}
                item={item}
                onAddToBag={() => addToBag(item)}
                onBuyNow={() => buyNow(item)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
