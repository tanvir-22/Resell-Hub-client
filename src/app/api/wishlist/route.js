import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await getDb();
    const items = await db.collection("wishlist")
      .find({ userId: session.user.id })
      .sort({ addedAt: -1 })
      .toArray();

    return NextResponse.json(items.map(d => ({ ...d, _id: d._id.toString() })));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const db = await getDb();

    const exists = await db.collection("wishlist").findOne({
      userId: session.user.id,
      productId: body.productId,
    });
    if (exists) return NextResponse.json({ ...exists, _id: exists._id.toString() });

    const item = {
      userId:    session.user.id,
      productId: body.productId,
      title:     body.title,
      price:     body.price,
      image:     body.image,
      seller:    body.seller,
      addedAt:   new Date(),
    };

    const result = await db.collection("wishlist").insertOne(item);
    return NextResponse.json({ ...item, _id: result.insertedId.toString() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
