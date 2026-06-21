import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await getDb();
    const data = await db.collection("payments")
      .find({ buyerId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(data.map(d => ({ ...d, _id: d._id.toString() })));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
