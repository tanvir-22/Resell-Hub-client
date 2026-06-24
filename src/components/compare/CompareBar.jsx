"use client";

import { useRouter } from "next/navigation";
import { useCompare } from "@/context/CompareContext";
import { FiX, FiColumns } from "react-icons/fi";

export function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const router = useRouter();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-600 px-4 py-3 flex items-center gap-3">
        {/* Slots */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto">
          {compareItems.map(p => (
            <div
              key={p._id}
              className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 rounded-xl px-2.5 py-1.5 flex-shrink-0"
            >
              {p.images?.[0] ? (
                <img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex-shrink-0" />
              )}
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200 max-w-[90px] truncate">
                {p.title}
              </span>
              <button
                onClick={() => removeFromCompare(p._id)}
                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <FiX size={13} />
              </button>
            </div>
          ))}
          {/* empty slots */}
          {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-28 h-10 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0"
            >
              <span className="text-xs text-gray-400 dark:text-slate-500">+ Add</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1"
          >
            Clear
          </button>
          <button
            onClick={() => router.push("/compare")}
            disabled={compareItems.length < 2}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <FiColumns size={13} />
            Compare ({compareItems.length})
          </button>
        </div>
      </div>
    </div>
  );
}
