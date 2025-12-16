import { Menu, X, Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { sparesByHead } from "../data/sparesByHead";
import { sparesConsumables } from "../data/sparesConsumables";
import MobileDrawer from "./MobileDrawer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
function Header({ onLoginClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showConsumables, setShowConsumables] = useState(false);
  const [showSparesByHead, setShowSparesByHead] = useState(false);
  const sparesRef = useRef(null);
  const consumablesRef = useRef(null);
  const [mobileSubDrawer, setMobileSubDrawer] = useState(null);

  //login model
  const handleOnUserClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      onLoginClick(); // 🔥 opens modal + updates URL
    }
  };

  //UI click outside handlers could be added here for closing dropdowns when clicking outside
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
    <header className="bg-white shadow-sm sticky top-0 z-40">
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
            <h1 className="text-xl font-bold text-gray-800">Ultracut</h1>
          </div>

          {/* DESKTOP LOGO */}
          <div className="hidden md:flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Ultracut</h1>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 ml-auto">
            <div
              className="navigationItemsDesktop"
              onClick={() => navigate("/")}
            >
              Home
            </div>

            {/* CONSUMABLES DROPDOWN */}
            <div className="relative" ref={consumablesRef}>
              <div className="relative" ref={consumablesRef}>
                <div
                  className="navigationItemsDesktop flex items-center gap-1 select-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConsumables((v) => !v);
                    setShowSparesByHead(false);
                  }}
                >
                  <span>Consumables</span>

                  {/* Dropdown Arrow */}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showConsumables ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>

              {showConsumables && (
                <div className="absolute top-full mt-2 w-64 bg-white border rounded-xl shadow-lg z-50">
                  {sparesConsumables.map((item) => (
                    <div
                      key={item}
                      onClick={() => setShowConsumables(false)}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SPARES BY HEAD DROPDOWN */}
            <div className="relative" ref={sparesRef}>
              <div
                className="navigationItemsDesktop flex items-center gap-1 select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSparesByHead((v) => !v);
                  setShowConsumables(false);
                }}
              >
                <span>Spares By Head</span>

                {/* Dropdown Arrow */}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showSparesByHead ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {showSparesByHead && (
                <div className="absolute top-full mt-2 w-72 bg-white border rounded-xl shadow-lg z-50 overflow-y-auto">
                  {sparesByHead.map((item) => (
                    <div
                      key={item}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => setShowSparesByHead(false)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ICONS */}
            <div className="flex gap-2 ml-4">
              <button className="p-2" onClick={() => setShowSearch((v) => !v)}>
                <Search className="w-6 h-6 text-gray-700" />
              </button>
              <button className="p-2" onClick={() => navigate("/cart")}>
                <ShoppingCart className="w-6 h-6 text-gray-700" />
              </button>
              <button className="p-2" onClick={handleOnUserClick}>
                <User className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </nav>

          {/* MOBILE RIGHT ICONS */}
          <div className="md:hidden flex items-center gap-4 z-20">
            <button className="p-2" onClick={() => setShowSearch((v) => !v)}>
              <Search className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-2">
              <ShoppingCart className="w-7 h-7 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= SEARCH BAR (SLIDE) ================= */}
      <div
        className={`transition-all duration-300 bg-white ${
          showSearch ? "max-h-32 py-3" : "max-h-0 py-0 overflow-hidden"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 border rounded-lg px-4 py-2 shadow-sm">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full focus:outline-none text-gray-700 bg-transparent"
            />
          </div>
        </div>
      </div>

      <MobileDrawer
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
