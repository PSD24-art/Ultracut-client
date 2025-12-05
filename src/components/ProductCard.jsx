import React from "react";
import { Link } from "react-router-dom";
import { slugify } from "../utility/Slugify";

export default function ProductCard({ item, onAddToBag, onBuyNow }) {
  return (
    <div className="group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      {/* Product Image */}
      <Link
        to={`/consumables/${item.slug}/${slugify(item.title)}`}
        className="block"
        aria-label={`View ${item.title}`}
      >
        <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={item.images?.[0] || null}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3">
        <h2 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 line-clamp-2">
          {item.title}
        </h2>

        <div className="mt-1 text-xs text-gray-500">
          {item.brand} • {item.head}
        </div>

        {/* Price Section */}
        <div className="mt-3 flex flex-col items-start">
          <div className="text-xs text-gray-400 line-through">₹{item.mrp}</div>

          <div className="text-lg font-semibold text-blue-600 leading-tight">
            ₹{item.price}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex  gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToBag?.(item);
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            Add to Bag
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              onBuyNow?.(item);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
