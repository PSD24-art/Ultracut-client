import { useEffect, useState } from "react";
import fetchFn from "../utility/FetchFn";
import { Link } from "react-router-dom";

function formatPrice(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ label, status }) {
  const COLORS = {
    created: "bg-gray-100 text-gray-700",
    processing: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",

    initiated: "bg-yellow-100 text-yellow-700",
    success: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-gray-500">{label}:</span>
      <span
        className={`px-2 py-1 rounded font-medium ${
          COLORS[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status || "—"}
      </span>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [retryingId, setRetryingId] = useState(null);

  async function loadOrders() {
    try {
      const data = await fetchFn("/order/my", "GET");
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function retryPayment(orderId) {
    setRetryingId(orderId);
    try {
      const res = await fetchFn(`/order/${orderId}/retry-payment`, "POST");

      if (!res.success || !res.redirectUrl) {
        alert(res.message || "Retry not allowed");
        return;
      }

      window.location.href = res.redirectUrl;
    } catch {
      alert("Unable to retry payment");
    } finally {
      setRetryingId(null);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading…</div>;
  }

  if (error) {
    return <div className="py-6 text-center text-red-600">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="py-10 text-center text-gray-600">
        <p className="mb-3">You haven’t placed any orders yet.</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const visibleOrders = showAll ? orders : orders.slice(0, 4);

  return (
    <div className="space-y-4">
      {visibleOrders.map((order) => {
        const id = order._id || order.id;

        const canRetry =
          order.paymentStatus !== "success" && order.status !== "cancelled";

        return (
          <div key={id} className="border rounded-lg p-4 bg-white">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div>
                <div className="text-sm font-medium">
                  Order #{id.slice(-6).toUpperCase()}
                </div>
                <div className="text-xs text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusBadge label="Order" status={order.status} />
                <StatusBadge label="Payment" status={order.paymentStatus} />
              </div>
            </div>

            {/* ITEMS */}
            <div className="mt-3 space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div className="truncate pr-2">
                    {item.title} × {item.qty}
                  </div>
                  <div className="font-medium">
                    {formatPrice(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="border-t mt-3 pt-3 flex flex-col sm:flex-row sm:justify-between gap-2">
              <div className="text-sm text-gray-600">
                Payment Method: <b>{order.paymentMethod}</b>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-lg font-semibold text-blue-600">
                  {formatPrice(order.total)}
                </div>

                {canRetry && (
                  <button
                    onClick={() => retryPayment(id)}
                    disabled={retryingId === id}
                    className="px-3 py-1 text-sm rounded bg-black text-white disabled:opacity-50"
                  >
                    {retryingId === id ? "Retrying…" : "Retry Payment"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* SHOW MORE */}
      {orders.length > 4 && (
        <div className="text-center pt-4">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-blue-600 text-sm underline"
          >
            {showAll ? "Show less" : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
}
