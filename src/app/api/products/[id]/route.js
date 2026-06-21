import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(_, { params }) {
  try {
    const db = await getDb();
    const doc = await db.collection("products").findOne({ _id: new ObjectId(params.id) });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...doc, _id: doc._id.toString() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const db = await getDb();
    const update = { ...body, updatedAt: new Date() };
    if (update.price) update.price = Number(update.price);
    if (update.stock) update.stock = Number(update.stock);

    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(params.id), sellerId: session.user.id },
      { $set: update },
      { returnDocument: "after" },
    );

    if (!result) return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    return NextResponse.json({ ...result, _id: result._id.toString() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await getDb();
    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(params.id),
      sellerId: session.user.id,
    });

    if (!result.deletedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
