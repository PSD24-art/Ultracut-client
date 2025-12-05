// src/pages/ConsumableDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useConsumables } from "../contexts/ConsumableContext";

function formatPrice(n) {
  return typeof n === "number" ? `₹${n.toLocaleString("en-IN")}` : n;
}

export default function ConsumableDetail() {
  const { slug } = useParams();
  const { getBySlug, loading } = useConsumables();
  const navigate = useNavigate();

  // lookup (context already normalizes slugs to lowercase)
  const item = getBySlug(slug);

  const [qty, setQty] = useState(1);

  // optional: set document title when item available
  useEffect(() => {
    if (item && item.title) {
      const prev = document.title;
      document.title = `${item.title} — Consumables`;
      return () => {
        document.title = prev;
      };
    }
  }, [item]);

  // Loading state
  if (loading && !item) {
    return (
      <main className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gray-600">Loading consumable…</div>
        </div>
      </main>
    );
  }

  // Not found after loading complete
  if (!item) {
    return (
      <main className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full min-h-[40vh] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Consumable not found
              </h2>
              <p className="text-gray-600 mb-4">
                The requested consumable does not exist.
              </p>
              <Link
                to="/consumables"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                View All Consumables
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  function addToCart() {
    try {
      const raw = localStorage.getItem("uc_cart_v1");
      const cart = raw ? JSON.parse(raw) : [];
      const found = cart.find(
        (c) => c.id === item.id && c.type === "consumable"
      );

      if (found) found.qty = (found.qty || 1) + qty;
      else cart.push({ ...item, qty, type: "consumable" });

      localStorage.setItem("uc_cart_v1", JSON.stringify(cart));
      window.dispatchEvent(
        new CustomEvent("cart-updated", { detail: { cart } })
      );
      // small non-blocking feedback
      try {
        // prefer non-blocking toast if you have one; fallback to alert
        // toast?.success?.(`${item.title} added to cart`);
        // fallback:
        alert(`${item.title} added to cart`);
      } catch (e) {
        /* ignore */
      }
    } catch (err) {
      console.error("Add to cart error", err);
      alert("Failed to add to cart");
    }
  }

  function buyNow() {
    navigate("/checkout", {
      state: { items: [{ ...item, qty, type: "consumable" }] },
    });
  }

  return (
    <main className="w-full py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link to="/consumables" className="hover:underline">
            Consumables
          </Link>
          <span className="px-2">/</span>
          <span className="text-gray-700">{item.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden border h-[420px] flex items-center justify-center">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain p-6"
              />
            </div>
          </div>

          <div className="md:col-span-6 flex flex-col">
            <h1 className="text-2xl font-semibold text-gray-800">
              {item.title}
            </h1>

            <div className="mt-4 text-gray-700">
              {item.short || item.description || (
                <p>
                  Buy {item.title} at the best price in India. Contact us to get
                  a quote.
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-6">
              <div className="flex flex-col">
                {item.mrp && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(item.mrp)}
                  </span>
                )}
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(item.price || "Call for price")}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2"
                  >
                    -
                  </button>
                  <div className="px-4 py-2">{qty}</div>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-2"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={addToCart}
                className="px-6 py-3 bg-blue-600 text-white rounded-md"
              >
                Add to Cart
              </button>
              <button onClick={buyNow} className="px-6 py-3 border rounded-md">
                Buy Now
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Details
              </h2>
              <div className="text-gray-700 leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.description || item.short || "",
                  }}
                />
              </div>
            </div>

            {item.specs && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Specifications
                </h3>
                <div className="bg-gray-50 border rounded-md p-4 text-sm">
                  {Object.entries(item.specs).map(([k, v]) => (
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
              {typeof item.stock === "number" ? (
                item.stock > 0 ? (
                  <div>In stock: {item.stock} items</div>
                ) : (
                  <div className="text-red-600">Out of stock</div>
                )
              ) : null}
              <div className="mt-1">Delivery: 3-7 business days (estimate)</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
