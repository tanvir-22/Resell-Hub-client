"use client";

import { useCompare } from "@/context/CompareContext";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiX, FiCheck, FiColumns, FiShoppingBag } from "react-icons/fi";
import { MdVerified } from "react-icons/md";

const conditionRank = { "Like New": 4, Good: 3, Used: 2, Refurbished: 1 };

function Badge({ children, highlight }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
      highlight
        ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
        : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
    }`}>
      {highlight && <FiCheck size={10} />}
      {children}
    </span>
  );
}

function Row({ label, children }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: `180px repeat(var(--cols), 1fr)` }}>
      <div className="flex items-center px-4 py-3.5 bg-gray-50 dark:bg-slate-900/60 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-slate-700">
        {label}
      </div>
      {children}
    </div>
  );
}

function Cell({ children, highlight }) {
  return (
    <div className={`flex items-center justify-center px-4 py-3.5 border-l border-b border-gray-100 dark:border-slate-700 text-sm text-center ${
      highlight ? "bg-emerald-50/60 dark:bg-emerald-900/10" : ""
    }`}>
      {children}
    </div>
  );
}

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const router = useRouter();
  const cols   = compareItems.length;

  const bestPrice = Math.min(...compareItems.map(p => p.price ?? Infinity));

  if (cols === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <FiColumns size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nothing to compare</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Browse products and click the compare button to add up to 3 items.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <FiShoppingBag size={16} /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              <FiArrowLeft size={15} /> Back
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <FiColumns size={20} className="text-emerald-500" />
                Compare Products
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Comparing {cols} product{cols > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={clearCompare}
            className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Clear all
          </button>
        </div>

        {/* Compare table */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm"
          style={{ "--cols": cols }}
        >
          {/* Product headers */}
          <div className="grid" style={{ gridTemplateColumns: `180px repeat(${cols}, 1fr)` }}>
            <div className="bg-gray-50 dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-700" />
            {compareItems.map(p => (
              <div key={p._id} className="border-l border-b border-gray-100 dark:border-slate-700 p-4">
                <div className="relative">
                  <button
                    onClick={() => removeFromCompare(p._id)}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <FiX size={11} />
                  </button>
                  <Link href={`/products/${p._id}`}>
                    <div className="h-36 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 mb-3">
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                        : <div className="w-full h-full flex items-center justify-center"><FiShoppingBag size={28} className="text-gray-300 dark:text-slate-500" /></div>}
                    </div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      {p.title}
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Price */}
          <Row label="Price">
            {compareItems.map(p => (
              <Cell key={p._id} highlight={p.price === bestPrice}>
                <span className={`text-lg font-extrabold ${p.price === bestPrice ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>
                  ৳{p.price?.toLocaleString() ?? "—"}
                </span>
                {p.price === bestPrice && compareItems.length > 1 && (
                  <span className="ml-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-full">BEST</span>
                )}
              </Cell>
            ))}
          </Row>

          {/* Condition */}
          <Row label="Condition">
            {compareItems.map(p => {
              const best = Math.max(...compareItems.map(x => conditionRank[x.condition] ?? 0));
              return (
                <Cell key={p._id} highlight={(conditionRank[p.condition] ?? 0) === best && compareItems.length > 1}>
                  <Badge highlight={(conditionRank[p.condition] ?? 0) === best && compareItems.length > 1}>
                    {p.condition ?? "—"}
                  </Badge>
                </Cell>
              );
            })}
          </Row>

          {/* Category */}
          <Row label="Category">
            {compareItems.map(p => (
              <Cell key={p._id}>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                  {p.category ?? "—"}
                </span>
              </Cell>
            ))}
          </Row>

          {/* Stock */}
          <Row label="Stock">
            {compareItems.map(p => {
              const inStock = p.stock == null || Number(p.stock) > 0;
              return (
                <Cell key={p._id}>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    inStock
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  }`}>
                    {inStock ? (p.stock != null ? `${p.stock} left` : "In Stock") : "Out of Stock"}
                  </span>
                </Cell>
              );
            })}
          </Row>

          {/* Seller */}
          <Row label="Seller">
            {compareItems.map(p => (
              <Cell key={p._id}>
                <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                  <MdVerified size={12} className="text-blue-500 flex-shrink-0" />
                  <span className="truncate max-w-[100px]">{p.sellerInfo?.name ?? "—"}</span>
                </span>
              </Cell>
            ))}
          </Row>

          {/* CTA row */}
          <div className="grid border-t border-gray-100 dark:border-slate-700" style={{ gridTemplateColumns: `180px repeat(${cols}, 1fr)` }}>
            <div className="bg-gray-50 dark:bg-slate-900/60" />
            {compareItems.map(p => (
              <div key={p._id} className="border-l border-gray-100 dark:border-slate-700 p-4 flex items-center justify-center">
                <Link
                  href={`/products/${p._id}`}
                  className="w-full text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  View Product
                </Link>
              </div>
            ))}
          </div>
        </div>

        {compareItems.length < 3 && (
          <div className="mt-6 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              + Add another product to compare
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
