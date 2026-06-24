const BASE = process.env.NEXT_PUBLIC_SERVER_URL;

export async function createReport({ productId, productTitle, reporterInfo, reason, details }) {
  const res = await fetch(`${BASE}/api/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, productTitle, reporterInfo, reason, details }),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function getReports({ status } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  const res = await fetch(`${BASE}/api/admin/reports?${params}`);
  return res.json();
}

export async function updateReport(id, data) {
  const res = await fetch(`${BASE}/api/admin/reports/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
