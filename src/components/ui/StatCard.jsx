"use client";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

/**
 * layout="row"      → horizontal (buyer style)
 * layout="col"      → vertical   (seller style)
 * variant="card"    → white bg, colored icon box
 * variant="gradient"→ colored gradient bg, white icon (admin style)
 *
 * color prop:
 *   card variant    → icon box className  (e.g. "bg-emerald-100 text-emerald-600 ...")
 *   gradient variant→ container className (e.g. "bg-gradient-to-br from-blue-500 to-blue-700")
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  href,
  layout = "row",
  variant = "card",
}) {
  const isGradient = variant === "gradient";
  const isCol = layout === "col";

  return (
    <Link
      href={href}
      className={`group ${isCol ? "flex flex-col gap-3" : "flex items-center gap-4"} p-5 rounded-2xl transition-all ${
        isGradient
          ? `${color} hover:-translate-y-0.5`
          : "bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-lg"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isGradient ? "bg-white/20" : color
        }`}
      >
        <Icon size={22} className={isGradient ? "text-white" : ""} />
      </div>

      <div className={isCol ? "" : "min-w-0 flex-1"}>
        {isGradient && (
          <p className="text-white/80 text-sm font-medium">{label}</p>
        )}
        <p
          className={`text-2xl font-extrabold ${
            isGradient ? "text-white mt-0.5" : "text-gray-900 dark:text-white"
          }`}
        >
          {value ?? "—"}
        </p>
        {!isGradient && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
        )}
        {sub && (
          <p
            className={`text-xs mt-1 ${
              isGradient ? "text-white/60" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {sub}
          </p>
        )}
      </div>

      <FiArrowRight
        size={16}
        className={`flex-shrink-0 ${isCol ? "" : "ml-auto"} ${
          isGradient
            ? "text-white/60 group-hover:text-white"
            : "text-gray-300 dark:text-gray-600 group-hover:text-emerald-500"
        } transition-colors`}
      />
    </Link>
  );
}
