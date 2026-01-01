import { useNavigate } from "react-router-dom";

export default function MockPayment() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>

      <button
        className="w-full bg-green-600 text-white py-3 rounded mb-3"
        onClick={() => {
          alert("Payment Successful");
          localStorage.removeItem("uc_cart_v1");
          navigate("/");
        }}
      >
        Pay Success
      </button>

      <button
        className="w-full border py-3 rounded"
        onClick={() => {
          alert("Payment Failed");
          navigate("/checkout");
        }}
      >
        Pay Failed
      </button>
    </div>
  );
}
