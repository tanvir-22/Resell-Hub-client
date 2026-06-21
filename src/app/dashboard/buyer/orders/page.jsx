"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { FiShoppingBag, FiX, FiRefreshCw, FiSearch } from "react-icons/fi";

const STATUS_FLOW = ["Pending", "Accepted", "Processing", "Shipped", "Delivered"];

function TrackProgress({ status }) {
  const idx = STATUS_FLOW.indexOf(status);
  if (idx === -1) return null;
  return (
    <div className="flex items-center gap-0 mt-2">
      {STATUS_FLOW.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
            i <= idx ? "bg-violet-600 text-white" : "bg-gray-200 dark:bg-slate-600 text-gray-400"
          }`}>
            {i + 1}
          </div>
          {i < STATUS_FLOW.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 ${i < idx ? "bg-violet-600" : "bg-gray-200 dark:bg-slate-600"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function BuyerOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const load = () => {
    setLoading(true);
    fetch("/api/orders?role=buyer")
      .then(r => r.json())
      .then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); });
  };

  useEffect(load, []);

  const cancel = async (id) => {
    setCancelling(id);
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Cancelled" }),
    });
    load();
    if (selected?._id === id) setSelected(null);
    setCancelling(null);
  };

  const visible = orders.filter(o => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.productTitle?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Orders</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track and manage all your orders.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "Pending", "Accepted", "Shipped", "Delivered", "Cancelled"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                filter === s ? "bg-violet-600 text-white" : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-violet-300"
              }`}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Order list */}
        <div className="xl:col-span-2 space-y-3">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />)
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              <FiShoppingBag size={40} className="text-gray-300 dark:text-slate-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No orders found</p>
            </div>
          ) : visible.map(o => (
            <div
              key={o._id}
              onClick={() => setSelected(o._id === selected?._id ? null : o)}
              className={`cursor-pointer p-4 rounded-2xl border transition-all bg-white dark:bg-slate-800 ${
                selected?._id === o._id
                  ? "border-violet-500 shadow-md shadow-violet-100 dark:shadow-violet-900/20"
                  : "border-gray-100 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-700"
              }`}
            >
              <div className="flex items-start gap-4">
                {o.productImage ? (
                  <img src={o.productImage} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                    <FiShoppingBag size={24} className="text-violet-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{o.productTitle}</p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-violet-600 dark:text-violet-400 font-bold mt-1">${o.price}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                  {o.status !== "Cancelled" && o.status !== "Delivered" && (
                    <TrackProgress status={o.status} />
                  )}
                </div>
              </div>
              {o.status === "Pending" && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                  <button
                    onClick={e => { e.stopPropagation(); cancel(o._id); }}
                    disabled={cancelling === o._id}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                  >
                    {cancelling === o._id ? <FiRefreshCw size={13} className="animate-spin" /> : <FiX size={13} />}
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Order detail panel */}
        <div className="hidden xl:block">
          {selected ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Details</h3>
              {selected.productImage && (
                <img src={selected.productImage} alt="" className="w-full h-36 object-cover rounded-xl mb-4 bg-gray-100" />
              )}
              <div className="space-y-3 text-sm">
                {[
                  ["Product", selected.productTitle],
                  ["Price",   `$${selected.price}`],
                  ["Seller",  selected.sellerName || "—"],
                  ["Status",  <StatusBadge key="s" status={selected.status} />],
                  ["Ordered", new Date(selected.createdAt).toLocaleDateString()],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{k}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{v}</span>
                  </div>
                ))}
              </div>
              {selected.status !== "Cancelled" && selected.status !== "Delivered" && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Tracking</p>
                  <TrackProgress status={selected.status} />
                  <div className="flex justify-between mt-2">
                    {STATUS_FLOW.map(s => (
                      <span key={s} className="text-xs text-gray-400 dark:text-gray-500 text-center" style={{ width: `${100 / STATUS_FLOW.length}%` }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 text-center text-gray-400 dark:text-gray-500 text-sm">
              Select an order to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
