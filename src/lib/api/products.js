import { apiFetch } from "./apiFetch";

export async function getProducts() {
  const res = await apiFetch("api/products?status=approved");
  return res.json();
}

export async function getSellerProducts(sellerId, email) {
  const params = new URLSearchParams({ sellerId });
  if (email) params.set("email", email);
  const res = await apiFetch(`api/seller/products?${params}`);
  return res.json();
}

export async function getPublicSellerProducts(email, sellerId) {
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  if (sellerId) params.set("sellerId", sellerId);
  const res = await apiFetch(`api/public/seller/products?${params}`);
  return res.json();
}

export async function getProduct(id) {
  const res = await apiFetch(`api/products/${id}`);
  return res.json();
}

export async function createProduct(data) {
  const res = await apiFetch("api/createproduct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await apiFetch(`api/updateproduct/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(id) {
  const res = await apiFetch(`api/deleteproduct/${id}`, { method: "DELETE" });
  return res.json();
}
