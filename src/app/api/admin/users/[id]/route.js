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
    const admin = await requireAdmin(request);
    if (admin.user.id === params.id) return NextResponse.json({ error: "Cannot modify your own account" }, { status: 400 });

    const body = await request.json();
    const db = await getDb();
    const result = await db.collection("user").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: "after" },
    );
    if (!result) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ _id: result._id.toString(), ...result });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await requireAdmin(request);
    if (admin.user.id === params.id) return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });

    const db = await getDb();
    await db.collection("user").deleteOne({ _id: new ObjectId(params.id) });
    await db.collection("session").deleteMany({ userId: params.id });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}
