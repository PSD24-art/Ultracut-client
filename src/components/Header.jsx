import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // controls mobile drawer
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

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
              {/* Search */}
              <button className="p-2" onClick={() => setShowSearch((v) => !v)}>
                <Search className="w-6 h-6 text-gray-700" />
              </button>

              {/* Cart */}
              <button onClick={() => navigate("/cart")} className="p-2">
                <ShoppingCart className="w-7 h-7 text-gray-700" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 ml-auto">
              <div
                className="navigationItemsDesktop"
                onClick={() => navigate("/")}
              >
                Home
              </div>
              <div
                className="navigationItemsDesktop"
                onClick={() => navigate("/brands")}
              >
                Brands
              </div>
              <div
                className="navigationItemsDesktop"
                onClick={() => navigate("/consumables")}
              >
                Consumables
              </div>
              <div
                className="navigationItemsDesktop"
                onClick={() => navigate("/contact")}
              >
                Contact
              </div>
              <div className="flex gap-1.5">
                {/* Desktop Search Icon */}
                <button
                  className="p-2"
                  onClick={() => setShowSearch((v) => !v)}
                >
                  <Search className="w-6 h-6 text-gray-700" />
                </button>

                {/* Desktop Cart Icon */}
                <button
                  className="p-2 relative"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                </button>

                {/* Desktop User Icon */}
                <button className="p-2 ml-1">
                  <User className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Search Bar (slides down) */}
        <div
          className={`overflow-hidden transition-all duration-300 bg-white ${showSearch ? "max-h-20 py-3" : "max-h-0 py-0"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 border rounded-lg px-4 py-2 shadow-sm">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full focus:outline-none text-gray-700"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay + panel (only visible on small screens) */}
      {/* top-20 aligns drawer below header (header height = 5rem -> top-20) */}
      <div className={`md:hidden`}>
        {/* Overlay */}
        <div
          className={`fixed inset-0 z-30 transition-opacity duration-300 ${open ? "opacity-60 pointer-events-auto bg-black" : "opacity-0 pointer-events-none"}`}
          onClick={() => setOpen(false)}
          aria-hidden={!open}
        />

        {/* Left drawer panel */}
        <aside
          className={`fixed top-20 left-0 bottom-0 z-40 w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "-translate-x-full"}`}
          aria-hidden={!open}
        >
          {/* Header inside drawer */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-lg font-semibold">Menu</div>
          </div>

          {/* Drawer Content */}
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
                  navigate("/user");
                }}
                className="w-full flex items-center gap-3 mt-2 px-3 py-2 rounded-md hover:bg-gray-50"
              >
                <User className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-800">
                  Login / Account
                </span>
              </button>
            </div>

            {/* Optional: quick contact / phone */}
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
