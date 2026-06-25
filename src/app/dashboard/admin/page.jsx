"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiArrowRight, FiAlertTriangle } from "react-icons/fi";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { getAdminStats, getAdminOrders } from "@/lib/api/admin";
import { normalizeOrder } from "@/lib/utils/orderUtils";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";


export default function AdminOverview() {
  const [stats, setStats]     = useState(null);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminOrders()]).then(([s, o]) => {
      setStats(s);
      setOrders(Array.isArray(o) ? o.slice(0, 6).map(normalizeOrder) : []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Platform-wide statistics and activity.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FiUsers}       label="Total Users"    value={stats?.users}    color="bg-gradient-to-br from-blue-500   to-blue-700"   href="/dashboard/admin/users"     variant="gradient" />
          <StatCard icon={FiPackage}     label="Total Products" value={stats?.products} color="bg-gradient-to-br from-emerald-500 to-emerald-700" href="/dashboard/admin/products"  variant="gradient" />
          <StatCard icon={FiShoppingBag} label="Total Orders"   value={stats?.orders}   color="bg-gradient-to-br from-amber-500  to-amber-700"  href="/dashboard/admin/orders"    variant="gradient" />
          <StatCard icon={FiDollarSign}  label="Total Revenue"  value={`৳${(stats?.revenue ?? 0).toFixed(2)}`} sub="Delivered orders" color="bg-gradient-to-br from-green-500 to-green-700" href="/dashboard/admin/analytics" variant="gradient" />
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
          <h2 className="font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link
            href="/dashboard/admin/orders"
            className="text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
          >
            View all <FiArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-gray-100 dark:bg-slate-700 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState icon={FiShoppingBag} message="No orders yet" className="py-14" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Product", "Buyer", "Seller", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white truncate max-w-[140px]">{o.productTitle}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{o.buyerName}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{o.sellerName}</td>
                    <td className="px-6 py-3 font-semibold text-gray-900 dark:text-white">৳{o.price}</td>
                    <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-6 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Link href="/dashboard/admin/products?status=pending" className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
          <FiAlertTriangle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-300 text-sm">Pending Approvals</p>
            <p className="text-amber-700 dark:text-amber-400 text-xs">Review new product listings</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/products?reported=true" className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
          <FiAlertTriangle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-300 text-sm">Reported Products</p>
            <p className="text-red-700 dark:text-red-400 text-xs">Moderate flagged listings</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/analytics" className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
          <FiDollarSign size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-emerald-900 dark:text-emerald-300 text-sm">View Analytics</p>
            <p className="text-emerald-700 dark:text-emerald-400 text-xs">Platform growth &amp; trends</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
