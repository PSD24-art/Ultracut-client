import { Menu, X, Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sparesByHead } from "../data/sparesByHead";
import { sparesConsumables } from "../data/sparesConsumables";
import MobileDrawer from "./MobileDrawer";
import { useAuth } from "../contexts/AuthContext";
import { slugify } from "../utility/Slugify";
import { useProducts } from "../contexts/ProductContexts";
import SearchResults from "./SearchResults";
import CartBadge from "./CartBadge";
import Logo from "../assets/Logo-Photoroom.png";

function Header({ onLoginClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const products = useProducts(); // already normalized in your app
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showConsumables, setShowConsumables] = useState(false);
  const [showSparesByHead, setShowSparesByHead] = useState(false);
  const [mobileSubDrawer, setMobileSubDrawer] = useState(null);
  const consumablesRef = useRef(null);
  const sparesRef = useRef(null);

  function slugifyHead(head) {
    return head
      .toLowerCase()
      .replace(" plus", "-plus")
      .replace(" head", "")
      .replace(/\s+/g, "-");
  }
  //Debaouce effext for search
  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }

    const id = setTimeout(() => {
      const q = query.toLowerCase();

      const results = products.filter((p) => p.title.toLowerCase().includes(q));

      setFiltered(results.slice(0, 10)); // limit results
    }, 300);

    return () => clearTimeout(id);
  }, [query, products]);

  /* ---------------- USER CLICK ---------------- */
  const handleOnUserClick = () => {
    if (user) navigate("/profile");
    else onLoginClick();
  };

  /* ---------------- CLICK OUTSIDE HANDLER ---------------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        consumablesRef.current &&
        !consumablesRef.current.contains(e.target)
      ) {
        setShowConsumables(false);
      }

      if (sparesRef.current && !sparesRef.current.contains(e.target)) {
        setShowSparesByHead(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-300 shadow-sm fixed w-full top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= TOP BAR ================= */}
        <div className="h-20 flex items-center justify-between relative">
          {/* MOBILE MENU */}
          <div className="md:hidden z-20">
            <button className="p-2" onClick={() => setMobileOpen((v) => !v)}>
              {mobileOpen ? (
                <X className="w-7 h-7 text-gray-700" />
              ) : (
                <Menu className="w-7 h-7 text-gray-700" />
              )}
            </button>
          </div>

          {/* MOBILE LOGO */}
          <div className="md:hidden absolute left-1/2 -translate-x-1/2">
            <img
              src={Logo}
              alt="Ultracut Logo"
              className="h-8 w-auto cursor-pointer object-contain"
              onClick={() => navigate("/")}
            />
          </div>

          {/* DESKTOP LOGO */}
          <div
            className="hidden md:flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="Ultracut Logo"
              className="h-10 lg:h-12 w-auto object-contain"
            />
          </div>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden md:flex items-center gap-8 ml-auto">
            <div
              className="navigationItemsDesktop cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </div>

            {/* ---------- CONSUMABLES DROPDOWN ---------- */}
            <div className="relative" ref={consumablesRef}>
              <div
                className="navigationItemsDesktop flex items-center gap-1 cursor-pointer select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConsumables((v) => !v);
                  setShowSparesByHead(false);
                }}
              >
                <span>Consumables</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showConsumables ? "rotate-180" : ""
                  }`}
                />
              </div>

              {showConsumables && (
                <div className="absolute top-full mt-2 w-64 bg-white border rounded-xl shadow-lg z-50 text-gray-800">
                  {sparesConsumables.map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setShowConsumables(false);
                        navigate(`/consumables/${slugify(item)}`);
                      }}
                      className="px-4 py-2 text-sm hover:bg-gray-100 hover:rounded-xl cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ---------- SPARES BY HEAD ---------- */}
            <div className="relative" ref={sparesRef}>
              <div
                className="navigationItemsDesktop flex items-center gap-1 cursor-pointer select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSparesByHead((v) => !v);
                  setShowConsumables(false);
                }}
              >
                <span>Spares By Head</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showSparesByHead ? "rotate-180" : ""
                  }`}
                />
              </div>

              {showSparesByHead && (
                <div className="absolute top-full mt-2 w-72 bg-white border rounded-xl shadow-lg z-50 text-gray-800">
                  {sparesByHead.map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setShowSparesByHead(false);
                        navigate(`/spares-by-head/${slugifyHead(item)}`);
                      }}
                      className="px-4 py-2 text-sm hover:bg-gray-100 hover:rounded-xl cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ---------- ICONS ---------- */}
            <div className="flex gap-2 ml-4">
              <button className="p-2" onClick={() => setShowSearch((v) => !v)}>
                <Search className="w-6 h-6 text-gray-700" />
              </button>

              <button className="p-2" onClick={() => navigate("/cart")}>
                <div className="absolute top-3 right-11">
                  {" "}
                  <CartBadge />
                </div>
                <ShoppingCart className="w-6 h-6 text-gray-700" />
              </button>

              <button className="p-2" onClick={handleOnUserClick}>
                <User className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </nav>

          {/* ================= MOBILE RIGHT ICONS ================= */}
          <div className="md:hidden flex items-center gap-4 z-20">
            <button className="p-2" onClick={() => setShowSearch((v) => !v)}>
              <Search className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-2" onClick={() => navigate("/cart")}>
              <div className="absolute top-3 -right-1">
                {" "}
                <CartBadge />
              </div>

              <ShoppingCart className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}
      {/* ================= SEARCH BAR ================= */}
      <div
        className={`relative transition-all duration-300 bg-white ${
          showSearch ? "max-h-[500px] py-3" : "max-h-0 py-0 overflow-hidden"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative border rounded-lg shadow-sm bg-white">
            {/* INPUT */}
            <div className="flex items-center gap-3 px-4 py-2">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full focus:outline-none text-gray-700 bg-transparent"
              />
            </div>

            {/* RESULTS */}
            {query && (
              <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 z-50">
                <SearchResults
                  results={filtered}
                  onClose={() => {
                    setShowSearch(false);
                    setQuery("");
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      <MobileDrawer
        onLoginClick={onLoginClick}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        mobileSubDrawer={mobileSubDrawer}
        setMobileSubDrawer={setMobileSubDrawer}
        sparesConsumables={sparesConsumables}
        sparesByHead={sparesByHead}
      />
    </header>
  );
}

export default Header;
