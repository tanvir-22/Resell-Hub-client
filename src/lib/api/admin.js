const BASE = process.env.NEXT_PUBLIC_SERVER_URL;

function buildUrl(base, params = {}) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  });
  const qs = p.toString();
  return qs ? `${base}?${qs}` : base;
}

// ── Stats ──────────────────────────────────────────────────────────────────
export async function getAdminStats() {
  const res = await fetch(`${BASE}/api/admin/stats`);
  return res.json();
}

// ── Users ──────────────────────────────────────────────────────────────────
export async function getAdminUsers(params = {}) {
  const res = await fetch(buildUrl(`${BASE}/api/admin/users`, params));
  return res.json();
}

export async function updateAdminUser(id, data) {
  const res = await fetch(`${BASE}/api/admin/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteAdminUser(id) {
  const res = await fetch(`${BASE}/api/admin/users/${id}`, { method: "DELETE" });
  return res.json();
}

// ── Products ───────────────────────────────────────────────────────────────
export async function getAdminProducts(params = {}) {
  const res = await fetch(buildUrl(`${BASE}/api/admin/products`, params));
  return res.json();
}

export async function updateAdminProduct(id, data) {
  const res = await fetch(`${BASE}/api/admin/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteAdminProduct(id) {
  const res = await fetch(`${BASE}/api/admin/products/${id}`, { method: "DELETE" });
  return res.json();
}

// ── Orders ─────────────────────────────────────────────────────────────────
export async function getAdminOrders(params = {}) {
  const res = await fetch(buildUrl(`${BASE}/api/admin/orders`, params));
  return res.json();
}

export async function updateAdminOrder(id, data) {
  const res = await fetch(`${BASE}/api/admin/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
