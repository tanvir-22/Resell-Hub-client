import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

async function requireAdmin(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  if (session.user.role !== "admin") throw Object.assign(new Error("Forbidden"), { status: 403 });
  return session;
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    const db = await getDb();

    const [users, products, orders] = await Promise.all([
      db.collection("user").find({}).toArray(),
      db.collection("products").find({}).toArray(),
      db.collection("orders").find({}).toArray(),
    ]);

    const now = new Date();

    // User growth: registrations per month (last 6 months)
    const userGrowth = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        month: d.toLocaleString("default", { month: "short" }),
        users: users.filter(u => {
          const ud = new Date(u.createdAt);
          return ud.getMonth() === d.getMonth() && ud.getFullYear() === d.getFullYear();
        }).length,
      };
    });

    // Monthly orders: last 6 months
    const monthlyOrders = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const mo = orders.filter(o => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      });
      return {
        month:   d.toLocaleString("default", { month: "short" }),
        orders:  mo.length,
        revenue: mo.filter(o => o.status === "Delivered").reduce((s, o) => s + (o.price || 0), 0),
      };
    });

    // Category performance: product count per category
    const categoryMap = {};
    products.forEach(p => {
      const cat = p.category || "Other";
      if (!categoryMap[cat]) categoryMap[cat] = { count: 0, revenue: 0 };
      categoryMap[cat].count++;
    });
    orders.filter(o => o.status === "Delivered").forEach(o => {
      const prod = products.find(p => p._id.toString() === o.productId);
      if (prod) {
        const cat = prod.category || "Other";
        if (!categoryMap[cat]) categoryMap[cat] = { count: 0, revenue: 0 };
        categoryMap[cat].revenue += o.price || 0;
      }
    });
    const categoryPerformance = Object.entries(categoryMap)
      .map(([name, { count, revenue }]) => ({ name, count, revenue }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Top categories by revenue
    const topCategories = [...categoryPerformance].sort((a, b) => b.revenue - a.revenue).slice(0, 6);

    return NextResponse.json({ userGrowth, monthlyOrders, categoryPerformance, topCategories });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}
