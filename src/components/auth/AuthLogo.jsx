import { BsTagFill } from "react-icons/bs";

/**
 * variant="dark"  → white text, emerald-400 accent (for the dark decorative panel)
 * variant="light" → dark text, emerald-600 accent (for mobile / light backgrounds)
 */
export function AuthLogo({ variant = "light" }) {
  const dark = variant === "dark";
  return (
    <>
      <div
        className={`${dark ? "w-9 h-9 rounded-xl" : "w-8 h-8 rounded-lg"} bg-emerald-600 flex items-center justify-center`}
      >
        <BsTagFill className="text-white" size={dark ? 16 : 14} />
      </div>
      <span
        className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900 dark:text-white"}`}
      >
        Resell<span className={dark ? "text-emerald-400" : "text-emerald-600"}>Hub</span>
      </span>
    </>
  );
}
