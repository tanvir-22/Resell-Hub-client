import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await getDb();
    const sellerId = session.user.id;

    const [products, orders] = await Promise.all([
      db.collection("products").find({ "sellerInfo.userId": sellerId }).toArray(),
      db.collection("orders").find({ sellerId }).toArray(),
    ]);

    const totalProducts = products.length;
    const completedOrders = orders.filter(o => o.status === "Delivered");
    const pendingOrders   = orders.filter(o => o.status === "Pending");
    const totalSales      = completedOrders.length;
    const totalRevenue    = completedOrders.reduce((s, o) => s + (o.price * (o.quantity || 1)), 0);
    const pendingCount    = pendingOrders.length;

    // Monthly revenue for last 6 months
    const now = new Date();
    const monthly = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleString("default", { month: "short" });
      const monthOrders = completedOrders.filter(o => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      });
      return {
        month: label,
        revenue: monthOrders.reduce((s, o) => s + (o.price * (o.quantity || 1)), 0),
        orders: monthOrders.length,
      };
    });

    // Top products by revenue
    const productMap = {};
    completedOrders.forEach(o => {
      if (!productMap[o.productTitle]) productMap[o.productTitle] = 0;
      productMap[o.productTitle] += o.price * (o.quantity || 1);
    });
    const topProducts = Object.entries(productMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      totalProducts,
      totalSales,
      totalRevenue,
      pendingOrders: pendingCount,
      monthly,
      topProducts,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
