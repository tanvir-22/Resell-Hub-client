"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { FiShoppingBag, FiRefreshCw, FiSearch, FiChevronDown, FiUser, FiCalendar, FiDollarSign } from "react-icons/fi";
import { getOrders, updateOrder } from "@/lib/api/orders";

const STATUS_ACTIONS = {
  Pending:    [{ label: "Accept",  next: "Accepted", cls: "bg-blue-600 hover:bg-blue-700 text-white" }, { label: "Reject", next: "Cancelled", cls: "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400" }],
  Accepted:   [{ label: "Mark Processing", next: "Processing", cls: "bg-indigo-600 hover:bg-indigo-700 text-white" }],
  Processing: [{ label: "Mark Shipped",    next: "Shipped",    cls: "bg-violet-600 hover:bg-violet-700 text-white" }],
  Shipped:    [{ label: "Mark Delivered",  next: "Delivered",  cls: "bg-green-600  hover:bg-green-700  text-white" }],
};

export default function SellerOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [updating, setUpdating] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    getOrders({ role: "seller" })
      .then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); });
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    const updated = await updateOrder(id, { status });
    if (!updated.error) {
      setOrders(prev => prev.map(o => o._id === id ? updated : o));
      if (selected?._id === id) setSelected(updated);
    }
    setUpdating(null);
  };

  const visible = orders.filter(o => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.productTitle?.toLowerCase().includes(search.toLowerCase()) && !o.buyerName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Manage Orders</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Accept, process and ship customer orders.</p>
      </div>

      {/* Status summary chips */}
      {!loading && (
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { key: "all",       label: "All",        count: orders.length },
            { key: "Pending",   label: "Pending",    count: counts.Pending    || 0 },
            { key: "Accepted",  label: "Accepted",   count: counts.Accepted   || 0 },
            { key: "Shipped",   label: "Shipped",    count: counts.Shipped    || 0 },
            { key: "Delivered", label: "Delivered",  count: counts.Delivered  || 0 },
            { key: "Cancelled", label: "Cancelled",  count: counts.Cancelled  || 0 },
          ].map(({ key, label, count }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                filter === key ? "bg-violet-600 text-white shadow-md shadow-violet-600/25" : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-violet-300 dark:hover:border-violet-700"
              }`}>
              {label} <span className={`px-1.5 py-0.5 rounded-md text-xs ${filter === key ? "bg-white/20" : "bg-gray-100 dark:bg-slate-700"}`}>{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product or buyer..." className="w-full sm:w-80 pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Order list */}
        <div className="xl:col-span-2 space-y-3">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-28 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />)
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
                selected?._id === o._id ? "border-violet-500 shadow-md shadow-violet-100 dark:shadow-violet-900/20" : "border-gray-100 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-700"
              }`}
            >
              <div className="flex items-start gap-4">
                {o.productImage ? (
                  <img src={o.productImage} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                    <FiShoppingBag size={22} className="text-violet-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{o.productTitle}</p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Buyer: <span className="text-gray-700 dark:text-gray-300 font-medium">{o.buyerName}</span>
                  </p>
                  <p className="text-violet-600 dark:text-violet-400 font-bold mt-1">${o.price}</p>
                </div>
              </div>

              {/* Action buttons */}
              {STATUS_ACTIONS[o.status] && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 flex gap-2 justify-end" onClick={e => e.stopPropagation()}>
                  {STATUS_ACTIONS[o.status].map(({ label, next, cls }) => (
                    <button
                      key={next}
                      onClick={() => updateStatus(o._id, next)}
                      disabled={updating === o._id}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${cls}`}
                    >
                      {updating === o._id ? <FiRefreshCw size={12} className="animate-spin" /> : null}
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="hidden xl:block">
          {selected ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Details</h3>
              {selected.productImage && (
                <img src={selected.productImage} alt="" className="w-full h-32 object-cover rounded-xl mb-4 bg-gray-100" />
              )}
              <div className="space-y-3 text-sm">
                {[
                  [FiShoppingBag, "Product",  selected.productTitle],
                  [FiDollarSign,  "Price",    `$${selected.price}`],
                  [FiUser,        "Buyer",    selected.buyerName],
                  [FiCalendar,    "Ordered",  new Date(selected.createdAt).toLocaleDateString()],
                ].map(([Icon, k, v]) => (
                  <div key={k} className="flex items-center gap-2.5">
                    <Icon size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{k}:</span>
                    <span className="font-medium text-gray-900 dark:text-white truncate">{v}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              {STATUS_ACTIONS[selected.status] && (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Actions</p>
                  {STATUS_ACTIONS[selected.status].map(({ label, next, cls }) => (
                    <button
                      key={next}
                      onClick={() => updateStatus(selected._id, next)}
                      disabled={updating === selected._id}
                      className={`w-full text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 ${cls}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 text-center text-gray-400 dark:text-gray-500 text-sm">
              Select an order to see details and take action
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
