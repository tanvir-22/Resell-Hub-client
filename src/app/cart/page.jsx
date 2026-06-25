"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiShoppingCart, FiTrash2, FiMinus, FiPlus,
  FiArrowRight, FiLock, FiTag, FiPackage,
} from "react-icons/fi";
import { BsStripe } from "react-icons/bs";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/ui/PageLoader";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { data: session, isPending } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/login");
  }, [isPending, session?.user]);

  if (isPending) return <PageLoader label="Loading cart…" />;
  if (!session?.user) return null;

  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleCheckout = () => {
    if (!cartItems.length) return;
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />

      {/* Page header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <FiShoppingCart size={18} className="text-emerald-600 dark:text-emerald-400" />
              </span>
              Your Cart
            </h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 ml-12">
              {itemCount} {itemCount === 1 ? "item" : "items"} · ৳{cartTotal.toLocaleString()} total
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <FiTrash2 size={13} /> Clear all
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-28 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center mb-5">
              <FiShoppingCart size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Your cart is empty</h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-7 text-center max-w-xs">
              Looks like you haven&apos;t added anything yet. Explore our listings and grab a deal!
            </p>
            <Link
              href="/products"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-600/20"
            >
              Browse Listings <FiArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Item list ── */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="group flex gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 hover:border-emerald-200 dark:hover:border-emerald-700/50 hover:shadow-md transition-all duration-200"
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0 ring-1 ring-gray-200 dark:ring-slate-600">
                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <FiTag size={10} className="text-gray-400" />
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {item.sellerInfo?.name || "Seller"}
                      </p>
                    </div>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-2 text-sm">
                      ৳{item.price.toLocaleString()} <span className="text-gray-400 dark:text-gray-500 font-normal">each</span>
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-2.5 py-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-gray-600 dark:text-gray-300 disabled:opacity-40"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-bold text-gray-900 dark:text-white min-w-[36px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-2.5 py-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-gray-600 dark:text-gray-300"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="text-right flex-shrink-0 flex flex-col justify-between">
                    <p className="font-extrabold text-gray-900 dark:text-white text-base">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        ৳{item.price.toLocaleString()} × {item.quantity}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order summary ── */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden sticky top-6">
                {/* Summary header */}
                <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-600">
                  <h2 className="font-bold text-white text-base">Order Summary</h2>
                  <p className="text-emerald-200 text-xs mt-0.5">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
                </div>

                {/* Line items */}
                <div className="px-5 py-4 space-y-2.5 border-b border-gray-100 dark:border-slate-700">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                        {item.title}{item.quantity > 1 ? ` ×${item.quantity}` : ""}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white flex-shrink-0 ml-3">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="px-5 py-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>৳{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                    <span className="flex items-center gap-1">
                      <FiPackage size={12} /> Shipping
                    </span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-gray-900 dark:text-white text-lg pt-2 border-t border-gray-100 dark:border-slate-700 mt-2">
                    <span>Total</span>
                    <span>৳{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <div className="px-5 pb-5">
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-emerald-600/30 text-sm"
                  >
                    <>
                      <FiLock size={14} />
                      Proceed to Checkout
                      <FiArrowRight size={14} />
                    </>
                  </button>

                  {/* Trust badge */}
                  <div className="flex items-center justify-center gap-2 mt-3 text-gray-400 dark:text-slate-500 text-xs">
                    <FiLock size={11} />
                    <span>Powered by</span>
                    <BsStripe size={14} className="text-[#635BFF]" />
                    <span className="font-semibold text-[#635BFF]">Stripe</span>
                  </div>
                </div>
              </div>

              {/* Continue shopping */}
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
