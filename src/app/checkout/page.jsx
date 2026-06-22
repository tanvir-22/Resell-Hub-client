"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FiArrowLeft, FiLock, FiTag, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { BsTagFill } from "react-icons/bs";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim());

/* ── appearance configs ── */
const lightAppearance = {
  theme: "flat",
  variables: {
    colorPrimary: "#7c3aed",
    colorBackground: "#ffffff",
    colorText: "#111827",
    colorDanger: "#ef4444",
    colorTextSecondary: "#6b7280",
    colorInputBackground: "#f9fafb",
    colorInputBorder: "#e5e7eb",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSizeBase: "14px",
    borderRadius: "12px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1.5px solid #e5e7eb",
      boxShadow: "none",
      padding: "10px 14px",
      backgroundColor: "#f9fafb",
    },
    ".Input:focus": {
      border: "1.5px solid #7c3aed",
      boxShadow: "0 0 0 3px rgba(124,58,237,0.12)",
      backgroundColor: "#ffffff",
    },
    ".Input--invalid": {
      border: "1.5px solid #ef4444",
    },
    ".Label": {
      color: "#374151",
      fontWeight: "500",
      fontSize: "13px",
      marginBottom: "6px",
    },
    ".Error": {
      color: "#ef4444",
      fontSize: "12px",
    },
    ".Tab": {
      border: "1.5px solid #e5e7eb",
      borderRadius: "10px",
      boxShadow: "none",
    },
    ".Tab--selected": {
      border: "1.5px solid #7c3aed",
      backgroundColor: "#faf5ff",
      boxShadow: "0 0 0 2px rgba(124,58,237,0.15)",
    },
    ".Tab:hover": {
      border: "1.5px solid #7c3aed",
    },
    ".TabIcon--selected": { fill: "#7c3aed" },
    ".TabLabel--selected": { color: "#7c3aed" },
    ".Block": { borderRadius: "12px" },
    ".CheckboxInput": { borderColor: "#7c3aed" },
    ".CheckboxInput--checked": { backgroundColor: "#7c3aed" },
  },
};

const darkAppearance = {
  theme: "flat",
  variables: {
    colorPrimary: "#a78bfa",
    colorBackground: "#1e293b",
    colorText: "#f1f5f9",
    colorDanger: "#f87171",
    colorTextSecondary: "#94a3b8",
    colorInputBackground: "#0f172a",
    colorInputBorder: "#334155",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSizeBase: "14px",
    borderRadius: "12px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1.5px solid #334155",
      boxShadow: "none",
      padding: "10px 14px",
      backgroundColor: "#0f172a",
      color: "#f1f5f9",
    },
    ".Input:focus": {
      border: "1.5px solid #a78bfa",
      boxShadow: "0 0 0 3px rgba(167,139,250,0.15)",
      backgroundColor: "#1e293b",
    },
    ".Input--invalid": { border: "1.5px solid #f87171" },
    ".Label": { color: "#cbd5e1", fontWeight: "500", fontSize: "13px", marginBottom: "6px" },
    ".Error": { color: "#f87171", fontSize: "12px" },
    ".Tab": { border: "1.5px solid #334155", borderRadius: "10px", boxShadow: "none", backgroundColor: "#0f172a" },
    ".Tab--selected": { border: "1.5px solid #a78bfa", backgroundColor: "#1e293b", boxShadow: "0 0 0 2px rgba(167,139,250,0.2)" },
    ".Tab:hover": { border: "1.5px solid #a78bfa" },
    ".TabIcon--selected": { fill: "#a78bfa" },
    ".TabLabel--selected": { color: "#a78bfa" },
    ".Block": { borderRadius: "12px", backgroundColor: "#0f172a" },
    ".CheckboxInput": { borderColor: "#a78bfa", backgroundColor: "#0f172a" },
    ".CheckboxInput--checked": { backgroundColor: "#7c3aed" },
  },
};

/* ── inner form ── */
function CheckoutForm({ userEmail, cartTotal }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError("");

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        receipt_email: userEmail,
        payment_method_data: {
          billing_details: { email: userEmail },
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        options={{
          layout: "tabs",
          fields: { billingDetails: { email: "never" } },
        }}
      />

      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-violet-600/30 text-sm"
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <FiLock size={14} />
            Pay ${cartTotal.toLocaleString()}
            <FiArrowRight size={14} />
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 dark:text-slate-500">
        🔒 Secured by Stripe · Your card details are never stored
      </p>
    </form>
  );
}

/* ── page ── */
export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) { router.replace("/login"); return; }
    if (!cartItems.length) { router.replace("/cart"); return; }

    fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems,
        userEmail: session.user.email,
        buyerInfo: {
          userId: session.user.id,
          name:   session.user.name,
          email:  session.user.email,
        },
      }),
    })
      .then((r) => r.json())
      .then(({ clientSecret }) => setClientSecret(clientSecret));
  }, [isPending, session?.user, cartItems.length]);

  if (isPending || !session?.user || !clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-600/20 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400 dark:text-gray-500">Preparing checkout…</p>
        </div>
      </div>
    );
  }

  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const appearance = isDark ? darkAppearance : lightAppearance;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">

      {/* ── header ── */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <BsTagFill className="text-white" size={14} />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Resell<span className="text-violet-600">Hub</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-gray-400 dark:text-gray-500 line-through">Cart</span>
            <span className="text-gray-300 dark:text-gray-600 mx-1">›</span>
            <span className="font-semibold text-violet-600 dark:text-violet-400">Checkout</span>
            <span className="text-gray-300 dark:text-gray-600 mx-1">›</span>
            <span className="text-gray-400 dark:text-gray-500">Confirmation</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <FiLock size={12} />
            <span className="hidden sm:inline">Secure checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* back + summary line */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium">
            <FiArrowLeft size={15} /> Back to cart
          </Link>
          <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FiShoppingCart size={14} />
            <span>{itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
              <span className="font-semibold text-gray-900 dark:text-white">${cartTotal.toLocaleString()}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── left: order summary ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
                <h2 className="font-bold text-white text-sm">Order Summary</h2>
                <p className="text-violet-200 text-xs mt-0.5">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
              </div>

              <div className="divide-y divide-gray-50 dark:divide-slate-700">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3 p-4 items-center">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0 ring-1 ring-gray-200 dark:ring-slate-600">
                      <img src={item.images?.[0] || item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        <FiTag size={9} className="inline mr-1" />{item.sellerInfo?.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">${item.price.toLocaleString()} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white flex-shrink-0">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="px-5 py-4 bg-gray-50 dark:bg-slate-700/30 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white text-sm">Total</span>
                <span className="text-xl font-extrabold text-violet-600 dark:text-violet-400">${cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 space-y-3">
              {[
                { emoji: "🔒", text: "256-bit SSL encryption" },
                { emoji: "💳", text: "Card details never stored" },
                { emoji: "↩️",  text: "Buyer protection guarantee" },
              ].map(({ emoji, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
                  <span>{emoji}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── right: payment form ── */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                <h2 className="font-bold text-gray-900 dark:text-white">Payment Details</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">All transactions are secure and encrypted</p>
              </div>
              <div className="p-6">
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance, locale: "en" }}
                >
                  <CheckoutForm userEmail={session.user.email} cartTotal={cartTotal} />
                </Elements>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
