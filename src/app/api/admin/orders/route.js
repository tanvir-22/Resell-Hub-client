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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const db = await getDb();
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search) filter.$or = [
      { productTitle: { $regex: search, $options: "i" } },
      { buyerName:    { $regex: search, $options: "i" } },
    ];

    const orders = await db.collection("orders").find(filter).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(orders.map(o => ({ ...o, _id: o._id.toString() })));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}
