import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "../components/Login";
import Loader from "../components/Loader";

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
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("uc_cart_v1", JSON.stringify(cart));
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

  function removeFromCart(productId) {
    if (!confirm("Remove item from cart?")) return;

    setCart((prev) => {
      const updated = prev.filter((it) => it.id !== productId);
      localStorage.setItem("uc_cart_v1", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated"));
      return updated;
    });
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

    navigate("/checkout");
  }

  function onLoginSuccess(userData) {
    setShowLogin(false);
    navigate("/checkout");
  }

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
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

      <div className="w-full min-h-[60vh] secondary-bg-color py-10">
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
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-28 h-28 object-contain bg-gray-100 rounded"
                    />

                    <div className="flex-1">
                      <Link
                        to={`/consumables/${item.slug}`}
                        className="font-semibold hover:text-blue-600"
                      >
                        {item.title}
                      </Link>

                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                          >
                            <Minus />
                          </button>
                          <span>{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                          >
                            <Plus />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            {formatPrice(item.price * item.qty)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="bg-white border rounded-lg p-4 sticky top-24">
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
