import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import fetchFn from "../utility/FetchFn";
import { clearCart } from "../utility/CartUtility";

export default function PaymentFailed() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
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

  async function retryPayment() {
    setRetrying(true);
    try {
      const res = await fetchFn(`/order/${orderId}/retry-payment`, "POST");
      console.log("response from order failed: ", res);

      if (!res.success || !res.redirectUrl) {
        throw new Error("Retry failed");
      }

      // 🔑 Redirect user to PhonePe again
      window.location.href = res.redirectUrl;
    } catch (err) {
      alert("Unable to retry payment");
    } finally {
      setRetrying(false);
    }
  }

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
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg p-2 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Failed ❌
        </h1>

        <p className="text-gray-600 mb-4">We couldn’t complete your payment.</p>

        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-mono text-gray-800 break-all">{order.id}</p>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          If any amount was deducted, it will be refunded automatically.
        </p>

        <button
          onClick={retryPayment}
          disabled={retrying}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50"
        >
          {retrying ? "Retrying..." : "Retry Payment"}
        </button>
      </div>
    </div>
  );
}
