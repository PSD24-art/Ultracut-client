// src/components/Header.jsx
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../contexts/ProductContexts";
import CartBadge from "./CartBadge";

function slugifyTitle(title = "") {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeProducts(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  if (raw.products && Array.isArray(raw.products)) return raw.products;
  return [];
}

function matchesQuery(p, q) {
  if (!q) return false;
  const s = q.toLowerCase();
  if (
    String(p.title || "")
      .toLowerCase()
      .includes(s)
  )
    return true;
  if (
    String(p.sku || "")
      .toLowerCase()
      .includes(s)
  )
    return true;
  if (
    String(p.brand || "")
      .toLowerCase()
      .includes(s)
  )
    return true;
  return false;
}

function ResultRow({ item, onClick }) {
  return (
    <button
      onClick={() => onClick(item)}
      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex gap-3 items-center"
    >
      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
        <img
          src={item.images?.[0] || item.image || "/images/placeholder.png"}
          alt={item.title}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-800">{item.title}</div>
        <div className="text-xs text-gray-500">
          {item.brand ? `${item.brand} • ` : ""}
          {item.sku ? item.sku : ""}
        </div>
      </div>
      <div className="text-sm text-gray-600">₹{item.price}</div>
    </button>
  );
}

function useDebounced(value, delay = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function Header({ onLoginClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false); // mobile drawer
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const searchRef = useRef(null); // wraps input + results

  const { user } = useAuth();

  // products from context
  const { products: rawProducts, loading: productsLoading } = useProducts();
  const products = normalizeProducts(rawProducts);

  const debouncedQuery = useDebounced(query, 200);

  // filter when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim() === "") {
      setResults([]);
      setShowResults(false);
      return;
    }
    const q = debouncedQuery.trim().toLowerCase();
    const matches = [];
    for (const p of products) {
      if (matchesQuery(p, q)) {
        matches.push(p);
        if (matches.length >= 8) break;
      }
    }
    setResults(matches);
    setShowResults(true);
  }, [debouncedQuery, products]);

  // close results on outside click (now checks the whole searchRef)
  useEffect(() => {
    function onDoc(e) {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function openProduct(item) {
    console.log(item.slug, item.title, "From header url");

    navigate(`/item/${item.slug}/${slugifyTitle(item.title)}`);
    setQuery("");
    setShowResults(false);
    setShowSearch(false);
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between md:justify-start md:gap-10 relative">
            {/* Mobile: Hamburger */}
            <div className="md:hidden flex items-center z-20">
              <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {open ? (
                  <X className="w-7 h-7 text-gray-700" />
                ) : (
                  <Menu className="w-7 h-7 text-gray-700" />
                )}
              </button>
            </div>

            {/* MOBILE: CENTERED LOGO */}
            <div className="md:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <h1 className="text-xl font-bold text-gray-800">Ultracut</h1>
            </div>

            {/* Desktop Logo */}
            <div className="hidden md:flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Ultracut</h1>
            </div>

            {/* Mobile Right Icons */}
            <div className="md:hidden flex items-center gap-4 z-20">
              <button className="p-2" onClick={() => setShowSearch((v) => !v)}>
                <Search className="w-6 h-6 text-gray-700" />
              </button>
              <button onClick={() => navigate("/cart")} className="p-2">
                <ShoppingCart className="w-7 h-7 text-gray-700" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 ml-auto">
              <div
                className={`navigationItemsDesktop hover:underline hover:underline-offset-5${
                  isActive("/")
                    ? "text-blue-600 underline underline-offset-5"
                    : ""
                }`}
                onClick={() => navigate("/")}
              >
                Home
              </div>

              <div
                className={`navigationItemsDesktop hover:underline hover:underline-offset-5 ${
                  isActive("/brands")
                    ? "text-blue-600 underline underline-offset-5"
                    : ""
                }`}
                onClick={() => navigate("/brands")}
              >
                Brands
              </div>

              <div
                className={`navigationItemsDesktop hover:underline hover:underline-offset-5${
                  isActive("/consumables")
                    ? "text-blue-600 underline underline-offset-5"
                    : ""
                }`}
                onClick={() => navigate("/consumables")}
              >
                Consumables
              </div>

              <div
                className={`navigationItemsDesktop hover:underline hover:underline-offset-5${
                  isActive("/contact")
                    ? "text-blue-600 underline underline-offset-5"
                    : ""
                }`}
                onClick={() => navigate("/contact")}
              >
                Contact
              </div>

              <div className="flex gap-1.5 relative">
                <button
                  className="p-2"
                  onClick={() => {
                    setShowSearch((v) => !v);
                    if (!showSearch)
                      setTimeout(
                        () =>
                          document
                            .getElementById("header-search-input")
                            ?.focus(),
                        50
                      );
                  }}
                >
                  <Search className="w-6 h-6 text-gray-700" />
                </button>

                <button
                  className="p-2 relative"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  <div className="absolute -top-1 -right-1">
                    <CartBadge />
                  </div>
                </button>
                <button
                  className="p-2 ml-1"
                  onClick={() => {
                    if (!user) navigate("/login");
                    else navigate("/profile");
                  }}
                >
                  {user ? (
                    <User className="w-6 h-6 text-gray-700" />
                  ) : (
                    <div className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:cursor-pointer">
                      Login
                    </div>
                  )}
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Search Bar (slides down) */}
        <div
          className={` transition-all duration-300 bg-white ${showSearch ? "max-h-80 py-3 overflow-visible" : "max-h-0 py-0 overflow-hidden"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* wrap input + results in searchRef */}
            <div ref={searchRef} className="relative">
              <div className="flex items-center gap-3 border rounded-lg px-4 py-2 shadow-sm">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  id="header-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full focus:outline-none text-gray-700 bg-transparent"
                  onFocus={() => {
                    if (results.length) setShowResults(true);
                    if (!showSearch) setShowSearch(true);
                  }}
                />
              </div>

              {/* Results dropdown - absolutely positioned so it doesn't change parent's height */}
              {showResults && results.length > 0 && (
                <div
                  className="no-scrollbar absolute left-0 right-0 mt-2 bg-white border shadow-md rounded-md overflow-y-auto z-50"
                  style={{ marginTop: 10, maxHeight: "18rem" }}
                >
                  {results.map((r) => (
                    <ResultRow
                      key={r._id || r.id || r.slug}
                      item={r}
                      onClick={openProduct}
                    />
                  ))}
                </div>
              )}

              {/* No results message */}
              {showResults && !productsLoading && results.length === 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border shadow-md rounded-md p-3 text-sm text-gray-600 z-50">
                  No products found
                </div>
              )}

              {/* Loading */}
              {productsLoading && (
                <div className="absolute left-0 right-0 mt-2 bg-white border shadow-md rounded-md z-50 p-3 text-sm text-gray-600">
                  Loading products…
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`md:hidden`}>
        <div
          className={`fixed inset-0 z-30 transition-opacity duration-300 ${open ? "opacity-60 pointer-events-auto bg-black" : "opacity-0 pointer-events-none"}`}
          onClick={() => setOpen(false)}
          aria-hidden={!open}
        />

        <aside
          className={`fixed top-20 left-0 bottom-0 z-40 w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}
          aria-hidden={!open}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-lg font-semibold">Menu</div>
          </div>

          <div className="px-4 py-4 space-y-3 overflow-y-auto h-full">
            <div
              className="navigationItemsMobile"
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
            >
              Home
            </div>
            <div
              className="navigationItemsMobile"
              onClick={() => {
                setOpen(false);
                navigate("/brands");
              }}
            >
              Brands
            </div>
            <div
              className="navigationItemsMobile"
              onClick={() => {
                setOpen(false);
                navigate("/consumables");
              }}
            >
              Consumables
            </div>
            <div
              className="navigationItemsMobile"
              onClick={() => {
                setOpen(false);
                navigate("/contact");
              }}
            >
              Contact
            </div>

            <div className="border-t mt-2 pt-3">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/cart");
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-800">Cart</span>
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  if (!user) onLoginClick?.();
                  else navigate("/profile");
                }}
                className="w-full flex items-center gap-3 mt-2 px-3 py-2 rounded-md hover:bg-gray-50"
              >
                <User className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-800">
                  {user ? "Account" : "Login"}
                </span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t text-sm text-gray-600">
              <div className="py-1">📞 +91 98XXXXXXX</div>
              <div className="py-1">📧 info@ultracut.com</div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Header;
