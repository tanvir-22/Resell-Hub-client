function buildUrl(base, params = {}) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  });
  const qs = p.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function getOrders(params = {}) {
  const res = await fetch(buildUrl("/api/orders", params));
  return res.json();
}

export async function createOrder(data) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateOrder(id, data) {
  const res = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
