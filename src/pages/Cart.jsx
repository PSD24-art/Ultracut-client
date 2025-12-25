import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "../components/Login"; // adjust path if needed

function formatPrice(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  // Replace this with your cart context or API on mount
  const [cart, setCart] = useState(() => {
    // try hydrate from localStorage (optional)
    try {
      const raw = localStorage.getItem("uc_cart_v1");
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    // persist locally (if desired)
    try {
      localStorage.setItem("uc_cart_v1", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 100;
  const total = Math.max(0, subtotal + shipping - discount);

  // Handler stubs: replace with your API/context logic
  function updateQty(itemId, newQty) {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, qty: newQty } : it)),
    );
  }

  function removeFromCart(productId) {
    const isConfirm = confirm(
      "Are you sure you want to remove this item from the cart?",
    );
    if (!isConfirm) return;

    setCart((prev) => {
      const updated = prev.filter((it) => it.id !== productId);

      localStorage.setItem("uc_cart_v1", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated"));

      return updated;
    });
  }

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setApplyingCoupon(true);
    // Replace this with server validation
    await new Promise((r) => setTimeout(r, 700));
    // demo: coupon "LASE10" gives ₹100 off or 10%
    if (coupon.trim().toUpperCase() === "LASE10") {
      const d = Math.min(500, Math.round(subtotal * 0.1));
      setDiscount(d);
    } else if (coupon.trim().toUpperCase() === "FLAT100") {
      setDiscount(100);
    } else {
      setDiscount(0);
      alert("Invalid coupon");
    }
    setApplyingCoupon(false);
  }

  function clearCoupon() {
    setCoupon("");
    setDiscount(0);
  }

  function checkout() {
    if (!user) {
      // open login modal instead of navigating away
      setShowLogin(true);
      return; // important — stop here
    }

    // Replace with real checkout flow (create order -> payment)
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    // Example: navigate to checkout page
    navigate("/checkout");
  }

  // handler when login succeeds
  function onLoginSuccess(data) {
    setShowLogin(false);

    navigate("/checkout");
  }
  function onLoginClose() {
    setShowLogin(false);
  }

  return (
    <>
      {showLogin && (
        <LoginModal
          open={showLogin}
          onSuccess={onLoginSuccess}
          onClose={onLoginClose}
        />
      )}
      <div className="w-full min-h-[60vh] secondary-bg-color py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

          {cart.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center">
              <p className="text-gray-600 mb-4">Your cart is empty.</p>
              <Link
                to="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT: Items list (col-span 2 on wide screens) */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg items-center"
                    >
                      <div className="w-28 h-28 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/consumables/${item.slug}`}
                          className="text-sm font-semibold text-gray-800 hover:text-blue-600 block"
                        >
                          {item.title}
                        </Link>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.brand} • SKU: {item.id}
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-4">
                          {/* Quantity */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="p-1 rounded-md border hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4 text-gray-700" />
                            </button>
                            <div className="px-3 py-1 border rounded text-sm">
                              {item.qty}
                            </div>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="p-1 rounded-md border hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>

                          {/* Price & remove */}
                          <div className="flex items-center gap-4">
                            <div className="text-sm font-semibold text-gray-800">
                              {formatPrice(item.price * item.qty)}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 rounded-md text-red-600 hover:bg-red-50"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* small screen price */}
                      <div className="sm:hidden mt-3">
                        <div className="text-sm font-semibold">
                          {formatPrice(item.price * item.qty)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon area */}
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex gap-3">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Have a coupon? Enter code"
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={applyingCoupon}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-60"
                    >
                      {applyingCoupon ? "Applying..." : "Apply"}
                    </button>
                    {discount > 0 && (
                      <button
                        onClick={clearCoupon}
                        className="px-3 py-2 rounded-md border"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="mt-3 text-sm text-green-700">
                      Coupon applied: -{formatPrice(discount)}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Order summary (sticky on desktop) */}
              <aside className="lg:col-span-1">
                <div className="border rounded-lg p-4 lg:sticky lg:top-24 bg-white">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                  <div className="flex justify-between text-sm text-gray-600">
                    <div>Subtotal</div>
                    <div>{formatPrice(subtotal)}</div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <div>Shipping</div>
                    <div>{shipping === 0 ? "Free" : formatPrice(shipping)}</div>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-700 mt-2">
                      <div>Discount</div>
                      <div>-{formatPrice(discount)}</div>
                    </div>
                  )}

                  <div className="border-t mt-4 pt-4 flex items-center justify-between">
                    <div className="text-lg font-semibold">Total</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatPrice(total)}
                    </div>
                  </div>

                  <button
                    onClick={checkout}
                    className="mt-4 w-full px-4 py-3 bg-blue-600 text-white rounded-md font-medium"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="mt-3 w-full px-4 py-2 border rounded-md text-sm"
                  >
                    Continue Shopping
                  </button>

                  <div className="text-xs text-gray-500 mt-3">
                    Secure payments. 100% original parts. Contact support for
                    bulk orders.
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
