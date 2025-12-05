import React from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContexts";

export default function Consumables() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="w-full py-20 text-center text-gray-600">
        Loading products...
      </div>
    );
  }

  if (!products || products.length === 0) {
    console.log("Products: ", products);

    return (
      <div className="w-full py-20 text-center text-red-500">
        No products available.
      </div>
    );
  }

  function handleClick(slug) {
    navigate(`/consumables/${slug}`);
  }

  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-8 text-gray-800">
          Fiber Laser Machine Consumables
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 gap-x-8">
          {products.length > 0 &&
            products.map((item) => (
              <div
                key={item._id}
                onClick={() => handleClick(item.slug)}
                className="group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.images?.[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-3">
                  <h2 className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
                    {item.title}
                  </h2>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
