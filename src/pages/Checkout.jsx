// src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CheckoutInfo from "./static/CheckoutInfo";
import { removeItem } from "../utility/CartUtility";
import { readCart, clearCart } from "../utility/CartUtility";

import fetchFn from "../utility/FetchFn";

function formatPrice(n) {
  if (typeof n !== "number") return n || "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [cart, setCart] = useState(() => readCart());
  const [processing, setProcessing] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressObj, setSelectedAddressObj] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD | ONLINE
  const [showCodTerms, setShowCodTerms] = useState(true);
  const [codAccepted, setCodAccepted] = useState(false);

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
      setSelectedAddressObj(defaultAddr);
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

  async function placeOrder(e) {
    e.preventDefault();

    if (paymentMethod === "COD" && codAccepted === false) {
      alert("Please accept the terms and conditions before proceeding");
      return;
    }

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
          id: it.slug || it.id,
          qty: it.qty || 1,
          paymentMethod, // "PHONEPE"
        })),
      };

      const data = await fetchFn("/order/new", "POST", payload);

      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl; // 🔑 KEY POINT
      } else {
        throw new Error("Payment redirect URL not received");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to initiate payment");
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

                    <div className="mt-3 flex items-center justify-between gap-3 ">
                      <div className="flex items-center border p-1 rounded overflow-hidden">
                        Qty -{" "}
                        <span className="highlighted-text font-bold">
                          {it.qty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hidden lg:flex">
            <CheckoutInfo />
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm text-gray-700">
                  Shipping address
                </label>

                {authUser?.addresses?.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="text-sm text-blue-600 hover:cursor-pointer hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>

              <textarea
                value={address}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-50 cursor-not-allowed"
                rows={3}
                placeholder={
                  address.length === 0
                    ? "Click on User icon to add an address to your profile first"
                    : "Select an address"
                }
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Payment Method</h4>

              {/* COD */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => {
                    setPaymentMethod("COD");
                    setShowCodTerms(true);
                  }}
                />
                <span>Cash on Delivery (₹250 confirmation charge)</span>
              </label>

              {/* Online */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => {
                    setPaymentMethod("ONLINE");
                    setShowCodTerms(false);
                    setCodAccepted(false);
                  }}
                />
                <span>Online Payment (UPI / Card / Netbanking)</span>
              </label>
            </div>
            {paymentMethod === "COD" && showCodTerms && (
              <div className="border rounded-md p-3 bg-yellow-50 text-sm">
                <p className="font-medium mb-1">Cash on Delivery Terms</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>₹250 is charged as order confirmation</li>
                  <li>Amount is non-refundable</li>
                  <li>Order will be dispatched only after confirmation</li>
                </ul>

                <label className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    checked={codAccepted}
                    onChange={(e) => setCodAccepted(e.target.checked)}
                  />
                  <span>I accept the COD terms</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full px-4 py-3 btn-color  text-white rounded-md"
            >
              {processing
                ? "Placing order…"
                : `Place order — ${formatPrice(totals.total)}`}
            </button>

            <button
              type="button"
              onClick={() => {
                clearCart();
                setCart([]);
                alert("Cart cleared");
              }}
              className="w-full px-4 py-3 border rounded-md text-sm"
            >
              Clear cart
            </button>
          </form>
        </aside>
      </div>
      <div className="lg:hidden px-6">
        <CheckoutInfo />
      </div>
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">
              Select Shipping Address
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {authUser.addresses.map((addr, idx) => (
                <label
                  key={idx}
                  className="block border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    className="mr-2"
                    checked={selectedAddressObj === addr}
                    onChange={() => setSelectedAddressObj(addr)}
                  />

                  <span className="text-sm">
                    {formatAddressForTextarea(addr)}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!selectedAddressObj) {
                    alert("Please select an address");
                    return;
                  }
                  setAddress(formatAddressForTextarea(selectedAddressObj));
                  setShowAddressModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Use this address
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
