const MAP = {
  Pending:    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  Accepted:   "bg-blue-100  dark:bg-blue-900/30  text-blue-700  dark:text-blue-300",
  Processing: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
  Shipped:    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  Delivered:  "bg-green-100 dark:bg-green-900/30 text-green-700  dark:text-green-300",
  Cancelled:  "bg-red-100   dark:bg-red-900/30   text-red-700   dark:text-red-300",
  Completed:  "bg-green-100 dark:bg-green-900/30 text-green-700  dark:text-green-300",
  Refunded:   "bg-gray-100  dark:bg-gray-700/30  text-gray-600  dark:text-gray-300",
  Failed:     "bg-red-100   dark:bg-red-900/30   text-red-700   dark:text-red-300",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${MAP[status] || MAP.Pending}`}>
      {status}
    </span>
  );
}
