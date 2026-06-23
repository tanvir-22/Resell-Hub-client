"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { FiCreditCard, FiSearch } from "react-icons/fi";
import { getPayments } from "@/lib/api/payments";
import { useUser } from "@/components/dashboard/DashboardShell";

export default function BuyerPayments() {
  const user = useUser();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    if (!user?.email) return;
    getPayments(user.email).then(d => { setPayments(Array.isArray(d) ? d : []); setLoading(false); });
  }, [user?.email]);

  const totalSpent   = payments.filter(p => p.paymentStatus === "success" && p.orderStatus !== "Cancelled").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.paymentStatus === "pending" && p.orderStatus !== "Cancelled").reduce((s, p) => s + p.amount, 0);

  const visible = payments.filter(p =>
    !search || p.orderId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Payment History</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">All your transaction records.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Transactions", value: payments.length,         color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" },
          { label: "Total Spent",        value: `$${totalSpent.toFixed(2)}`,   color: "bg-green-100  dark:bg-green-900/40  text-green-600  dark:text-green-400"  },
          { label: "Pending Amount",     value: `$${totalPending.toFixed(2)}`, color: "bg-amber-100  dark:bg-amber-900/40  text-amber-600  dark:text-amber-400"  },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-5 ${color}`}>
            <p className="text-sm font-medium opacity-80">{label}</p>
            <p className="text-2xl font-extrabold mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900 dark:text-white">Transactions</h2>
          <div className="relative w-56">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by order ID..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-12 rounded-xl bg-gray-100 dark:bg-slate-700 animate-pulse" />)}</div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-3">
              <FiCreditCard size={26} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No payment records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Transaction ID", "Amount", "Date", "Payment", "Order"].map(h => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {visible.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{p._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3 font-bold text-gray-900 dark:text-white">${Number(p.amount).toFixed(2)}</td>
                    <td className="py-3 text-gray-500 dark:text-gray-400">{new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                    <td className="py-3"><StatusBadge status={p.paymentStatus} /></td>
                    <td className="py-3">{p.orderStatus ? <StatusBadge status={p.orderStatus} /> : <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>}</td>
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
