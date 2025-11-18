import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import Header from "../components/Header";

function formatPrice(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function IndividualItem() {
  const { category, productSlug } = useParams();
  const navigate = useNavigate();
  // find product where slug matches and category matches (safety)
  const product = products.find(
    (p) => p.slug === productSlug && p.category === category
  );

  const [mainImage, setMainImage] = useState(product?.images?.[0] || "");
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <>
        <Header />
        <div className="w-full min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Product not found</h2>
            <p className="text-gray-600 mb-4">
              The requested product does not exist.
            </p>
            <Link
              to="/consumables"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              View All Consumables
            </Link>
          </div>
        </div>
      </>
    );
  }

  const discountPercent = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  function addToBag(item, quantity = 1) {
    try {
      const raw = localStorage.getItem("uc_cart_v1");
      const cart = raw ? JSON.parse(raw) : [];
      const found = cart.find((c) => c.id === item.id);
      if (found) {
        found.qty = (found.qty || 1) + quantity;
      } else {
        cart.push({ ...item, qty: quantity });
      }
      localStorage.setItem("uc_cart_v1", JSON.stringify(cart));
      window.dispatchEvent(
        new CustomEvent("cart-updated", { detail: { cart } })
      );
      // small feedback (you can replace with toast)
      alert(`${item.title} added to bag`);
    } catch (err) {
      console.error("Add to bag error", err);
      alert("Failed to add to bag");
    }
  }

  function buyNow(item, quantity = 1) {
    // proceed to checkout carrying only this item
    navigate("/checkout", { state: { items: [{ ...item, qty: quantity }] } });
  }

  return (
    <>
      <Header />

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
            <Link to={`/consumables/${category}`} className="hover:underline">
              {category.replace(/-/g, " ")}
            </Link>
            <span className="px-2">/</span>
            <span className="text-gray-700">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Images (md:col-span-6) */}
            <div className="md:col-span-6">
              <div className="bg-gray-100 rounded-lg overflow-hidden border h-[420px] flex items-center justify-center">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-contain p-6"
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(img)}
                      className={`w-20 h-20 rounded-md overflow-hidden border ${mainImage === img ? "ring-2 ring-blue-500" : ""}`}
                    >
                      <img
                        src={img}
                        alt={`${product.title}-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info (md:col-span-6) */}
            <div className="md:col-span-6 flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-800">
                {product.title}
              </h1>

              <div className="mt-2 text-sm text-gray-500">
                SKU:{" "}
                <span className="font-medium text-gray-700">{product.sku}</span>{" "}
                • Brand:{" "}
                <span className="font-medium text-gray-700">
                  {" "}
                  {product.brand}
                </span>{" "}
                • Head:{" "}
                <span className="font-medium text-gray-700">
                  {" "}
                  {product.head}
                </span>
              </div>

              {/* Price block */}
              <div className="mt-5 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 line-through">
                    ₹{product.mrp}
                  </span>
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

              {/* Short description */}
              <p className="mt-4 text-gray-700">{product.short}</p>

              {/* CTAs */}
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
                    // quick WhatsApp share / contact link (optional)
                    const msg = `Hi, I'm interested in ${product.title} (SKU: ${product.sku}). Please assist.`;
                    const url = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(msg)}`;
                    window.open(url, "_blank");
                  }}
                  className="w-full sm:w-auto px-4 py-3 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition"
                >
                  Contact via WhatsApp
                </button>
              </div>

              {/* Full description & specs */}
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

              {/* Stock / shipping */}
              <div className="mt-6 text-sm text-gray-600">
                {product.stock > 0 ? (
                  <div>In stock: {product.stock} items</div>
                ) : (
                  <div className="text-red-600">Out of stock</div>
                )}
                <div className="mt-1">
                  Delivery: 3-7 business days (estimate)
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
