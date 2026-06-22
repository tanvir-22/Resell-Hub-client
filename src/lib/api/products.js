const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getProducts() {
  const res = await fetch(`${baseURL}/api/products`);
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${baseURL}/api/products/${id}`);
  return res.json();
}

export async function createProduct(data) {
  const res = await fetch(`${baseURL}/api/createproduct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  return res.json();
}
