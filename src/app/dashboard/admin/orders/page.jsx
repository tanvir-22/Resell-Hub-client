"use client";

import { useEffect, useState, useCallback } from "react";
import { FiShoppingBag, FiChevronDown, FiSearch } from "react-icons/fi";
import StatusBadge from "@/components/dashboard/StatusBadge";
import toast from "react-hot-toast";
import { getAdminOrders, updateAdminOrder } from "@/lib/api/admin";
import { normalizeOrder } from "@/lib/utils/orderUtils";
import SearchInput from "@/components/ui/SearchInput";
import SkeletonList from "@/components/ui/SkeletonList";

const STATUS_TABS = ["all", "Pending", "Accepted", "Processing", "Shipped", "Delivered", "Cancelled"];

// only valid forward transitions — terminal states have empty arrays
const STATUS_FLOW = {
  Pending:    ["Accepted", "Cancelled"],
  Accepted:   ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped:    ["Delivered"],
  Delivered:  [],
  Cancelled:  [],
};


export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("all");
  const [search, setSearch]   = useState("");
  const [updating, setUpdating] = useState(null);
  const [openRow, setOpenRow] = useState(null);

  const load = useCallback((status, q) => {
    setLoading(true);
    getAdminOrders({
      ...(status && status !== "all" ? { status } : {}),
      ...(q ? { search: q } : {}),
    }).then(d => { setOrders(Array.isArray(d) ? d.map(normalizeOrder) : []); setLoading(false); });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(tab, search), 300);
    return () => clearTimeout(t);
  }, [tab, search, load]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await updateAdminOrder(id, { status });
    setOrders(prev => prev.map(o => o._id === id ? normalizeOrder({ ...o, orderStatus: status }) : o));
    toast.success(`Order marked as ${status}`);
    setUpdating(null);
    setOpenRow(null);
  };

  const counts = STATUS_TABS.slice(1).reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Manage Orders</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View all platform orders and resolve disputes.</p>
      </div>

      {/* Status summary chips */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
        {STATUS_TABS.slice(1).map(s => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`flex flex-col items-center py-2.5 px-2 rounded-xl border text-sm transition-colors ${
              tab === s
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-emerald-300"
            }`}
          >
            <span className="font-extrabold text-lg leading-none">{counts[s] ?? 0}</span>
            <span className="text-xs mt-0.5 opacity-80">{s}</span>
          </button>
        ))}
      </div>

      {/* Search + all tab */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === "all" ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"}`}
        >
          All
        </button>
        <div className="relative flex-1">
          <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by product or buyer…"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
          />
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-12 rounded-xl bg-gray-100 dark:bg-slate-700 animate-pulse" />)}</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <FiShoppingBag size={36} className="text-gray-300 dark:text-slate-600 mb-3" />
            <p className="text-gray-400 dark:text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Product", "Buyer", "Seller", "Qty", "Amount", "Transaction ID", "Status", "Date", "Update Status"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white truncate max-w-[130px]">{o.productTitle}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{o.buyerName}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{o.sellerName}</td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{o.quantity ?? 1}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">৳{o.price}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {o.transactionId !== "—" ? (
                        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">
                          {o.transactionId}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      {STATUS_FLOW[o.status]?.length > 0 ? (
                        <div className="relative">
                          <button
                            onClick={() => setOpenRow(openRow === o._id ? null : o._id)}
                            disabled={updating === o._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            {updating === o._id ? "Updating…" : "Set status"} <FiChevronDown size={12} />
                          </button>
                          {openRow === o._id && (
                            <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                              {STATUS_FLOW[o.status].map(s => (
                                <button
                                  key={s}
                                  onClick={() => updateStatus(o._id, s)}
                                  className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-slate-500 italic">—</span>
                      )}
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
