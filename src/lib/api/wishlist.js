export async function getWishlist() {
  const res = await fetch("/api/wishlist");
  return res.json();
}

export async function addToWishlist(data) {
  const res = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function removeFromWishlist(id) {
  const res = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
  return res.json();
}
