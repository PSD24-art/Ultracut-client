// src/pages/SearchResults.jsx
import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { query = "", results = [] } = location.state || {};

  return (
    <main className="w-full py-6 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Search results for “{query}”
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="w-full py-20 text-center text-gray-600">
            No results found.
            <div className="mt-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Go back
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((item) => (
              <ProductCard key={item._id || item.id || item.slug} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
