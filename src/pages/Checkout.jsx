// src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function formatPrice(n) {
  if (typeof n !== "number") return n || "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

function readCart() {
  try {
    const raw = localStorage.getItem("uc_cart_v1");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to read cart", err);
    return [];
  }
}

function writeCart(cart) {
  try {
    localStorage.setItem("uc_cart_v1", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { cart } }));
  } catch (err) {
    console.warn("Failed to write cart", err);
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [cart, setCart] = useState(() => readCart());
  const [processing, setProcessing] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // keep cart in sync with other tabs
  useEffect(() => {
    function onCartUpdate() {
      setCart(readCart());
    }
    window.addEventListener("cart-updated", onCartUpdate);
    window.addEventListener("storage", onCartUpdate);
    return () => {
      window.removeEventListener("cart-updated", onCartUpdate);
      window.removeEventListener("storage", onCartUpdate);
    };
  }, []);

  // helper: format address object into a single string for textarea
  function formatAddressForTextarea(a) {
    // console.log(a);

    if (!a) return "";
    const parts = [
      a.addressLine1,
      a.addressLine2,
      a.landmark ? `Landmark: ${a.landmark}` : null,
      `${a.city || ""} ${a.pincode || ""}`.trim(),
      a.state,
    ].filter(Boolean);
    return parts.join(", ");
  }

  // When authUser loads/changes, pick default address (isDefault) or first address
  useEffect(() => {
    if (!authUser) return;

    const addresses = Array.isArray(authUser.addresses)
      ? authUser.addresses
      : [];
    if (addresses.length === 0) {
      // prefill from authUser basic details if present
      if (authUser.name) setName(authUser.name);
      if (authUser.phone) setPhone(authUser.phone);
      return;
    }

    // find default
    const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

    if (defaultAddr) {
      setName(defaultAddr.fullName || authUser.name || "");
      setPhone(defaultAddr.phone || authUser.phone || "");
      setAddress(formatAddressForTextarea(defaultAddr));
    }
  }, [authUser]);

  // derived totals
  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1),
      0,
    );
    const shipping = subtotal > 0 && subtotal < 2000 ? 99 : 0; // example rule
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [cart]);

  function updateQty(itemId, qty) {
    const updated = cart.map((c) => {
      const id = c.id || c._id || c.sku || c.slug;
      if (String(id) === String(itemId)) {
        return { ...c, qty: Math.max(1, Number(qty) || 1) };
      }
      return c;
    });
    setCart(updated);
    writeCart(updated);
  }

  function removeItem(itemId) {
    const updated = cart.filter((c) => {
      const id = c.id || c._id || c.sku || c.slug;
      return String(id) !== String(itemId);
    });
    setCart(updated);
    writeCart(updated);
  }

  function clearCartLocal() {
    setCart([]);
    writeCart([]);
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Please fill name, phone and shipping address.");
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        customer: { name, phone, address },
        items: cart.map((it) => ({
          id: it.id || it._id || it.sku || it.slug,
          title: it.title,
          price: it.price,
          qty: it.qty || 1,
        })),
        totals,
      };

      // TODO: send payload to real order API
      console.log("Placing order (mock):", payload);
      await new Promise((res) => setTimeout(res, 700));

      clearCartLocal();
      alert("Order placed successfully. Thank you!");
      navigate("/");
    } catch (err) {
      console.error("Place order failed", err);
      alert("Failed to place order. Try again later.");
    } finally {
      setProcessing(false);
    }
  }

  if (!cart || cart.length === 0) {
    return (
      <main className="w-full py-16 secondary-bg-color">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add items to cart and they'll appear here.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/consumables"
              className="px-5 py-3 bg-blue-600 text-white rounded-md"
            >
              Browse Consumables
            </Link>
            <Link to="/" className="px-5 py-3 border rounded-md">
              Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full py-10 secondary-bg-color">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: cart items */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

          <div className="space-y-4">
            {cart.map((it) => {
              const id = it.id || it._id || it.sku || it.slug;
              return (
                <div
                  key={id}
                  className="flex gap-4 items-center border rounded-md p-3"
                >
                  <div className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                    <img
                      src={
                        it.image || it.images?.[0] || "/images/placeholder.png"
                      }
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

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center border rounded overflow-hidden">
                        <button
                          onClick={() =>
                            updateQty(id, (Number(it.qty) || 1) - 1)
                          }
                          className="px-3 py-1"
                        >
                          -
                        </button>
                        <div className="px-4 py-1">{it.qty || 1}</div>
                        <button
                          onClick={() =>
                            updateQty(id, (Number(it.qty) || 1) + 1)
                          }
                          className="px-3 py-1"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(id)}
                        className="text-sm text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: summary + form */}
        <aside className="bg-gray-50 border rounded-md p-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Order Summary</h3>

            <div className="flex justify-between text-sm mb-1">
              <div>Subtotal</div>
              <div>{formatPrice(totals.subtotal)}</div>
            </div>

            <div className="flex justify-between text-sm mb-1">
              <div>Shipping</div>
              <div>
                {totals.shipping ? formatPrice(totals.shipping) : "Free"}
              </div>
            </div>

            <div className="flex justify-between text-sm mb-3">
              <div>Tax (approx.)</div>
              <div>{formatPrice(totals.tax)}</div>
            </div>

            <div className="flex justify-between font-semibold text-base mb-4">
              <div>Total</div>
              <div>{formatPrice(totals.total)}</div>
            </div>
          </div>

          <form onSubmit={placeOrder} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Mobile number"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Shipping address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Address, city, pincode"
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md"
            >
              {processing
                ? "Placing order…"
                : `Place order — ${formatPrice(totals.total)}`}
            </button>

            <button
              type="button"
              onClick={() => {
                //Add payment flow here
                clearCartLocal();
                alert("Cart cleared");
              }}
              className="w-full px-4 py-3 border rounded-md text-sm"
            >
              Clear cart
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
