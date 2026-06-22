"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/components/dashboard/DashboardShell";
import { FiShoppingBag, FiHeart, FiCreditCard, FiArrowRight, FiPackage } from "react-icons/fi";
import { getOrders } from "@/lib/api/orders";
import { getWishlist } from "@/lib/api/wishlist";
import { getPayments } from "@/lib/api/payments";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function BuyerOverview() {
  const user = useUser();
  const [orders, setOrders]     = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      getOrders({ role: "buyer" }),
      getWishlist(),
      getPayments(),
    ]).then(([o, w, p]) => {
      setOrders(Array.isArray(o) ? o : []);
      setWishlist(Array.isArray(w) ? w : []);
      setPayments(Array.isArray(p) ? p : []);
      setLoading(false);
    });
  }, []);

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending" || o.status === "Accepted",
  ).length;
  const totalSpent = payments
    .filter((p) => p.status === "Completed")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Here&apos;s what&apos;s happening with your account.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FiShoppingBag} label="Total Orders"   value={orders.length}              color="bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400" href="/dashboard/buyer/orders" />
          <StatCard icon={FiPackage}     label="Active Orders"  value={pendingOrders}              color="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"   href="/dashboard/buyer/orders" />
          <StatCard icon={FiHeart}       label="Wishlist Items" value={wishlist.length}            color="bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400"       href="/dashboard/buyer/wishlist" />
          <StatCard icon={FiCreditCard}  label="Total Spent"    value={`$${totalSpent.toFixed(2)}`} color="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"  href="/dashboard/buyer/payments" />
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link href="/dashboard/buyer/orders" className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-slate-700 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={FiShoppingBag}
            message="No orders yet. Start shopping!"
            actionHref="/"
            actionLabel="Browse listings"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Product", "Price", "Status", "Date"].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 font-medium text-gray-900 dark:text-white max-w-[180px] truncate">{o.productTitle}</td>
                    <td className="py-3 text-violet-600 dark:text-violet-400 font-semibold">${o.price}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        o.status === "Delivered" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                        o.status === "Cancelled" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" :
                        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
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
