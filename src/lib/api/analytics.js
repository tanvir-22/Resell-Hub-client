import { apiFetch } from "./apiFetch";

export async function getSellerAnalytics(sellerId) {
  const res = await apiFetch(`api/seller/analytics?sellerId=${sellerId}`);
  return res.json();
}

export async function getAdminAnalytics() {
  const res = await apiFetch("api/admin/analytics");
  return res.json();
}
