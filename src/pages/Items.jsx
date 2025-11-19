import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { products } from "../data/products";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

function humanizeSlug(slug) {
  if (!slug) return "";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Items() {
  const { slug } = useParams(); // category slug
  const navigate = useNavigate();
  const categorySlug = slug;
  const list = products.filter((p) => p.category === categorySlug);

  // Default add-to-bag: simple localStorage cart (replace with context/api)
  function addToBag(item) {
    try {
      const raw = localStorage.getItem("uc_cart_v1");
      const cart = raw ? JSON.parse(raw) : [];
      // If same product exists, increase qty
      const found = cart.find((c) => c.id === item.id);
      if (found) found.qty = (found.qty || 1) + 1;
      else cart.push({ ...item, qty: 1 });
      localStorage.setItem("uc_cart_v1", JSON.stringify(cart));
      // small UI feedback
      window.dispatchEvent(
        new CustomEvent("cart-updated", { detail: { cart } })
      );
      alert(`${item.title} added to bag`);
    } catch (err) {
      console.error("Add to bag error", err);
    }
  }

  // Buy now: navigate to checkout carrying only this item
  function buyNow(item) {
    // you could create an order on server and redirect to payment instead
    navigate("/checkout", { state: { items: [{ ...item, qty: 1 }] } });
  }

  const pageTitle =
    (list[0] && list[0].meta && list[0].meta.title?.split("-")[0]) ||
    `${humanizeSlug(categorySlug)} - Consumables`;

  const pageDescription =
    (list[0] && list[0].meta && list[0].meta.description) ||
    `Browse ${humanizeSlug(categorySlug)} and related consumables for fiber laser machines.`;

  return (
    <>
      <section className="w-full py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              {humanizeSlug(categorySlug)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {list.length} product{list.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {list.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center">
              <p className="text-gray-600 mb-4">
                No products found in this category.
              </p>
              <Link
                to="/consumables"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
              >
                View All Consumables
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6">
              {list.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onAddToBag={addToBag}
                  onBuyNow={buyNow}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
