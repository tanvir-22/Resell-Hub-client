const BASE = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getReviews(productId) {
  const res = await fetch(`${BASE}/api/reviews?productId=${productId}`);
  return res.json();
}

export async function createReview({ reviewerInfo, productId, rating, comment }) {
  const res = await fetch(`${BASE}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviewerInfo, productId, rating, comment }),
  });
  return { ok: res.ok, data: await res.json() };
}
