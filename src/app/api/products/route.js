import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");
    const search   = searchParams.get("search");
    const category = searchParams.get("category");

    const db = await getDb();
    const filter = {};
    if (sellerId)                         filter.sellerId = sellerId;
    if (category && category !== "all")   filter.category = category;
    if (search)                           filter.title = { $regex: search, $options: "i" };

    const data = await db.collection("products").find(filter).sort({ createdAt: -1 }).toArray();
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

    const product = {
      ...body,
      sellerId:   session.user.id,
      sellerName: session.user.name || session.user.email,
      price:      Number(body.price),
      stock:      Number(body.stock),
      status:     "pending",
      reported:   false,
      createdAt:  new Date(),
      updatedAt:  new Date(),
    };

    const result = await db.collection("products").insertOne(product);
    return NextResponse.json({ ...product, _id: result.insertedId.toString() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
