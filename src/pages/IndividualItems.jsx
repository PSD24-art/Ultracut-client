import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContexts";
import { addToBag, buyNow } from "../utility/CartUtility";
import placeholder from "../images/placeholder.png";
/* ---------------- Variant Button Component ---------------- */
function VariantSelector({ label, options = [], value, onChange }) {
  if (!Array.isArray(options) || options.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1 rounded-md border text-sm transition
              ${
                value === opt
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:border-gray-400"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Main Page ---------------- */
export default function IndividualProduct() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const rawProducts = useProducts();
  console.log(rawProducts.length);

  /* normalize products */
  const products = useMemo(() => {
    if (Array.isArray(rawProducts)) return rawProducts;
    if (rawProducts?.data) return rawProducts.data;
    if (rawProducts?.products) return rawProducts.products;
    return [];
  }, [rawProducts]);

  /* product lookup */
  const product = useMemo(
    () => products.find((p) => p.slug === slug),
    [products, slug],
  );

  /* early exit */
  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-3">Product not found</h2>
        <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Go Home
        </Link>
      </div>
    );
  }

  /* states */
  const [mainImage, setMainImage] = useState(
    product.images?.[0] || placeholder,
  );
  const [qty, setQty] = useState(1);
  const [style, setStyle] = useState(product.styles?.[0] || null);
  const [size, setSize] = useState(product.size?.[0] || null);
  const [capacity, setCapacity] = useState(product.capacity?.[0] || null);

  /* SEO */
  useEffect(() => {
    document.title = product.seo?.metaTitle || product.title;
  }, [product]);

  /* discount */
  const discount =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  /* cart logic */

  return (
    <main
      className="max-w-6xl mx-auto px-4 py-8"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/">Home</Link> /{" "}
        <span className="capitalize">{product.category}</span> /{" "}
        <span className="text-gray-700">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Images */}
        <div className="md:col-span-6">
          <div className="border rounded-lg bg-gray-50 h-[420px] flex items-center justify-center">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-contain p-6"
              itemProp="image"
            />
          </div>

          {product.images?.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 border rounded-md ${
                    img === mainImage ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title}-${i}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:col-span-6">
          <h1 className="text-2xl font-semibold">{product.title}</h1>

          <p className="text-sm text-gray-500 mt-1 capitalize">
            Brand: {product.brand}
          </p>

          {/* Price */}
          <div className="mt-4 flex items-center gap-4">
            {product.mrp && (
              <span className="line-through text-gray-400">₹{product.mrp}</span>
            )}
            <span className="text-2xl font-bold text-blue-600">
              ₹{product.price}
            </span>
            {discount > 0 && (
              <span className="text-sm text-green-600">{discount}% OFF</span>
            )}
          </div>

          {/* Variants */}
          <VariantSelector
            label="Style"
            options={product.styles}
            value={style}
            onChange={setStyle}
          />

          <VariantSelector
            label="Size"
            options={product.size}
            value={size}
            onChange={setSize}
          />

          <VariantSelector
            label="Capacity"
            options={product.capacity}
            value={capacity}
            onChange={setCapacity}
          />

          {/* Quantity */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1 border rounded"
            >
              -
            </button>
            <span>{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>

          {/* Stock */}
          <div className="mt-3 text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock})</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={addToBag}
              className="px-6 py-3 bg-blue-600 text-white rounded-md"
            >
              Add to Bag
            </button>
            <button
              onClick={() => buyNow(navigate, product)}
              className="px-6 py-3 border rounded-md"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}

      {/* Specs */}
      {product.specs && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Specifications</h2>
          <div className="border rounded-md divide-y text-sm">
            {Object.entries(product.specs)
              .filter(([_, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-2">
                  <span className="capitalize text-gray-600">{k}</span>
                  <span className="text-gray-800">{v}</span>
                </div>
              ))}
          </div>
        </section>
      )}
    </main>
  );
}
