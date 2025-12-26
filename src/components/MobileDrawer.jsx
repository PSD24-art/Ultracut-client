import { ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------- HELPERS (same logic as desktop) ---------- */
function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/\+/g, "plus")
    .replace(/[\s&/]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

function slugifyHead(head = "") {
  return head
    .toLowerCase()
    .replace(" plus", "-plus")
    .replace(" head", "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function MobileDrawer({
  mobileOpen,
  setMobileOpen,
  mobileSubDrawer,
  setMobileSubDrawer,
  sparesConsumables,
  sparesByHead,
}) {
  const navigate = useNavigate();

  return (
    <div className="md:hidden">
      {/* ================= MAIN OVERLAY ================= */}
      <div
        className={`fixed inset-0 bg-black top-20 transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ================= MAIN DRAWER ================= */}
      <aside
        className={`fixed top-20 left-0 bottom-0 w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-4 space-y-3">
          {/* HOME */}
          <div
            className="navigationItemsMobile"
            onClick={() => {
              navigate("/");
              setMobileOpen(false);
            }}
          >
            Home
          </div>

          {/* CONSUMABLES */}
          <div
            className="navigationItemsMobile"
            onClick={() => setMobileSubDrawer("consumables")}
          >
            Consumables
          </div>

          {/* SPARES BY HEAD */}
          <div
            className="navigationItemsMobile"
            onClick={() => setMobileSubDrawer("spares")}
          >
            Spares by Head
          </div>

          {/* CONTACT */}
          <div
            className="navigationItemsMobile"
            onClick={() => {
              navigate("/contact");
              setMobileOpen(false);
            }}
          >
            Contact
          </div>

          {/* CART & LOGIN */}
          <div className="border-t pt-3 mt-3 space-y-2">
            <button
              className="flex items-center gap-3 hover:cursor-pointer"
              onClick={() => {
                navigate("/cart");
                setMobileOpen(false);
              }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </button>

            <button
              className="flex items-center gap-3 hover:cursor-pointer"
              onClick={() => {
                navigate("/user");
                setMobileOpen(false);
              }}
            >
              <User className="w-5 h-5" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= SUB DRAWER ================= */}
      <div>
        {/* SUB OVERLAY */}
        <div
          className={`fixed inset-0 bg-black top-20 transition-opacity duration-300 ${
            mobileSubDrawer
              ? "opacity-50 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileSubDrawer(null)}
        />

        {/* SUB DRAWER */}
        <aside
          className={`fixed top-20 left-0 bottom-0 w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 z-50 ${
            mobileSubDrawer ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* SUB HEADER */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <button onClick={() => setMobileSubDrawer(null)} className="p-1">
              ←
            </button>
            <div className="text-base font-semibold">
              {mobileSubDrawer === "consumables"
                ? "Consumables"
                : "Spares by Head"}
            </div>
          </div>

          {/* SUB LIST */}
          <div className="px-4 py-4 space-y-2 overflow-y-auto h-full">
            {/* CONSUMABLES LIST */}
            {mobileSubDrawer === "consumables" &&
              sparesConsumables.map((item) => (
                <div
                  key={item}
                  className="px-3 py-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate(`/consumables/${slugify(item)}`);
                    setMobileSubDrawer(null);
                    setMobileOpen(false);
                  }}
                >
                  {item}
                </div>
              ))}

            {/* SPARES BY HEAD LIST */}
            {mobileSubDrawer === "spares" &&
              sparesByHead.map((item) => (
                <div
                  key={item}
                  className="px-3 py-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate(`/spares-by-head/${slugifyHead(item)}`);
                    setMobileSubDrawer(null);
                    setMobileOpen(false);
                  }}
                >
                  {item}
                </div>
              ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MobileDrawer;
