// src/components/HeadSelector.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * HeadSelector
 * - Renders sections (RayTools, OSPRI, WSX) with card grids
 * - Cards link to /consumables/{categorySlug}/{headSlug} by default
 * - Uses a simple slugify helper to create URL-friendly slugs
 *
 * Usage:
 * <HeadSelector />
 *
 * You can pass custom section data via props if you want to reuse it elsewhere.
 */

const data = [
  {
    sectionTitle: "Choose Spares According To RayTools Laser Cutting Head",
    items: [
      "RayTools BM110 Spares",
      "RayTools BM111 Spares",
      "RayTools BM06K Spares",
      "RayTools BM115 Spares",
      "RayTools BM114 Spares",
      "RayTools BM109 Spares",
      "RayTools BT220 Spares",
      "RayTools BT240 Spares",
    ],
  },
  {
    sectionTitle: "Choose Spares According To OSPRI Laser Cutting Head",
    items: [
      "OSPRI LC40 Spares",
      "OSPRI LC80 Spares",
      "OSPRI LC80 Plus Spares",
      "OSPRI LC218 Spares",
      "OSPRI LC608 Spares",
      "OSPRI LC808 Spares",
      "OSPRI LCM08 Spares",
    ],
  },
  {
    sectionTitle: "Choose Spares According To WSX Laser Cutting Head",
    items: ["WSX NC30 Spares", "WSX NC63 Spares", "WSX NC68 Spares"],
  },
];

// simple slugify
function getSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\+/g, "plus")
    .replace(/[\s&/]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export default function ShopByHead({ sections = data, category = "spares" }) {
  // category used in URL: e.g. /consumables/spares/raytools-bm110-spares
  return (
    <section className="w-full py-10 bg-white" id="head-selector">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {sections.map((sec, si) => (
          <div key={si} className="">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4">
              {sec.sectionTitle}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from(new Set(sec.items)).map((title) => {
                const headSlug = getSlug(title);
                const url = `/consumables/${category}/${headSlug}`;
                return (
                  <Link
                    key={headSlug}
                    to={url}
                    className="group block bg-white border rounded-lg p-3 hover:shadow-md transition"
                    title={title}
                  >
                    <div className="flex flex-col items-start gap-2">
                      <div className="w-full h-20 bg-gray-100 rounded-md flex items-center justify-center">
                        {/* placeholder icon / image */}
                        <span className="text-xs text-gray-400">{title}</span>
                      </div>

                      <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
                        {title}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        View spares
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
