export async function getSellerAnalytics() {
  const res = await fetch("/api/analytics");
  return res.json();
}

export async function getAdminAnalytics() {
  const res = await fetch("/api/admin/analytics");
  return res.json();
}
