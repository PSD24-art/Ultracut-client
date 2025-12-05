// src/pages/Items.jsx
import React, { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../contexts/ProductContexts";
import ProductCard from "../components/ProductCard";

export default function ConsumableItems() {
  const { slug } = useParams(); // example: "ceramic-ring"
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  // If still loading, show a simple loading state
  if (loading) {
    return (
      <div className="w-full py-20 text-center text-gray-600">
        Loading products...
      </div>
    );
  }

  const list = useMemo(() => {
    if (!products) return [];
    return products.filter(
      (p) => String(p.slug).toLowerCase() === String(slug).toLowerCase()
    );
  }, [products, slug]);

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

  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {slug.replace(/-/g, " ")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {list.length} product{list.length !== 1 ? "s" : ""}
          </p>
        </div>

        {list.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <p className="text-gray-600 mb-4">
              No products found for this consumable.
            </p>
            <Link
              to="/consumables"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              View All Consumables
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {list.map((item) => (
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
    </section>
  );
}
