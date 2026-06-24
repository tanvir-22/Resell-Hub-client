import { apiFetch } from "./apiFetch";

export async function getReviews(productId) {
  const res = await apiFetch(`api/reviews?productId=${productId}`);
  return res.json();
}

export async function getSellerReviews(email) {
  const res = await apiFetch(`api/seller/reviews?email=${encodeURIComponent(email)}`);
  return res.json();
}

export async function getPublicSellerReviews(email) {
  const res = await apiFetch(`api/public/seller/reviews?email=${encodeURIComponent(email)}`);
  return res.json();
}

export async function createReview({ reviewerInfo, productId, rating, comment }) {
  const res = await apiFetch("api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviewerInfo, productId, rating, comment }),
  });
  return { ok: res.ok, data: await res.json() };
}
