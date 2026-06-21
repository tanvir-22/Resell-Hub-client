import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

const VALID_BUYER_STATUSES   = ["Cancelled"];
const VALID_SELLER_STATUSES  = ["Accepted", "Processing", "Shipped", "Delivered", "Cancelled"];

export async function PUT(request, { params }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { status } = await request.json();
    const db = await getDb();
    const orders = db.collection("orders");

    const order = await orders.findOne({ _id: new ObjectId(params.id) });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const isBuyer  = order.buyerId  === session.user.id;
    const isSeller = order.sellerId === session.user.id;

    if (!isBuyer && !isSeller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (isBuyer  && !VALID_BUYER_STATUSES.includes(status))  return NextResponse.json({ error: "Buyers can only cancel" }, { status: 400 });
    if (isSeller && !VALID_SELLER_STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    if (isBuyer  && order.status !== "Pending") return NextResponse.json({ error: "Cannot cancel after acceptance" }, { status: 400 });

    const result = await orders.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" },
    );

    // Update payment status when order is delivered
    if (status === "Delivered") {
      await db.collection("payments").updateOne(
        { orderId: params.id },
        { $set: { status: "Completed" } },
      );
    }
    if (status === "Cancelled") {
      await db.collection("payments").updateOne(
        { orderId: params.id },
        { $set: { status: "Refunded" } },
      );
    }

    return NextResponse.json({ ...result, _id: result._id.toString() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
