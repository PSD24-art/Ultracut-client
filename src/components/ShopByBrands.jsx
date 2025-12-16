// src/components/ShopByBrands.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useProducts  } from "../contexts/ProductContexts";
import Loader from "./Loader";

function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ShopByBrands() {
  const navigate = useNavigate();
  const location = useLocation();
  const { products: rawProducts, loading } = useProducts();

  // normalize to array
  const products = useMemo(() => {
    if (Array.isArray(rawProducts)) return rawProducts;
    if (rawProducts?.data && Array.isArray(rawProducts.data))
      return rawProducts.data;
    if (rawProducts?.products && Array.isArray(rawProducts.products))
      return rawProducts.products;
    return [];
  }, [rawProducts]);

  const brands = useMemo(() => {
    const counts = {};
    for (const p of products) {
      const name = (p?.brand || "Unknown").trim();
      counts[name] = (counts[name] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count], i) => ({
        id: i + 1,
        name,
        slug: slugify(name),
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  function openBrand(name) {
    navigate(`/brands/${encodeURIComponent(slugify(name))}`);
  }

  // Only use scrolling controls on home page
  const isHome = location.pathname === "/";

  // scrolling controls (only used when isHome)
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    const el = rowRef.current;
    if (!el) return;

    function update() {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 1);
    }

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [brands.length, isHome]);

  function scrollByPage(direction = "right") {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth;
    el.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  // show basic loading / empty states
  if (loading) {
    return (
     <Loader/>
    );
  }

  if (!products.length || !brands.length) {
    return (
      <section id="brands" className="w-full py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          No brands available
        </div>
      </section>
    );
  }

  return (
    <section id="brands" className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Shop by Brands
          </h2>
          <Link to="/brands" className="text-sm text-blue-600 hidden sm:inline">
            View All
          </Link>
        </div>

        {isHome ? (
          // Home: horizontally scrollable row with arrows (4 visible)
          <div className="relative">
            <button
              onClick={() => scrollByPage("left")}
              aria-label="Scroll left"
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white border shadow-sm ${
                canScrollLeft ? "opacity-100" : "opacity-40 pointer-events-none"
              }`}
              style={{ transform: "translateY(-50%)", marginLeft: -12 }}
            >
              &lt;
            </button>

            <div
              ref={rowRef}
              className="flex gap-4 overflow-x-auto px-6 py-2"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {brands.map((b) => (
                <div
                  key={b.id + b.name}
                  onClick={() => openBrand(b.name)}
                  className="flex-shrink-0 basis-1/4 max-w-[25%] min-w-[200px] bg-white border rounded-md shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition cursor-pointer"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                    <span className="text-sm text-gray-400">
                      {b.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="w-full flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">
                      {b.name}
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md ml-3">
                      {b.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollByPage("right")}
              aria-label="Scroll right"
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white border shadow-sm ${
                canScrollRight
                  ? "opacity-100"
                  : "opacity-40 pointer-events-none"
              }`}
              style={{ transform: "translateY(-50%)", marginRight: -12 }}
            >
              &gt;
            </button>
          </div>
        ) : (
          // Not home: show full grid (4 columns)
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {brands.map((b) => (
              <button
                key={b.id + b.name}
                onClick={() => openBrand(b.name)}
                className="bg-white border rounded-md shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                  <span className="text-sm text-gray-400">
                    {b.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>

                <div className="w-full flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700">
                    {b.name}
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md ml-3">
                    {b.count}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
