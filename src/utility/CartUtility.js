// src/utility/CartUtility.js

const CART_KEY = "uc_cart_v1";

/* ---------------- ADD TO BAG ---------------- */
export function addToBag(item) {
  const raw = localStorage.getItem(CART_KEY);
  const cart = raw ? JSON.parse(raw) : [];

  const id = item._id || item.id;
  const found = cart.find((c) => c.id === id);

  if (found) {
    found.qty = (found.qty || 1) + 1;
  } else {
    cart.push({
      id,
      slug: item.slug,
      title: item.title,
      price: item.price,
      mrp: item.mrp,
      image: item.images?.[0],
      qty: 1,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
  alert(`${item.title} added to bag`);
}

/* ---------------- BUY NOW ---------------- */
export function buyNow(navigate, item) {
  const raw = localStorage.getItem(CART_KEY);
  const cart = raw ? JSON.parse(raw) : [];

  const id = item._id || item.id;

  // 🔑 Buy Now = ensure item exists with qty = 1
  const updatedCart = [
    {
      id,
      slug: item.slug,
      title: item.title,
      price: item.price,
      mrp: item.mrp,
      image: item.images?.[0],
      qty: 1,
    },
  ];

  // Option A (recommended): Buy Now = only this item
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));

  // if  want to MERGE instead, comment above and use this
  /*
  const existing = cart.find((c) => c.id === id);
  if (!existing) {
    cart.push({
      id,
      slug: item.slug,
      title: item.title,
      price: item.price,
      mrp: item.mrp,
      image: item.images?.[0],
      qty: 1,
    });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  */

  window.dispatchEvent(new Event("cart-updated"));

  navigate("/cart");
}

/* ---------------- REMOVE ITEM ---------------- */
export function removeItem(productId, setCart) {
  if (!confirm("Remove item from cart?")) return;

  setCart((prev) => {
    const updated = prev.filter((it) => it.id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
    return updated;
  });
}

/* ---------------- READ CART ---------------- */
export function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to read cart", err);
    return [];
  }
}

/* ---------------- WRITE CART ---------------- */
export function writeCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { cart } }));
  } catch (err) {
    console.warn("Failed to write cart", err);
  }
}

/* ---------------- CLEAR CART ---------------- */
export function clearCart() {
  try {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(
      new CustomEvent("cart-updated", { detail: { cart: [] } }),
    );
  } catch (err) {
    console.warn("Failed to clear cart", err);
  }
}
