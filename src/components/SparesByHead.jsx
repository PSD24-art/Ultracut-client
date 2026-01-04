// src/pages/SparesByHead.jsx
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useProducts } from "../contexts/ProductContexts";
import ProductCard from "../components/ProductCard";
import { addToBag, buyNow } from "../utility/CartUtility";

function normalizeHead(str = "") {
  return str
    .toLowerCase()
    .replace(" plus", " plus")
    .replace(" head", "")
    .replace(/\s+/g, "-");
}

export default function SparesByHead() {
  const { head } = useParams();
  const rawProducts = useProducts();

  // normalize products
  const products = useMemo(() => {
    if (Array.isArray(rawProducts)) return rawProducts;
    if (rawProducts?.products) return rawProducts.products;
    if (rawProducts?.data) return rawProducts.data;
    return [];
  }, [rawProducts]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (!product.head) return false;

      // Normalize head into array
      const heads = Array.isArray(product.head) ? product.head : [product.head];

      return heads.some((h) => normalizeHead(h) === head);
    });
  }, [products, head]);

  return (
    <section className="w-full py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">
          Spares for {head.replace(/-/g, " ").toUpperCase()}
        </h1>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <ProductCard
                key={item._id || item.id}
                item={item}
                onAddToBag={() => addToBag(item)}
                onBuyNow={() => buyNow(item)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No spares available for this head.</p>
        )}
      </div>
    </section>
  );
}
