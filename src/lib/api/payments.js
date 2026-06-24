import { apiFetch } from "./apiFetch";

export async function getPayments(userEmail) {
  const res = await apiFetch(`api/getpayments?email=${encodeURIComponent(userEmail)}`);
  return res.json();
}

export async function createCheckoutSession(data) {
  const res = await apiFetch("api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function createPayment(data) {
  const res = await apiFetch("api/createpayment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
