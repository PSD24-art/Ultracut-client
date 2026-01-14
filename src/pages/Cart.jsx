import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "../components/Login";
import CheckoutInfo from "./static/CheckoutInfo";
import placeholder from "../images/placeholder.png";
import { removeItem } from "../utility/CartUtility";

function formatPrice(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Cart() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("uc_cart_v1");
      if (!raw) return [];

      const parsed = JSON.parse(raw);

      // normalize duplicates by product id
      const map = new Map();

      for (const item of parsed) {
        if (!item?.id) continue;

        if (map.has(item.id)) {
          // if same product exists, increase quantity
          const existing = map.get(item.id);
          map.set(item.id, {
            ...existing,
            qty: (existing.qty || 1) + (item.qty || 1),
          });
        } else {
          map.set(item.id, {
            ...item,
            qty: item.qty || 1,
          });
        }
      }

      return Array.from(map.values());
    } catch (err) {
      console.error("Failed to normalize cart:", err);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("uc_cart_v1", JSON.stringify(cart));
    console.log(cart);
  }, [cart]);

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + shipping;

  function updateQty(itemId, newQty) {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, qty: newQty } : it)),
    );
  }

  function checkout() {
    if (loading) return;

    if (!user) {
      setShowLogin(true);
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    navigate("/checkout", { replace: true });
  }

  function onLoginSuccess(userData) {
    setShowLogin(false);
    navigate("/checkout", { replace: true });
  }

  return (
    <>
      {showLogin && (
        <LoginModal
          open={showLogin}
          onSuccess={onLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}

      <div className="w-full min-h-[60vh] secondary-bg-color py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-600 mb-4">Your cart is empty.</p>
              <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((it) => (
                  <div
                    key={it.id}
                    className="flex gap-4 items-center border rounded-md p-3"
                  >
                    <div className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                      <img
                        src={it.image || it.images?.[0] || placeholder}
                        alt={it.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {it.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {it.sku ? `SKU: ${it.sku}` : ""}
                          </div>
                        </div>

                        <div className="text-sm text-gray-700">
                          {formatPrice(Number(it.price) || 0)}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3 ">
                        <div className="flex items-center border rounded overflow-hidden">
                          <button
                            onClick={() =>
                              updateQty(it.id, (Number(it.qty) || 1) - 1)
                            }
                            className="px-3 py-1"
                          >
                            -
                          </button>
                          <div className="px-4 py-1">{it.qty || 1}</div>
                          <button
                            onClick={() =>
                              updateQty(it.id, (Number(it.qty) || 1) + 1)
                            }
                            className="px-3 py-1"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(it.id, setCart)}
                          className="text-sm text-red-600 hover:cursor-pointer hover:underline hover:underline-offset-3"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <CheckoutInfo />
              </div>

              <aside className="bg-white border rounded-lg p-4 sticky top-24 lg:min-h-160 ">
                <h2 className="font-semibold mb-4">Order Summary</h2>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between mt-2">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>

                <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <button
                  onClick={checkout}
                  className="mt-4 w-full py-3 btn-color hover:cursor-pointer text-white rounded"
                >
                  Proceed to Checkout
                </button>
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
