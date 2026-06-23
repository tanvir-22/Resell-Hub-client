"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Reveal } from "./Reveal";
import { ProductCard } from "./ProductCard";
import { getProducts } from "@/lib/api/products";

const CONDITION_COLOR = {
  "Like New":    "success",
  "Good":        "primary",
  "Used":        "default",
  "Refurbished": "secondary",
};

function toCardShape(p) {
  return {
    id:             p._id,
    href:           `/products/${p._id}`,
    title:          p.title,
    price:          `$${Number(p.price).toLocaleString()}`,
    condition:      p.condition,
    conditionColor: CONDITION_COLOR[p.condition] ?? "default",
    image:          p.images?.[0] ?? null,
    seller:         p.sellerInfo?.name ?? "—",
    verified:       Boolean(p.verified),
    rating:         p.rating != null ? String(p.rating) : null,
    saves:          p.saves ?? 0,
  };
}

export function FeaturedListings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saved, setSaved]       = useState({});

  useEffect(() => {
    getProducts()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProducts(
          list
            .filter(p => !p.status || p.status === "approved")
            .slice(0, 6)
            .map(toCardShape)
        );
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleSave = (id) => setSaved((p) => ({ ...p, [id]: !p[id] }));

  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Featured Listings
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Hand-picked deals from verified sellers
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            View all <FiArrowRight size={16} />
          </Link>
        </Reveal>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Loading listings…
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              No approved listings yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline"
            >
              Browse all products <FiArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((item, i) => (
                <Reveal key={item.id} delay={i * 80}>
                  <Link href={item.href} className="block h-full">
                    <ProductCard
                      item={item}
                      saved={saved[item.id]}
                      onToggleSave={(id) => { toggleSave(id); }}
                    />
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal delay={100} className="text-center mt-10 sm:hidden">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline"
              >
                View all listings <FiArrowRight size={14} />
              </Link>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
