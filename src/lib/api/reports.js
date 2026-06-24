import { apiFetch } from "./apiFetch";

export async function createReport({ productId, productTitle, reporterInfo, reason, details }) {
  const res = await apiFetch("api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, productTitle, reporterInfo, reason, details }),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function getReports({ status } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  const res = await apiFetch(`api/admin/reports?${params}`);
  return res.json();
}

export async function updateReport(id, data) {
  const res = await apiFetch(`api/admin/reports/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
