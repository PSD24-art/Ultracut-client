// src/pages/ConsumableItems.jsx
import React, { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../contexts/ProductContexts";
import ProductCard from "../components/ProductCard";
import { addToBag, buyNow } from "../utility/CartUtility";

function normalizeProducts(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  if (raw.products && Array.isArray(raw.products)) return raw.products;
  return [];
}

export default function ConsumableItems() {
  const { category } = useParams();
  const navigate = useNavigate();
  const rawProducts = useProducts();
  const products = normalizeProducts(rawProducts);

  const list = useMemo(() => {
    return products.filter(
      (p) =>
        String(p.category || "").toLowerCase() ===
        String(category).toLowerCase(),
    );
  }, [products, category]);

  return (
    <section className="w-full py-10 secondary-bg-color">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 capitalize">
            {category.replace(/-/g, " ")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {list.length} product{list.length !== 1 ? "s" : ""}
          </p>
        </div>

        {list.length === 0 ? (
          <div className="w-full py-20 text-center">
            <p className="text-gray-600 mb-4">
              No products found for this category.
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
                onBuyNow={() => buyNow(navigate, item)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
