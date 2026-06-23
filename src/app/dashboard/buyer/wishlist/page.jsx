"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiHeart, FiTrash2, FiArrowRight, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import { getWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { useSession } from "@/lib/auth-client";

export default function BuyerWishlist() {
  const { data: session } = useSession();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (!session?.user) return;
    setLoading(true);
    getWishlist(session.user.email).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); });
  }, [session?.user]);

  const remove = async (id) => {
    setRemoving(id);
    await removeFromWishlist(id, session.user.email);
    setItems(prev => prev.filter(i => i._id !== id));
    setRemoving(null);
    toast("Removed from wishlist", { icon: "🤍", duration: 1500 });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Wishlist</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Products saved for later.</p>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-64 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4">
            <FiHeart size={30} className="text-rose-500" />
          </div>
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Your wishlist is empty</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Browse listings and save items you love.</p>
          <Link href="/" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            Browse Listings <FiArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item._id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
              <div className="relative h-44 bg-gray-100 dark:bg-slate-700">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiHeart size={36} className="text-gray-300 dark:text-slate-500" />
                  </div>
                )}
                <button
                  onClick={() => remove(item._id)}
                  disabled={removing === item._id}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors disabled:opacity-60"
                >
                  {removing === item._id
                    ? <FiRefreshCw size={14} className="animate-spin" />
                    : <FiTrash2 size={14} />}
                </button>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate mb-1">{item.title}</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">${item.price}</p>
                {item.seller && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">By {item.seller}</p>
                )}
                <div className="mt-3 flex gap-2">
                  <Link
                    href="/"
                    className="flex-1 text-center text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition-colors"
                  >
                    View Product
                  </Link>
                  <button
                    onClick={() => remove(item._id)}
                    className="p-2 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 transition-colors text-gray-400"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
