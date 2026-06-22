"use client";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Reveal } from "./Reveal";
import { ProductCard } from "./ProductCard";

const listings = [
  {
    id: 1, title: "iPhone 15 Pro Max 256GB",
    price: "$750", originalPrice: "$1,199",
    condition: "Like New", conditionColor: "success",
    image: "https://placehold.co/400x300/7c3aed/ffffff?text=iPhone+15+Pro",
    seller: "TechDeals Pro", verified: true, rating: "4.9", saves: 47,
  },
  {
    id: 2, title: "MacBook Pro M3 14-inch",
    price: "$1,200", originalPrice: "$1,999",
    condition: "Good", conditionColor: "primary",
    image: "https://placehold.co/400x300/3b82f6/ffffff?text=MacBook+Pro+M3",
    seller: "AppleHub Store", verified: true, rating: "4.8", saves: 89,
  },
  {
    id: 3, title: "Sony PlayStation 5 Bundle",
    price: "$380", originalPrice: "$499",
    condition: "Like New", conditionColor: "success",
    image: "https://placehold.co/400x300/1e40af/ffffff?text=PlayStation+5",
    seller: "GameVault", verified: false, rating: "4.7", saves: 123,
  },
  {
    id: 4, title: "Canon EOS R6 Mark II",
    price: "$1,600", originalPrice: "$2,499",
    condition: "Good", conditionColor: "primary",
    image: "https://placehold.co/400x300/ea580c/ffffff?text=Canon+EOS+R6",
    seller: "LensWorld", verified: true, rating: "5.0", saves: 56,
  },
  {
    id: 5, title: "Nike Air Jordan 1 Retro OG",
    price: "$185", originalPrice: "$280",
    condition: "Good", conditionColor: "primary",
    image: "https://placehold.co/400x300/dc2626/ffffff?text=Air+Jordan+1",
    seller: "SneakerHub", verified: true, rating: "4.6", saves: 34,
  },
  {
    id: 6, title: "DJI Mavic 3 Pro Drone",
    price: "$1,400", originalPrice: "$2,199",
    condition: "Like New", conditionColor: "success",
    image: "https://placehold.co/400x300/0891b2/ffffff?text=DJI+Mavic+3",
    seller: "FlyHigh Drones", verified: true, rating: "4.9", saves: 78,
  },
];

export function FeaturedListings() {
  const [saved, setSaved] = useState({});
  const toggleSave = (id) => setSaved((p) => ({ ...p, [id]: !p[id] }));

  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Featured Listings
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Hand-picked deals from verified sellers</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold text-sm hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
            View all <FiArrowRight size={16} />
          </button>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item, i) => (
            <Reveal key={item.id} delay={i * 80}>
              <ProductCard item={item} saved={saved[item.id]} onToggleSave={toggleSave} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
