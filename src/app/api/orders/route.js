import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "buyer";

    const db = await getDb();
    const filter = role === "seller"
      ? { sellerId: session.user.id }
      : { buyerId: session.user.id };

    const data = await db.collection("orders").find(filter).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(data.map(d => ({ ...d, _id: d._id.toString() })));
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

    const order = {
      ...body,
      buyerId:   session.user.id,
      buyerName: session.user.name || session.user.email,
      status:    "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(order);

    // Create payment record
    await db.collection("payments").insertOne({
      orderId:   result.insertedId.toString(),
      buyerId:   session.user.id,
      sellerId:  body.sellerId,
      amount:    Number(body.price) * (Number(body.quantity) || 1),
      status:    "Pending",
      createdAt: new Date(),
    });

    return NextResponse.json({ ...order, _id: result.insertedId.toString() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
