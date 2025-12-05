import React from "react";
import { useNavigate } from "react-router-dom";
import { consumables as staticConsumables } from "../data/consumablesData";
import { useConsumables } from "../contexts/ConsumableContext";

export default function Consumables() {
  const navigate = useNavigate();
  const { getBySlug, refresh } = useConsumables();

  async function handleClick(item) {
    const slug = item.slug.toLowerCase();

    let found = getBySlug(slug);

    // If not loaded yet, fetch once
    if (!found) {
      await refresh();
      found = getBySlug(slug);
    }

    if (found) {
      navigate(`/consumables/${slug}`);
    } else {
      alert("Details not available for this item.");
    }
  }

  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-8 text-gray-800">
          Fiber Laser Machine Consumables
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 gap-x-8">
          {staticConsumables.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              className="group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
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
