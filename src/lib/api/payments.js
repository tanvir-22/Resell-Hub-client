const BASE = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getPayments(userEmail) {
  const res = await fetch(
    `${BASE}/api/getpayments?email=${encodeURIComponent(userEmail)}`
  );
  return res.json();
}

export async function createCheckoutSession(data) {
  const res = await fetch(`${BASE}/api/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function createPayment(data) {
  const res = await fetch(`${BASE}/api/createpayment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
