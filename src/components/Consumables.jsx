// src/components/Consumables.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContexts";

function normalizeProducts(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  if (raw.products && Array.isArray(raw.products)) return raw.products;
  return [];
}

export default function Consumables() {
  const navigate = useNavigate();
  const rawProducts = useProducts();
  const products = normalizeProducts(rawProducts);

  // extract unique categories
  const categories = useMemo(() => {
    const map = new Map();

    for (const p of products) {
      if (!p.category) continue;
      const key = String(p.category).toLowerCase();

      if (!map.has(key)) {
        map.set(key, {
          slug: key,
          title: key.replace(/-/g, " "),
          image: p.images?.[0] || "/images/placeholder.png",
        });
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }, [products]);

  if (!categories.length) {
    return (
      <div className="w-full py-20 text-center text-gray-500">
        No consumable categories found.
      </div>
    );
  }

  return (
    <section className="w-full py-8 secondary-bg-color secondary-bg-color">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-8 text-gray-800">
          Consumables
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => navigate(`/consumables/${cat.slug}`)}
              className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <div className="h-32 bg-gray-100 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 text-center">
                <h2 className="text-sm font-medium text-gray-800 capitalize">
                  {cat.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
