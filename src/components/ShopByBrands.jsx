// src/components/ShopByBrands.jsx
import { useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useProducts } from "../contexts/ProductContexts";
import raytool from "../assets/HomeBrands/RaytoolsLogo.avif";
import wsx from "../assets/HomeBrands/WsxLogo.avif";
import ospri from "../assets/HomeBrands/OspriLogo.avif";
import boci from "../assets/HomeBrands/BochuLogo.avif";
import { ArrowBigRight, ArrowRight, ChevronRight } from "lucide-react";

const HOME_BRANDS = ["raytool", "wsx", "ospri", "boci"];
const BRAND_IMAGES = {
  raytool,
  wsx,
  ospri,
  boci,
};

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
  const rawProducts = useProducts();

  // normalize to array
  const products = useMemo(() => {
    if (Array.isArray(rawProducts)) return rawProducts;
    if (rawProducts?.data && Array.isArray(rawProducts.data))
      return rawProducts.data;
    if (rawProducts?.products && Array.isArray(rawProducts.products))
      return rawProducts.products;
    return [];
  }, [rawProducts]);

  const allBrands = useMemo(() => {
    const counts = {};
    for (const p of products) {
      const name = (p?.brand || "Unknown").trim();
      counts[name] = (counts[name] || 0) + 1;
    }

    return Object.entries(counts).map(([name, count], i) => ({
      id: i + 1,
      name,
      slug: slugify(name),
      count,
    }));
  }, [products]);

  const homeBrands = useMemo(() => {
    return allBrands.filter((b) => HOME_BRANDS.includes(b.slug));
  }, [allBrands]);

  function openBrand(name) {
    console.log(encodeURIComponent(slugify(name)));
    navigate(`/brands/${encodeURIComponent(slugify(name))}`, { replace: true });
  }

  // Only use scrolling controls on home page
  const isHome = location.pathname === "/";

  if (!products.length || (isHome && !homeBrands.length)) {
    return (
      <section id="brands" className="w-full py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          No brands available
        </div>
      </section>
    );
  }

  return (
    <section id="brands" className="w-full py-6 secondary-bg-color ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Shop by Brands
          </h2>
          <Link
            to="/brands"
            className="text-sm highlighted-text hover:underline hover:underline-offset-4 hidden sm:inline"
          >
            View All
          </Link>
        </div>
        {isHome ? (
          <div className="relative">
            <div
              className="
        grid grid-cols-2 gap-4
        md:flex md:gap-4 md:overflow-x-hidden md:px-6 md:py-2
      "
              style={{ scrollSnapType: "x mandatory" }}
            >
              {homeBrands.map((b) => (
                <div
                  key={b.id + b.name}
                  onClick={() => openBrand(b.name)}
                  className="
            group
            bg-white border rounded-md shadow-sm p-4
            flex flex-col items-center text-center
            cursor-pointer transition-all duration-300
            hover:shadow-md

            md:flex-shrink-0 md:basis-1/4 md:max-w-[25%] md:min-w-[200px]
          "
                  style={{ scrollSnapAlign: "start" }}
                >
                  {/* IMAGE */}
                  <div className="w-full h-20 bg-gray-100 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                    {BRAND_IMAGES[b.slug] ? (
                      <img
                        src={BRAND_IMAGES[b.slug]}
                        alt={`${b.name} brand`}
                        className="w-full h-full object-contain p-2"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">
                        {b.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* NAME + ARROW */}
                  <div className="w-full flex items-center justify-between">
                    <div className="text-sm font-medium flex items-center text-gray-700">
                      {b.name.charAt(0).toUpperCase() + b.name.slice(1)}
                      <ArrowRight
                        className="
                  h-4 w-4 ml-2 text-gray-500
                  transition-transform duration-300 ease-out
                  group-hover:translate-x-2 group-hover:text-gray-700
                "
                      />
                    </div>

                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md ml-3">
                      {b.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {allBrands.map((b) => (
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
