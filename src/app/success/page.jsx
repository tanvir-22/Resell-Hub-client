import { stripe } from "@/lib/stripe";
import Link from "next/link";
import {
  FiCheckCircle, FiShoppingBag, FiAlertCircle,
  FiMail, FiArrowRight, FiPackage, FiClock,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { CartClearer } from "@/components/CartClearer";

async function savePayment(paymentIntent) {
  const BASE = process.env.NEXT_PUBLIC_SERVER_URL;
  const orderIds = JSON.parse(paymentIntent.metadata?.orderIds || "[]");

  if (!orderIds.length) return;

  try {
    await fetch(`${BASE}/api/createpayment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderIds,
        transactionId: paymentIntent.id,
        amount:        paymentIntent.amount / 100,
        paymentStatus: "success",
      }),
      cache: "no-store",
    });
  } catch {
    // express backend not ready yet
  }
}

function ErrorScreen({ title, message }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <FiAlertCircle size={36} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{title}</h1>
        {message && <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-sm">{message}</p>}
        <Link href="/cart" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Back to cart <FiArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default async function SuccessPage({ searchParams }) {
  const { payment_intent, redirect_status } = await searchParams;

  if (!payment_intent) {
    return <ErrorScreen title="Invalid session" message="No payment reference found. Did you come here by mistake?" />;
  }

  if (redirect_status !== "succeeded") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
            <FiClock size={36} className="text-amber-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Payment Pending</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
            Your payment is still being processed. Check your dashboard in a few minutes.
          </p>
          <Link href="/dashboard/buyer/orders" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <FiShoppingBag size={16} /> Check Orders
          </Link>
        </div>
      </div>
    );
  }

  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
  } catch {
    return <ErrorScreen title="Payment not found" message="We couldn't verify your payment. Please contact support." />;
  }

  await savePayment(paymentIntent);

  const shortId = paymentIntent.id.replace("pi_", "").slice(0, 16).toUpperCase();
  const amountPaid = (paymentIntent.amount / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <CartClearer />

      <div className="max-w-2xl mx-auto px-4 py-14">

        {/* ── Success hero ── */}
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              <FiCheckCircle size={44} className="text-white" />
            </div>
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 blur-xl -z-10" />
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
            Thanks for your purchase. Confirmation sent to{" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {paymentIntent.receipt_email}
            </span>
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-gray-500 dark:text-gray-400">
            <span className="text-gray-400">Order</span>
            <span className="font-bold text-gray-900 dark:text-white"># {shortId}</span>
          </div>
        </div>

        {/* ── Amount card ── */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden mb-5 shadow-sm">
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2">
              <FiPackage size={16} /> Payment Summary
            </h2>
            <span className="text-emerald-200 text-xs">
              {new Date().toLocaleDateString("en-US", { dateStyle: "medium" })}
            </span>
          </div>

          <div className="px-6 py-6 flex items-center justify-between border-b border-gray-100 dark:border-slate-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Amount charged</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                ৳{amountPaid}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Paid
              </span>
            </div>
          </div>

          <div className="px-6 py-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
              Reference: {paymentIntent.id}
            </p>
          </div>
        </div>

        {/* ── What's next ── */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 mb-8 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">What happens next?</h3>
          <div className="space-y-3">
            {[
              { icon: FiMail,    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",       text: "Confirmation email sent to your inbox" },
              { icon: FiPackage, color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", text: "Seller will prepare your order shortly" },
              { icon: FiClock,   color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",    text: "Track delivery status in your dashboard" },
            ].map(({ icon: Icon, color, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={14} />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/buyer/orders"
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-emerald-600/25 text-sm"
          >
            <FiShoppingBag size={16} /> View My Orders
          </Link>
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            Continue Shopping <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
