"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { FiSearch, FiCheckCircle, FiXCircle, FiTrash2, FiPackage, FiAlertTriangle, FiFilter } from "react-icons/fi";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { getAdminProducts, updateAdminProduct, deleteAdminProduct } from "@/lib/api/admin";

const STATUS_TABS = ["all", "pending", "approved", "rejected"];

function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <p className="text-gray-900 dark:text-white font-semibold mb-1">Delete product?</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const searchParams = useSearchParams();
  const initStatus   = searchParams.get("status") || "all";
  const initReported = searchParams.get("reported") === "true";

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState(initStatus);
  const [search, setSearch]     = useState("");
  const [reported, setReported] = useState(initReported);
  const [confirm, setConfirm]   = useState(null);

  const load = useCallback((status, q, rep) => {
    setLoading(true);
    getAdminProducts({
      ...(status && status !== "all" ? { status } : {}),
      ...(q   ? { search:   q }      : {}),
      ...(rep ? { reported: "true" } : {}),
    }).then(d => { setProducts(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(tab, search, reported), 300);
    return () => clearTimeout(t);
  }, [tab, search, reported, load]);

  const setStatus = async (id, status) => {
    await updateAdminProduct(id, { status });
    setProducts(prev => prev.map(p => p._id === id ? { ...p, status } : p));
  };

  const handleDelete = async (id) => {
    await deleteAdminProduct(id);
    setProducts(prev => prev.filter(p => p._id !== id));
    setConfirm(null);
  };

  const PRODUCT_STATUS_COLORS = {
    pending:  "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    approved: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    rejected: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Manage Products</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review, approve, reject, and delete product listings.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-sm"
          />
        </div>
        <button
          onClick={() => setReported(r => !r)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            reported
              ? "bg-red-600 text-white border-red-600"
              : "border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
          }`}
        >
          <FiAlertTriangle size={15} /> Reported only
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {STATUS_TABS.map(s => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              tab === s
                ? "bg-violet-600 text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <FiPackage size={40} className="text-gray-300 dark:text-slate-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No products found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting the filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
              {/* Image */}
              <div className="relative aspect-video bg-gray-100 dark:bg-slate-700">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiPackage size={32} className="text-gray-300 dark:text-slate-500" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRODUCT_STATUS_COLORS[p.status] || PRODUCT_STATUS_COLORS.pending}`}>
                    {p.status || "pending"}
                  </span>
                  {p.reported && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center gap-1">
                      <FiAlertTriangle size={10} /> Reported
                    </span>
                  )}
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{p.title}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">by {p.sellerInfo?.name || p.sellerName} · {p.category}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-extrabold text-violet-600 dark:text-violet-400">${p.price}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{p.condition}</span>
                </div>
              </div>
              {/* Actions */}
              <div className="flex border-t border-gray-100 dark:border-slate-700">
                {(p.status === "pending" || p.status === "rejected") && (
                  <button
                    onClick={() => setStatus(p._id, "approved")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <FiCheckCircle size={15} /> Approve
                  </button>
                )}
                {(p.status === "pending" || p.status === "approved") && (
                  <button
                    onClick={() => setStatus(p._id, "rejected")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l border-gray-100 dark:border-slate-700"
                  >
                    <FiXCircle size={15} /> Reject
                  </button>
                )}
                <button
                  onClick={() => setConfirm({ id: p._id, title: p.title })}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-l border-gray-100 dark:border-slate-700"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirm && (
        <ConfirmModal
          msg={`"${confirm.title}" will be permanently removed from the platform.`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
