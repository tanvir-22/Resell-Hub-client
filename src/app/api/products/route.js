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
    if (sellerId) {
      // Seller fetching their own products — show all statuses so they can
      // see pending and rejected listings in their dashboard.
      filter["sellerInfo.userId"] = sellerId;
    } else {
      // Public browse — only show admin-approved products.
      filter.status = "approved";
    }
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

    const images = Array.isArray(body.images) ? body.images : body.images ? [body.images] : [];

    const product = {
      title:       body.title,
      description: body.description || "",
      category:    body.category,
      condition:   body.condition,
      price:       Number(body.price),
      stock:       Number(body.stock ?? 1),
      images,
      sellerInfo: {
        userId: session.user.id,
        name:   session.user.name  || "",
        email:  session.user.email || "",
        phone:  body.phone || session.user.phone || "",
      },
      status:    "pending",
      reported:  false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("products").insertOne(product);
    return NextResponse.json({ ...product, _id: result.insertedId.toString() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
