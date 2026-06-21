import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

async function requireAdmin(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  if (session.user.role !== "admin") throw Object.assign(new Error("Forbidden"), { status: 403 });
  return session;
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = await getDb();
    const [users, products, orders] = await Promise.all([
      db.collection("user").countDocuments(),
      db.collection("products").countDocuments(),
      db.collection("orders").countDocuments(),
    ]);
    const revenue = await db.collection("orders")
      .aggregate([
        { $match: { status: "Delivered" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]).toArray();
    return NextResponse.json({ users, products, orders, revenue: revenue[0]?.total ?? 0 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}
