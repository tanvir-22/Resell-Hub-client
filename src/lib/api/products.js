export async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?status=approved`);
  return res.json();
}

export async function getSellerProducts(sellerId, email) {
  const params = new URLSearchParams({ sellerId });
  if (email) params.set("email", email);
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/seller/products?${params}`);
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`,
  );
  return res.json();
}

export async function createProduct(data) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/createproduct`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/updateproduct/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/deleteproduct/${id}`,
    { method: "DELETE" },
  );
  return res.json();
}
