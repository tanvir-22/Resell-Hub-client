import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

async function requireAdmin(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  if (session.user.role !== "admin") throw Object.assign(new Error("Forbidden"), { status: 403 });
  return session;
}

export async function PUT(request, { params }) {
  try {
    await requireAdmin(request);
    const { status } = await request.json();
    const db = await getDb();
    const result = await db.collection("orders").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" },
    );
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...result, _id: result._id.toString() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}
