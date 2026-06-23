"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, createContext, useContext, useEffect } from "react";
import { signOut } from "@/lib/auth-client";
import { BsTagFill } from "react-icons/bs";
import {
  FiHome, FiShoppingBag, FiHeart, FiCreditCard, FiUser,
  FiGrid, FiPlusSquare, FiPackage, FiTrendingUp,
  FiMenu, FiX, FiLogOut, FiChevronRight, FiUsers, FiShield, FiShoppingCart,
} from "react-icons/fi";

/* ── user context ── */
const UserCtx = createContext(null);
export const useUser = () => useContext(UserCtx);

/* ── nav config ── */
const BUYER_NAV = [
  { href: "/dashboard/buyer",          icon: FiHome,        label: "Overview" },
  { href: "/dashboard/buyer/orders",   icon: FiShoppingBag, label: "My Orders" },
  { href: "/dashboard/buyer/wishlist", icon: FiHeart,       label: "Wishlist" },
  { href: "/dashboard/buyer/payments", icon: FiCreditCard,  label: "Payment History" },
  { href: "/dashboard/buyer/profile",  icon: FiUser,        label: "Profile" },
];

const SELLER_NAV = [
  { href: "/dashboard/seller",             icon: FiHome,       label: "Overview" },
  { href: "/dashboard/seller/add-product", icon: FiPlusSquare, label: "Add Product" },
  { href: "/dashboard/seller/products",    icon: FiPackage,    label: "My Products" },
  { href: "/dashboard/seller/orders",      icon: FiShoppingBag,label: "Manage Orders" },
  { href: "/dashboard/seller/analytics",   icon: FiTrendingUp, label: "Analytics" },
];

const ADMIN_NAV = [
  { href: "/dashboard/admin",            icon: FiHome,       label: "Overview" },
  { href: "/dashboard/admin/users",      icon: FiUsers,      label: "Manage Users" },
  { href: "/dashboard/admin/products",   icon: FiPackage,    label: "Manage Products" },
  { href: "/dashboard/admin/orders",     icon: FiShoppingBag,label: "Manage Orders" },
  { href: "/dashboard/admin/analytics",  icon: FiTrendingUp, label: "Analytics" },
];

/* ── sidebar ── */
function Sidebar({ user, nav, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const initials = user.name
    ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <aside className="flex flex-col h-full w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <BsTagFill className="text-white" size={14} />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Resell<span className="text-emerald-600">Hub</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 lg:hidden">
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Role chip */}
      <div className="px-5 pt-4 pb-2">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
          user.role === "seller"
            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
            : user.role === "admin"
            ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
            : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
        }`}>
          {user.role === "admin" ? <FiShield size={11} /> : <FiGrid size={11} />}
          {user.role === "seller" ? "Seller Dashboard" : user.role === "admin" ? "Admin Dashboard" : "Buyer Dashboard"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label }) => {
          const overviewHrefs = ["/dashboard/buyer", "/dashboard/seller", "/dashboard/admin"];
          const active = pathname === href || (!overviewHrefs.includes(href) && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon size={18} className={active ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"} />
              {label}
              {active && <FiChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User info + sign out */}
      <div className="p-3 border-t border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          {user.image ? (
            <img src={user.image} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name || "User"}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <FiLogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}

/* ── shell ── */
export default function DashboardShell({ user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const nav = user.role === "seller" ? SELLER_NAV : user.role === "admin" ? ADMIN_NAV : BUYER_NAV;

  // Redirect to the correct role section if the URL segment doesn't match
  useEffect(() => {
    const segment = pathname.split("/")[2]; // "buyer" | "seller" | "admin"
    const roleSegment = user.role === "seller" ? "seller" : user.role === "admin" ? "admin" : "buyer";
    if (segment && segment !== roleSegment) {
      router.replace(`/dashboard/${roleSegment}`);
    }
  }, [pathname, user.role, router]);

  return (
    <UserCtx.Provider value={user}>
      <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">

        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-col flex-shrink-0">
          <Sidebar user={user} nav={nav} />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex flex-col flex-shrink-0 z-10">
              <Sidebar user={user} nav={nav} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FiMenu size={22} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                <BsTagFill className="text-white" size={12} />
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                Resell<span className="text-emerald-600">Hub</span>
              </span>
            </Link>
            <div className="w-9" />
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </UserCtx.Provider>
  );
}
