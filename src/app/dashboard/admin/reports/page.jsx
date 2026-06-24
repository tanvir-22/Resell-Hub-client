"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReports, updateReport } from "@/lib/api/reports";
import {
  FiFlag, FiRefreshCw, FiSearch, FiExternalLink,
  FiCheck, FiX, FiEye, FiAlertTriangle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  pending:  "bg-amber-100  dark:bg-amber-900/30  text-amber-700  dark:text-amber-300",
  reviewed: "bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-300",
  resolved: "bg-green-100  dark:bg-green-900/30  text-green-700  dark:text-green-300",
  dismissed:"bg-gray-100   dark:bg-slate-700      text-gray-600   dark:text-gray-300",
};

const REASON_LABELS = {
  counterfeit:   "Counterfeit / Fake item",
  misleading:    "Misleading description",
  prohibited:    "Prohibited item",
  spam:          "Spam / Duplicate listing",
  wrong_category:"Wrong category",
  other:         "Other",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.pending}`}>
      {status}
    </span>
  );
}

export default function AdminReportsPage() {
  const [reports,  setReports]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setLoading(true);
    getReports().then(d => {
      setReports(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const doUpdate = async (id, status) => {
    setUpdating(id);
    const updated = await updateReport(id, { status });
    if (updated._id) {
      setReports(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      toast.success(`Report marked as ${status}`);
    } else {
      toast.error("Failed to update");
    }
    setUpdating(null);
  };

  const visible = reports.filter(r => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.productTitle?.toLowerCase().includes(q) ||
             r.reporterInfo?.name?.toLowerCase().includes(q) ||
             r.reason?.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = reports.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  const FILTERS = [
    { key: "all",      label: "All",       count: reports.length },
    { key: "pending",  label: "Pending",   count: counts.pending  || 0 },
    { key: "reviewed", label: "Reviewed",  count: counts.reviewed || 0 },
    { key: "resolved", label: "Resolved",  count: counts.resolved || 0 },
    { key: "dismissed",label: "Dismissed", count: counts.dismissed|| 0 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <FiFlag className="text-red-500" /> Reports
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Review and resolve product reports submitted by users.
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              filter === key
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-700"
            }`}
          >
            {label}
            <span className={`px-1.5 py-0.5 rounded-md text-xs ${filter === key ? "bg-white/20" : "bg-gray-100 dark:bg-slate-700"}`}>
              {count}
            </span>
          </button>
        ))}

        <button
          onClick={load}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 transition-colors"
        >
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by product, reporter, reason..."
          className="w-full sm:w-80 pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
          <FiFlag size={36} className="text-gray-300 dark:text-slate-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No reports found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/40">
                  {["Product", "Reason", "Reporter", "Date", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {visible.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    {/* Product */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {r.status === "pending" && (
                          <FiAlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1 max-w-[180px]">
                            {r.productTitle || "—"}
                          </p>
                          <Link
                            href={`/products/${r.productId}`}
                            target="_blank"
                            className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 hover:underline mt-0.5"
                          >
                            View <FiExternalLink size={10} />
                          </Link>
                        </div>
                      </div>
                    </td>
                    {/* Reason */}
                    <td className="px-4 py-3.5">
                      <span className="text-gray-700 dark:text-gray-300">
                        {REASON_LABELS[r.reason] || r.reason || "—"}
                      </span>
                      {r.details && (
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 line-clamp-1 max-w-[160px]">
                          {r.details}
                        </p>
                      )}
                    </td>
                    {/* Reporter */}
                    <td className="px-4 py-3.5">
                      <p className="text-gray-700 dark:text-gray-300">{r.reporterInfo?.name || "—"}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">{r.reporterInfo?.email || ""}</p>
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      }) : "—"}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={r.status} />
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {r.status === "pending" && (
                          <button
                            onClick={() => doUpdate(r._id, "reviewed")}
                            disabled={updating === r._id}
                            title="Mark as Reviewed"
                            className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            {updating === r._id ? <FiRefreshCw size={11} className="animate-spin" /> : <FiEye size={11} />}
                          </button>
                        )}
                        {["pending", "reviewed"].includes(r.status) && (
                          <button
                            onClick={() => doUpdate(r._id, "resolved")}
                            disabled={updating === r._id}
                            title="Mark as Resolved"
                            className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            {updating === r._id ? <FiRefreshCw size={11} className="animate-spin" /> : <FiCheck size={11} />}
                          </button>
                        )}
                        {r.status !== "dismissed" && (
                          <button
                            onClick={() => doUpdate(r._id, "dismissed")}
                            disabled={updating === r._id}
                            title="Dismiss"
                            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            {updating === r._id ? <FiRefreshCw size={11} className="animate-spin" /> : <FiX size={11} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
