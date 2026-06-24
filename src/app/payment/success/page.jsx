"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { createPayment } from "@/lib/api/payments";
import { Navbar } from "@/components/Navbar";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const run = async () => {
      const orderIds = JSON.parse(localStorage.getItem("pendingOrderIds") || "[]");
      if (orderIds.length > 0 && sessionId) {
        await Promise.all(
          orderIds.map((orderId) =>
            createPayment({ orderId, transactionId: sessionId, paymentStatus: "success" })
          )
        );
        localStorage.removeItem("pendingOrderIds");
      }
      clearCart();
      setDone(true);
    };
    run();
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
        <FiCheckCircle size={40} className="text-green-500" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
        Payment Successful!
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Your order has been placed. You can track it from your dashboard.
      </p>
      <div className="flex gap-3">
        <Link
          href="/dashboard/buyer/orders"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <FiShoppingBag size={16} /> View Orders
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <Suspense>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
