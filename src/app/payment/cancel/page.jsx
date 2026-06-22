"use client";

import Link from "next/link";
import { FiXCircle, FiShoppingCart } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <FiXCircle size={40} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          Your payment was cancelled. Your cart items are still saved.
        </p>
        <div className="flex gap-3">
          <Link
            href="/cart"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <FiShoppingCart size={16} /> Back to Cart
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
