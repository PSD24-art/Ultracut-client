// src/pages/BIndividualItem.jsx
import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContexts";

function slugify(str = "") {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BIndividualItem() {
  const { brand: brandSlug, title: titleSlug } = useParams();
  const navigate = useNavigate();
  const { products = [], loading } = useProducts();

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="text-gray-600">Loading product...</div>
      </div>
    );
  }

  /* 🔹 Memoized product lookup (CPU optimization) */
  const product = useMemo(() => {
    return (
      products.find(
        (p) =>
          slugify(p.brand || "") === String(brandSlug) &&
          slugify(p.title || "") === String(titleSlug)
      ) ||
      products.find(
        (p) =>
          slugify(p.brand || "") === String(brandSlug) &&
          String(p.slug || "").toLowerCase() ===
            String(titleSlug).toLowerCase()
      )
    );
  }, [products, brandSlug, titleSlug]);

  if (!product) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Product not found</h2>
          <Link
            to={`/brands/${encodeURIComponent(brandSlug)}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            View Brand
          </Link>
        </div>
      </div>
    );
  }

  const [mainImage, setMainImage] = useState(product.images?.[0] || "");
  const [qty, setQty] = useState(1);

  const discountPercent = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  function addToBag(item, quantity = 1) {
    try {
      const raw = localStorage.getItem("uc_cart_v1");
      const cart = raw ? JSON.parse(raw) : [];

     const id = String(item._id || item.sku || item.id);
      const found = cart.find((c) => c.id === id);
      if (found) found.qty = (found.qty || 1) + quantity;
      else
        cart.push({
          id,
          title: item.title,
          price: item.price,
          mrp: item.mrp,
          image: item.images?.[0],
          qty: quantity,
        });

      localStorage.setItem("uc_cart_v1", JSON.stringify(cart));
      window.dispatchEvent(
        new CustomEvent("cart-updated", { detail: { cart } })
      );
      alert(`${item.title} added to bag`);
    } catch (err) {
      console.error("Add to bag error", err);
    }
  }

  function buyNow(item, quantity = 1) {
    const id = item._id || item.sku || item.id;
    navigate("/checkout", {
      state: {
        items: [{ id, title: item.title, price: item.price, qty: quantity }],
      },
    });
  }

  return (
    <main
      className="w-full py-8 bg-white"
      itemScope
      itemType="https://schema.org/Product" /* 🔹 SEO: product schema */
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span className="px-2">/</span>

          <Link to="/brands" className="hover:underline">
            Brands
          </Link>
          <span className="px-2">/</span>

          <Link
            to={`/brands/${encodeURIComponent(brandSlug)}`}
            className="hover:underline"
          >
            {decodeURIComponent(brandSlug)}
          </Link>
          <span className="px-2">/</span>

          <span className="text-gray-700">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* LEFT: images */}
          <div className="md:col-span-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden border h-[420px] flex items-center justify-center">
              <img
                src={mainImage}
                alt={product.title}
                width="420"              /* 🔹 CLS fix */
                height="420"
                loading="eager"          /* 🔹 LCP optimized */
                decoding="async"
                className="w-full h-full object-contain p-6"
                itemProp="image"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 rounded-md overflow-hidden border ${
                      mainImage === img ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title}-${i}`}
                      width="80"
                      height="80"
                      loading="lazy"       /* 🔹 Lazy thumbnails */
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: details */}
          <div className="md:col-span-6 flex flex-col">
            <h1 className="text-2xl font-semibold text-gray-800">
              {product.title}
            </h1>

            <div className="mt-5 flex items-center gap-6">
              <div className="flex flex-col">
                {product.mrp && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{product.mrp}
                  </span>
                )}
                <span className="text-2xl font-bold text-blue-600">
                  ₹{product.price}
                </span>
                {discountPercent > 0 && (
                  <span className="text-sm text-green-600 mt-1">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-700"
                  >
                    -
                  </button>
                  <div className="px-4 py-2">{qty}</div>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-2 text-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-gray-700">{product.short}</p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToBag(product, qty)}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                Add to Bag
              </button>

              <button
                onClick={() => buyNow(product, qty)}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Buy Now
              </button>

              <button
                onClick={() => {
                  const msg = `Hi, I'm interested in ${product.title}.`;
                  const url = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(msg)}`;
                  window.open(url, "_blank");
                }}
                className="w-full sm:w-auto px-4 py-3 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition"
              >
                Contact via WhatsApp
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h2>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {product.specs && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Specifications
                </h3>
                <div className="bg-gray-50 border rounded-md p-4 text-sm">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between py-1 border-b last:border-b-0"
                    >
                      <div className="capitalize text-gray-700">{k}</div>
                      <div className="text-gray-600">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 text-sm text-gray-600">
              {product.stock > 0 ? (
                <div>In stock: {product.stock} items</div>
              ) : (
                <div className="text-red-600">Out of stock</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
