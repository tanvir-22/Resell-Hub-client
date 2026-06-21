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
    const search = searchParams.get("search");

    const db = await getDb();
    const filter = {};
    if (search) filter.$or = [
      { name:  { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];

    const users = await db.collection("user").find(filter).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(users.map(u => ({
      _id:     u._id.toString(),
      name:    u.name,
      email:   u.email,
      image:   u.image,
      role:    u.role || "buyer",
      blocked: u.blocked || false,
      createdAt: u.createdAt,
    })));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}
