export default function SkeletonList({ count = 5, height = "h-12" }) {
  return (
    <div className="p-6 space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${height} rounded-xl bg-gray-100 dark:bg-slate-700 animate-pulse`} />
      ))}
    </div>
  );
}
