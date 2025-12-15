// src/components/CartBadge.jsx
import React, { useEffect, useState } from "react";

function readCart() {
  try {
    const raw = localStorage.getItem("uc_cart_v1");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export default function CartBadge({ className = "", maxDisplay = 99 }) {
  const [count, setCount] = useState(() => {
    const c = readCart();
    // sum qty or count items
    return c.reduce((s, it) => s + (Number(it.qty) || 1), 0);
  });

  useEffect(() => {
    function handleUpdate() {
      const c = readCart();
      setCount(c.reduce((s, it) => s + (Number(it.qty) || 1), 0));
    }

    // custom event (used in your code when cart changes)
    window.addEventListener("cart-updated", handleUpdate);
    // cross-tab changes
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  if (!count) return null;

  const display = count > maxDisplay ? `${maxDisplay}+` : String(count);

  return (
    <span
      aria-live="polite"
      className={`inline-flex items-center justify-center text-xs font-semibold text-white bg-red-600 rounded-full h-5 min-w-[20px] px-1 ${className}`}
      title={`${count} item${count !== 1 ? "s" : ""} in cart`}
      style={{ lineHeight: 1 }}
    >
      {display}
    </span>
  );
}
