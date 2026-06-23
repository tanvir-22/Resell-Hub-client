const BASE = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getSellerAnalytics(sellerId) {
  const res = await fetch(`${BASE}/api/seller/analytics?sellerId=${sellerId}`);
  return res.json();
}

export async function getAdminAnalytics() {
  const res = await fetch(`${BASE}/api/admin/analytics`);
  return res.json();
}
