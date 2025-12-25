// src/pages/SparesByHead.jsx
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useProducts } from "../contexts/ProductContexts";
import ProductCard from "../components/ProductCard";

function normalizeHead(str = "") {
  return str
    .toLowerCase()
    .replace(" plus", " plus")
    .replace(" head", "")
    .replace(/\s+/g, "-");
}

function addToBag(item) {
  const raw = localStorage.getItem("uc_cart_v1");
  const cart = raw ? JSON.parse(raw) : [];

  const id = item._id || item.id;
  const found = cart.find((c) => c.id === id);

  if (found) found.qty = (found.qty || 1) + 1;
  else {
    cart.push({
      id,
      title: item.title,
      price: item.price,
      mrp: item.mrp,
      image: item.images?.[0],
      qty: 1,
    });
  }

  localStorage.setItem("uc_cart_v1", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
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
    <section className="w-full py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">
          Spares for {head.replace(/-/g, " ").toUpperCase()}
        </h1>

        {filtered.length > 0 ? (
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
        ) : (
          <p className="text-gray-500">No spares available for this head.</p>
        )}
      </div>
    </section>
  );
}
