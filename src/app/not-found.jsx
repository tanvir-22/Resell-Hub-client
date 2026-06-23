import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/home/SiteFooter";
import {
  FiHome,
  FiArrowLeft,
  FiSearch,
  FiShoppingBag,
} from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-300/20 dark:bg-violet-900/20 rounded-full blur-3xl animate-blob pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-300/20 dark:bg-fuchsia-900/20 rounded-full blur-3xl animate-blob animation-delay-2s pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* 404 number */}
          <div className="relative inline-block mb-6">
            <span className="text-[10rem] sm:text-[14rem] font-extrabold leading-none select-none bg-gradient-to-br from-violet-600 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
              404
            </span>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 blur-3xl -z-10 rounded-full" />
          </div>

          {/* Illustration icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border border-gray-100 dark:border-slate-700">
              <FiSearch size={36} className="text-violet-400" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
            Page not found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base mb-10 max-w-md mx-auto leading-relaxed">
            Looks like this page wandered off — just like a great deal that
            sold out too fast. Let&apos;s get you back on track.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="shine-btn inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-violet-600/25 text-sm"
            >
              <FiHome size={16} /> Back to Home
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all text-sm"
            >
              <FiShoppingBag size={16} /> Browse Listings
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-wider font-semibold">
              Popular pages
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "Electronics", href: "/products?category=Electronics" },
                { label: "Fashion", href: "/products?category=Fashion" },
                { label: "Categories", href: "/categories" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 rounded-lg hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
