const BASE = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getOrders({ email, role } = {}) {
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  if (role) params.set("role", role);
  const qs = params.toString();
  const res = await fetch(`${BASE}/api/getorders${qs ? "?" + qs : ""}`);
  return res.json();
}

export async function createOrder(data) {
  const res = await fetch(`${BASE}/api/createorder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateOrder(id, data) {
  const res = await fetch(`${BASE}/api/updateorder/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
