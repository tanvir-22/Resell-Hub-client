export async function getProducts() {
  console.log(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`);
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`);

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
