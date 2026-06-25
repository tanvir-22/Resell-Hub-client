"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/components/dashboard/DashboardShell";
import { FiPackage, FiShoppingBag, FiDollarSign, FiClock, FiArrowRight, FiPlusSquare } from "react-icons/fi";
import { getSellerAnalytics } from "@/lib/api/analytics";
import { getOrders } from "@/lib/api/orders";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";

function normalizeOrder(o) {
  return {
    ...o,
    productTitle: o.productTitle || o.title || "—",
    price:        o.price ?? o.totalAmount ?? 0,
    status:       o.status || o.orderStatus || "Pending",
    buyerName:    o.buyerName || o.buyerInfo?.name || "—",
  };
}

export default function SellerOverview() {
  const user = useUser();
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      getSellerAnalytics(user.id),
      getOrders({ email: user.email, role: "seller" }),
    ]).then(([a, o]) => {
      setAnalytics(a);
      setOrders(Array.isArray(o) ? o.map(normalizeOrder) : []);
      setLoading(false);
    });
  }, [user?.id]);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(" ")[0] || "Seller"} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Here&apos;s an overview of your store performance.
          </p>
        </div>
        <Link
          href="/dashboard/seller/add-product"
          className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <FiPlusSquare size={16} /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FiPackage}     label="Total Products" value={analytics?.totalProducts ?? 0}                           color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" href="/dashboard/seller/products" layout="col" />
          <StatCard icon={FiShoppingBag} label="Total Sales"    value={analytics?.totalSales ?? 0}                              color="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"       href="/dashboard/seller/orders"   layout="col" />
          <StatCard icon={FiDollarSign}  label="Total Revenue"  value={`৳${(analytics?.totalRevenue ?? 0).toFixed(2)}`}         color="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"   href="/dashboard/seller/analytics" layout="col" />
          <StatCard icon={FiClock}       label="Pending Orders" value={analytics?.pendingOrders ?? 0}                           color="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"   href="/dashboard/seller/orders"   layout="col" />
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link href="/dashboard/seller/orders" className="text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-gray-100 dark:bg-slate-700 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={FiShoppingBag}
            message="No orders yet. Add products to start selling!"
            actionHref="/dashboard/seller/add-product"
            actionLabel="Add your first product"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Product", "Buyer", "Price", "Status", "Date"].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {orders.slice(0, 6).map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 font-medium text-gray-900 dark:text-white max-w-[140px] truncate">{o.productTitle}</td>
                    <td className="py-3 text-gray-500 dark:text-gray-400">{o.buyerName}</td>
                    <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold">৳{o.price}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        o.status === "Delivered" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                        o.status === "Pending"   ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" :
                        o.status === "Cancelled" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" :
                        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 dark:text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
