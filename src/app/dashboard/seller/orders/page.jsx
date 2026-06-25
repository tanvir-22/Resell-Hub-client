"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  FiShoppingBag, FiRefreshCw, FiSearch, FiUser,
  FiCalendar, FiDollarSign, FiCheck, FiX, FiTruck,
  FiPhone, FiMail, FiMapPin,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { getOrders, updateOrder } from "@/lib/api/orders";
import { useUser } from "@/components/dashboard/DashboardShell";
import { normalizeOrder } from "@/lib/utils/orderUtils";
import SearchInput from "@/components/ui/SearchInput";
import SkeletonList from "@/components/ui/SkeletonList";

const DELIVERY_STATUSES = ["Processing", "Shipped", "Delivered"];

// Statuses a seller can advance to once order is accepted
function getDeliveryOptions(current) {
  const idx = DELIVERY_STATUSES.indexOf(current);
  // allow moving forward only
  return DELIVERY_STATUSES.slice(idx + 1 < 0 ? 0 : idx + 1);
}


export default function SellerOrders() {
  const user = useUser();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [updating, setUpdating] = useState(null);
  const [selected, setSelected] = useState(null);
  // delivery dropdown state per order id
  const [deliveryNext, setDeliveryNext] = useState({});

  const load = () => {
    if (!user?.email) return;
    setLoading(true);
    getOrders({ email: user.email, role: "seller" })
      .then(d => { setOrders(Array.isArray(d) ? d.map(normalizeOrder) : []); setLoading(false); });
  };

  useEffect(load, [user?.email]);

  const doUpdate = async (id, status) => {
    setUpdating(id);
    const raw = await updateOrder(id, { status, orderStatus: status });
    const updated = normalize(raw);
    if (updated.error) {
      toast.error("Failed to update order");
    } else {
      setOrders(prev => prev.map(o => o._id === id ? updated : o));
      if (selected?._id === id) setSelected(updated);
      toast.success(`Order ${status === "Cancelled" ? "rejected" : `marked as ${status}`}`);
    }
    setUpdating(null);
  };

  const visible = orders.filter(o => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.productTitle?.toLowerCase().includes(search.toLowerCase()) && !o.buyerName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});

  // Pending actions block (Accept / Reject)
  const PendingActions = ({ order, compact = false }) => (
    <div className={`flex gap-2 ${compact ? "" : "mt-4"}`}>
      <button
        onClick={() => doUpdate(order._id, "Accepted")}
        disabled={updating === order._id}
        className={`flex items-center gap-1.5 font-semibold rounded-xl transition-all disabled:opacity-60 bg-emerald-600 hover:bg-emerald-700 text-white ${compact ? "text-xs px-3 py-1.5" : "flex-1 justify-center text-sm py-2.5"}`}
      >
        {updating === order._id ? <FiRefreshCw size={13} className="animate-spin" /> : <FiCheck size={13} />}
        Accept Order
      </button>
      <button
        onClick={() => doUpdate(order._id, "Cancelled")}
        disabled={updating === order._id}
        className={`flex items-center gap-1.5 font-semibold rounded-xl transition-all disabled:opacity-60 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 ${compact ? "text-xs px-3 py-1.5" : "flex-1 justify-center text-sm py-2.5"}`}
      >
        {updating === order._id ? <FiRefreshCw size={13} className="animate-spin" /> : <FiX size={13} />}
        Reject
      </button>
    </div>
  );

  // Delivery status update block (Accepted → Processing → Shipped → Delivered)
  const DeliveryActions = ({ order, compact = false }) => {
    const options = getDeliveryOptions(order.status);
    if (!options.length) return null;
    const key = order._id;
    const nextVal = deliveryNext[key] || options[0];

    return (
      <div className={compact ? "mt-3 pt-3 border-t border-gray-100 dark:border-slate-700" : "mt-4"}>
        {!compact && (
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <FiTruck size={12} /> Update Delivery Status
          </p>
        )}
        <div className={`flex gap-2 ${compact ? "justify-end" : ""}`}>
          <select
            value={nextVal}
            onChange={e => setDeliveryNext(p => ({ ...p, [key]: e.target.value }))}
            onClick={e => e.stopPropagation()}
            className={`rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${compact ? "text-xs px-2 py-1.5 flex-1" : "text-sm px-3 py-2.5 flex-1"}`}
          >
            {options.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={e => { e.stopPropagation(); doUpdate(key, nextVal); }}
            disabled={updating === key}
            className={`flex items-center gap-1.5 font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-60 ${compact ? "text-xs px-3 py-1.5" : "text-sm px-4 py-2.5"}`}
          >
            {updating === key ? <FiRefreshCw size={12} className="animate-spin" /> : <FiTruck size={12} />}
            {compact ? "Update" : "Update Status"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Manage Orders</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Accept, reject and update delivery status of orders.</p>
      </div>

      {/* Status filter chips */}
      {!loading && (
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { key: "all",        label: "All",       count: orders.length },
            { key: "Pending",    label: "Pending",   count: counts.Pending    || 0 },
            { key: "Accepted",   label: "Accepted",  count: counts.Accepted   || 0 },
            { key: "Processing", label: "Processing",count: counts.Processing || 0 },
            { key: "Shipped",    label: "Shipped",   count: counts.Shipped    || 0 },
            { key: "Delivered",  label: "Delivered", count: counts.Delivered  || 0 },
            { key: "Cancelled",  label: "Cancelled", count: counts.Cancelled  || 0 },
          ].map(({ key, label, count }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-700"
              }`}>
              {label}
              <span className={`px-1.5 py-0.5 rounded-md text-xs ${filter === key ? "bg-white/20" : "bg-gray-100 dark:bg-slate-700"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by product or buyer..."
          className="w-full sm:w-80 pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
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
                selected?._id === o._id
                  ? "border-emerald-500 shadow-md shadow-emerald-100 dark:shadow-emerald-900/20"
                  : "border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700"
              }`}
            >
              <div className="flex items-start gap-4">
                {o.productImage ? (
                  <img src={o.productImage} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <FiShoppingBag size={22} className="text-emerald-500" />
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
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">৳{o.price}</p>
                </div>
              </div>

              {/* Inline actions */}
              <div onClick={e => e.stopPropagation()}>
                {o.status === "Pending" && <PendingActions order={o} compact />}
                {["Accepted", "Processing", "Shipped"].includes(o.status) && (
                  <DeliveryActions order={o} compact />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="hidden xl:block">
          {selected ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 sticky top-4 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Order Details</h3>

              {selected.productImage && (
                <img src={selected.productImage} alt="" className="w-full h-32 object-cover rounded-xl bg-gray-100" />
              )}

              {/* Order info */}
              <div className="space-y-2.5 text-sm">
                {[
                  [FiShoppingBag, "Product", selected.productTitle],
                  [FiDollarSign,  "Price",   `৳${selected.price}`],
                  [FiCalendar,    "Ordered", new Date(selected.createdAt).toLocaleDateString()],
                ].map(([Icon, k, v]) => (
                  <div key={k} className="flex items-center gap-2.5">
                    <Icon size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{k}:</span>
                    <span className="font-medium text-gray-900 dark:text-white truncate">{v}</span>
                  </div>
                ))}
                <div className="pt-1"><StatusBadge status={selected.status} /></div>
              </div>

              {/* Buyer info */}
              <div className="bg-gray-50 dark:bg-slate-900/60 rounded-xl p-4 space-y-2.5">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <FiUser size={11} /> Buyer Information
                </p>
                {[
                  [FiUser,    "Name",     selected.buyerName],
                  [FiMail,    "Email",    selected.buyerEmail],
                  [FiPhone,   "Phone",    selected.buyerPhone],
                  [FiMapPin,  "Address",  selected.buyerAddress],
                  [FiMapPin,  "Location", selected.buyerLocation],
                ].map(([Icon, k, v]) => v && v !== "—" ? (
                  <div key={k} className="flex items-start gap-2.5 text-sm">
                    <Icon size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500 dark:text-gray-400 flex-shrink-0 w-14">{k}:</span>
                    <span className="font-medium text-gray-900 dark:text-white break-all">{v}</span>
                  </div>
                ) : null)}
              </div>

              {/* Accept / Reject */}
              {selected.status === "Pending" && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Actions</p>
                  <PendingActions order={selected} />
                </div>
              )}

              {/* Delivery status update */}
              {["Accepted", "Processing", "Shipped"].includes(selected.status) && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <FiTruck size={12} /> Update Delivery Status
                  </p>
                  <DeliveryActions order={selected} />
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
