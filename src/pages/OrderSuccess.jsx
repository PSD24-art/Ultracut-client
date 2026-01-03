import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import fetchFn from "../utility/FetchFn";
import { clearCart } from "../utility/CartUtility";

export default function OrderSuccess() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetchFn(`/order/${orderId}`, "GET");
        if (!res.success) throw new Error("Order not found");
        setOrder(res.order);
      } catch (err) {
        setError("Unable to load order details");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error || "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-600 mb-4">Your payment has been confirmed.</p>

        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-mono text-gray-800 break-all">{order.id}</p>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p>
            <b>Payment Method:</b> {order.paymentMethod}
          </p>
          <p>
            <b>Total Amount:</b> ₹{order.total}
          </p>
          <p>
            <b>Status:</b> {order.status}
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Our team will start processing your order shortly.
        </p>

        <Link
          to="/"
          className="block bg-black text-white py-2 rounded-lg hover:bg-gray-900"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
