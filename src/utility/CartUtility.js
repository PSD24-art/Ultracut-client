export function addToBag(item) {
  const raw = localStorage.getItem("uc_cart_v1");
  const cart = raw ? JSON.parse(raw) : [];

  const id = item._id || item.id;
  const found = cart.find((c) => c.id === id);

  if (found) found.qty = (found.qty || 1) + 1;
  else {
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

  localStorage.setItem("uc_cart_v1", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
  alert(`${item.title} added to bag`);
}

export function buyNow(item) {
  navigate("/checkout", {
    state: {
      items: [
        {
          id: item._id || item.id,
          title: item.title,
          price: item.price,
          qty: 1,
        },
      ],
    },
  });
}

export function removeItem(productId) {
  if (!confirm("Remove item from cart?")) return;

  setCart((prev) => {
    const updated = prev.filter((it) => it.id !== productId);
    localStorage.setItem("uc_cart_v1", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
    return updated;
  });
}
