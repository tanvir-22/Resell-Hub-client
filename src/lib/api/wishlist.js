import { apiFetch } from "./apiFetch";

export async function getWishlist(userEmail) {
  const res = await apiFetch(`api/getwishlist?email=${encodeURIComponent(userEmail)}`);
  return res.json();
}

export async function addToWishlist(data, userEmail) {
  const res = await apiFetch("api/addtowishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, userEmail }),
  });
  return res.json();
}

export async function removeFromWishlist(id, userEmail) {
  const res = await apiFetch(`api/deletewishlist/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userEmail }),
  });
  return res.json();
}
