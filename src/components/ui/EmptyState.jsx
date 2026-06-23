import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export function EmptyState({
  icon: Icon,
  message,
  subMessage,
  actionHref,
  actionLabel,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-14 text-center ${className}`}>
      {Icon && (
        <Icon size={40} className="text-gray-300 dark:text-slate-600 mb-3" />
      )}
      <p className="text-gray-500 dark:text-gray-400 font-medium">{message}</p>
      {subMessage && (
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{subMessage}</p>
      )}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
        >
          {actionLabel} <FiArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
