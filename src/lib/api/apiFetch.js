import { authClient } from "@/lib/auth-client";

const BASE = process.env.NEXT_PUBLIC_SERVER_URL;

export async function apiFetch(path, options = {}) {
  let token = null;
  try {
    const { data } = await authClient.token();
    token = data?.token ?? null;
  } catch { /* unauthenticated — proceed without token */ }

  return fetch(`${BASE}/${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
