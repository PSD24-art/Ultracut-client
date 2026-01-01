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

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await fetchFn("/orders/my", "GET");
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error("Order fetch failed", err);
      setError(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading order history…
      </div>
    );
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

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const id = order._id || order.id;

        return (
          <div key={id} className="border rounded-lg p-4 bg-gray-50">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="text-sm font-medium">
                  Order #{id.slice(-6).toUpperCase()}
                </div>
                <div className="text-xs text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </div>
              </div>

              <div className="text-sm">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status || "Processing"}
                </span>
              </div>
            </div>

            {/* ITEMS */}
            <div className="mt-3 space-y-2">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
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
            <div className="border-t mt-3 pt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Payment: {order.paymentMethod || "—"}
              </div>
              <div className="text-lg font-semibold text-blue-600">
                {formatPrice(order.totalAmount)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
