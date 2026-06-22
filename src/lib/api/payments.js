export async function getPayments() {
  const res = await fetch("/api/payments");
  return res.json();
}
