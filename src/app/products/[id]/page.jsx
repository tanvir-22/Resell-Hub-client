"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiStar, FiHeart, FiShoppingBag, FiArrowLeft, FiShare2,
  FiChevronLeft, FiChevronRight, FiMapPin, FiShield, FiPackage, FiTruck,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";

const SAMPLE_PRODUCTS = [
  { _id: "s1",  title: "iPhone 15 Pro Max 256GB Natural Titanium",   category: "Electronics", condition: "Like New", price: 749,  images: ["https://picsum.photos/seed/iphone15/800/600","https://picsum.photos/seed/iphone15b/800/600","https://picsum.photos/seed/iphone15c/800/600"], sellerName: "TechDeals Pro",    sellerImage: "https://picsum.photos/seed/seller1/80/80", sellerLocation: "New York, NY", sellerRating: 4.9, sellerSales: 312,  description: "Excellent condition iPhone 15 Pro Max 256GB in Natural Titanium. Used for only 3 months, screen protector and case always on. Comes with original box, charger, and cable. No scratches or dents. Battery health 98%. Unlocked for all carriers.", stock: 3, saves: 47 },
  { _id: "s2",  title: "Sony WH-1000XM5 Wireless Headphones",        category: "Electronics", condition: "Like New", price: 189,  images: ["https://picsum.photos/seed/sony-wh/800/600","https://picsum.photos/seed/sony-whb/800/600","https://picsum.photos/seed/sony-whc/800/600"], sellerName: "AudioWorld",       sellerImage: "https://picsum.photos/seed/seller2/80/80", sellerLocation: "Austin, TX",  sellerRating: 4.8, sellerSales: 97,   description: "Sony WH-1000XM5 in mint condition. Industry-leading noise cancellation. Used only 5 times, still like new. Comes with original case, cables, and all accessories.", stock: 5, saves: 32 },
  { _id: "s3",  title: "Nike Air Jordan 4 Retro OG Fire Red Sz 10",  category: "Fashion",     condition: "Good",     price: 220,  images: ["https://picsum.photos/seed/jordan4/800/600","https://picsum.photos/seed/jordan4b/800/600","https://picsum.photos/seed/jordan4c/800/600"], sellerName: "KickVault",        sellerImage: "https://picsum.photos/seed/seller3/80/80", sellerLocation: "Chicago, IL", sellerRating: 4.7, sellerSales: 201,  description: "OG Fire Red Jordan 4s in great condition. Worn only twice. Comes with original box and all extras. Size 10 US. Soles still bright white.", stock: 1, saves: 89 },
  { _id: "s4",  title: "MacBook Air M3 13\" 16GB 512GB Space Gray",  category: "Electronics", condition: "Like New", price: 999,  images: ["https://picsum.photos/seed/macbook-m3/800/600","https://picsum.photos/seed/macbook-m3b/800/600","https://picsum.photos/seed/macbook-m3c/800/600"], sellerName: "AppleFlip",      sellerImage: "https://picsum.photos/seed/seller4/80/80", sellerLocation: "San Jose, CA",sellerRating: 5.0, sellerSales: 445,  description: "MacBook Air M3 with 16GB RAM and 512GB SSD. Purchased in January 2024. AppleCare+ until 2026. Barely used – screen and body in pristine condition. Comes with original box and charger.", stock: 2, saves: 120 },
  { _id: "s5",  title: "IKEA POÄNG Armchair in Birch + Cushion",     category: "Furniture",   condition: "Good",     price: 65,   images: ["https://picsum.photos/seed/poang/800/600","https://picsum.photos/seed/poangb/800/600","https://picsum.photos/seed/poangc/800/600"], sellerName: "HomeVibes",       sellerImage: "https://picsum.photos/seed/seller5/80/80", sellerLocation: "Portland, OR",sellerRating: 4.5, sellerSales: 33,   description: "Classic IKEA POÄNG armchair in birch with the Hillared beige cushion. Good condition with minor wear on the cushion. Very comfortable. Local pickup preferred but can arrange delivery nearby.", stock: 1, saves: 14 },
  { _id: "s6",  title: "The Lord of the Rings Boxed Set — Hardcover", category: "Books",       condition: "Good",     price: 38,   images: ["https://picsum.photos/seed/lotr-books/800/600","https://picsum.photos/seed/lotr-booksb/800/600","https://picsum.photos/seed/lotr-booksc/800/600"], sellerName: "PageTurner",    sellerImage: "https://picsum.photos/seed/seller6/80/80", sellerLocation: "Seattle, WA", sellerRating: 4.9, sellerSales: 78,   description: "Complete Lord of the Rings hardcover boxed set including The Hobbit. Tolkien estate illustrated edition. Books in great shape, minor spine wear on box. All three volumes plus The Hobbit are in excellent readable condition.", stock: 4, saves: 55 },
  { _id: "s7",  title: "Canon EOS R50 Mirrorless Camera Body Only",  category: "Electronics", condition: "Like New", price: 499,  images: ["https://picsum.photos/seed/canonr50/800/600","https://picsum.photos/seed/canonr50b/800/600","https://picsum.photos/seed/canonr50c/800/600"], sellerName: "LensFlip",       sellerImage: "https://picsum.photos/seed/seller7/80/80", sellerLocation: "Nashville, TN",sellerRating: 4.8, sellerSales: 56,  description: "Canon EOS R50 mirrorless camera body. Only 500 shutter count. Sensor in immaculate condition. Comes in original box with battery, charger, strap, and all documentation. No scratches on body or viewfinder.", stock: 2, saves: 38 },
  { _id: "s8",  title: "Trek FX 2 Disc Hybrid Bike 2022 Medium",     category: "Sports",      condition: "Good",     price: 440,  images: ["https://picsum.photos/seed/trek-fx2/800/600","https://picsum.photos/seed/trek-fx2b/800/600","https://picsum.photos/seed/trek-fx2c/800/600"], sellerName: "WheelDeals",     sellerImage: "https://picsum.photos/seed/seller8/80/80", sellerLocation: "Denver, CO",  sellerRating: 4.7, sellerSales: 29,   description: "2022 Trek FX 2 Disc in size medium. Great commuter/fitness bike in good condition. New tires and brake pads last month. Minor scuffs on the frame from regular use. Hydraulic disc brakes work perfectly.", stock: 1, saves: 21 },
  { _id: "s9",  title: "Lego Technic Bugatti Chiron #42083",          category: "Toys",        condition: "Like New", price: 155,  images: ["https://picsum.photos/seed/lego-bugatti/800/600","https://picsum.photos/seed/lego-bugattib/800/600","https://picsum.photos/seed/lego-bugattich/800/600"], sellerName: "BrickWorld",  sellerImage: "https://picsum.photos/seed/seller9/80/80", sellerLocation: "Boston, MA",  sellerRating: 4.9, sellerSales: 144,  description: "Lego Technic Bugatti Chiron 42083. Complete set, all pieces accounted for. Built once and displayed. Instructions included. Box has slight shelf wear but the model is in excellent condition.", stock: 1, saves: 66 },
  { _id: "s10", title: "Samsung 49\" Odyssey G9 Curved Monitor",     category: "Electronics", condition: "Good",     price: 599,  images: ["https://picsum.photos/seed/odysseyg9/800/600","https://picsum.photos/seed/odysseyg9b/800/600","https://picsum.photos/seed/odysseyg9c/800/600"], sellerName: "MonitorHaven",  sellerImage: "https://picsum.photos/seed/seller10/80/80",sellerLocation: "Dallas, TX",  sellerRating: 4.6, sellerSales: 88,   description: "Samsung 49-inch Odyssey G9 DQHD curved gaming monitor. 1000R curve, 240Hz, 1ms response time. Minor scuff on the back panel but display surface is perfect with no dead pixels. Comes with all original cables and stand.", stock: 1, saves: 43 },
  { _id: "s11", title: "Levi's 501 Original Jeans W32 L30 Blue",     category: "Fashion",     condition: "Good",     price: 45,   images: ["https://picsum.photos/seed/levis501/800/600","https://picsum.photos/seed/levis501b/800/600","https://picsum.photos/seed/levis501c/800/600"], sellerName: "DenimCraft",    sellerImage: "https://picsum.photos/seed/seller11/80/80",sellerLocation: "Miami, FL",   sellerRating: 4.4, sellerSales: 61,   description: "Levi's 501 Original Fit jeans W32 L30 in medium wash blue. Worn about 20 times. No rips or fading. Classic straight leg. Machine washed carefully. Great everyday denim.", stock: 6, saves: 18 },
  { _id: "s12", title: "PlayStation 5 Console Disc Edition",         category: "Electronics", condition: "Good",     price: 389,  images: ["https://picsum.photos/seed/ps5-console/800/600","https://picsum.photos/seed/ps5-consoleb/800/600","https://picsum.photos/seed/ps5-consolec/800/600"], sellerName: "ConsoleKing",   sellerImage: "https://picsum.photos/seed/seller12/80/80",sellerLocation: "Phoenix, AZ", sellerRating: 4.9, sellerSales: 521,  description: "PlayStation 5 Disc Edition in good condition. Fully working, all ports tested. Comes with 2 DualSense controllers, all cables, and original box. Small cosmetic scuff on the white side panel.", stock: 1, saves: 203 },
  { _id: "s13", title: "Dyson V15 Detect Cordless Vacuum",           category: "Furniture",   condition: "Like New", price: 285,  images: ["https://picsum.photos/seed/dyson-v15/800/600","https://picsum.photos/seed/dyson-v15b/800/600","https://picsum.photos/seed/dyson-v15c/800/600"], sellerName: "CleanLiving",   sellerImage: "https://picsum.photos/seed/seller13/80/80",sellerLocation: "Atlanta, GA", sellerRating: 4.8, sellerSales: 47,   description: "Dyson V15 Detect cordless vacuum in excellent condition. All attachments included. Battery holds charge perfectly (60 min runtime). Laser dust detection works flawlessly. Used for 4 months.", stock: 2, saves: 31 },
  { _id: "s14", title: "GoPro HERO 12 Black Action Camera Bundle",   category: "Electronics", condition: "Like New", price: 259,  images: ["https://picsum.photos/seed/gopro12/800/600","https://picsum.photos/seed/gopro12b/800/600","https://picsum.photos/seed/gopro12c/800/600"], sellerName: "AdventureGear",  sellerImage: "https://picsum.photos/seed/seller14/80/80",sellerLocation: "Salt Lake City",sellerRating: 4.7, sellerSales: 73,  description: "GoPro HERO 12 Black bundle with extra battery, 64GB card, waterproof housing, and 3-way mount. Only used on 2 camping trips. Lens protector always on. Comes with all original accessories.", stock: 3, saves: 29 },
  { _id: "s15", title: "Rolex Datejust 16030 Stainless Steel (1985)",category: "Collectibles",condition: "Good",     price: 3800, images: ["https://picsum.photos/seed/rolex16030/800/600","https://picsum.photos/seed/rolex16030b/800/600","https://picsum.photos/seed/rolex16030c/800/600"], sellerName: "LuxuryFlip",    sellerImage: "https://picsum.photos/seed/seller15/80/80",sellerLocation: "Beverly Hills",sellerRating: 5.0, sellerSales: 189,  description: "Vintage 1985 Rolex Datejust 16030 in stainless steel. Recently serviced by a certified watchmaker. Keeps excellent time. Comes with aftermarket bracelet. Original dial in great condition, no cracks or reluming. Case shows honest vintage patina.", stock: 1, saves: 87 },
  { _id: "s16", title: "Yeti Rambler 30 oz Tumbler Stainless Steel", category: "Sports",      condition: "Like New", price: 28,   images: ["https://picsum.photos/seed/yeti-tumbler/800/600","https://picsum.photos/seed/yeti-tumblerb/800/600","https://picsum.photos/seed/yeti-tumblerc/800/600"], sellerName: "OutdoorFinds",  sellerImage: "https://picsum.photos/seed/seller16/80/80",sellerLocation: "Minneapolis",sellerRating: 4.6, sellerSales: 95,   description: "Yeti Rambler 30 oz tumbler with magslider lid. Used only once. Still in near-perfect condition. Keeps drinks cold 24+ hours and hot 12+ hours. Stainless steel color.", stock: 8, saves: 11 },
];

const RELATED_COUNT = 4;

export default function ProductDetail() {
  const { id } = useParams();
  const router  = useRouter();

  const product = SAMPLE_PRODUCTS.find(p => p._id === id);
  const related = SAMPLE_PRODUCTS.filter(p => p._id !== id && p.category === product?.category).slice(0, RELATED_COUNT);

  const [slide, setSlide]   = useState(0);
  const [saved, setSaved]   = useState(false);
  const [qty, setQty]       = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);

  const images = product?.images || [];

  const prevSlide = () => setSlide(i => (i - 1 + images.length) % images.length);
  const nextSlide = () => setSlide(i => (i + 1) % images.length);

  const handleAddToCart = () => {
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <FiPackage size={48} className="text-gray-300 dark:text-slate-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product not found</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">This listing may have been removed.</p>
          <Link href="/products" className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors">
            Browse listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-violet-600 transition-colors">Browse</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-violet-600 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Image slider */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-lg">
              <img
                src={images[slide]}
                alt={product.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 shadow flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  >
                    <FiChevronLeft size={18} className="text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 shadow flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  >
                    <FiChevronRight size={18} className="text-gray-700 dark:text-gray-300" />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlide(i)}
                        className={`rounded-full transition-all ${i === slide ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      i === slide ? "border-violet-600 shadow-md shadow-violet-600/25" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-1">{product.category}</p>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">{product.title}</h1>
              </div>
              <button
                onClick={() => setSaved(s => !s)}
                className={`p-2.5 rounded-xl border transition-colors flex-shrink-0 ${
                  saved
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500"
                    : "border-gray-200 dark:border-slate-600 text-gray-400 hover:text-red-500 hover:border-red-200"
                }`}
              >
                <FiHeart size={18} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Rating + saves */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <FiStar key={i} size={14} fill={i <= Math.round(product.sellerRating) ? "#f59e0b" : "none"} className="text-amber-400" />
                ))}
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{product.sellerRating}</span>
              </div>
              <span className="text-gray-300 dark:text-slate-600">·</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{product.saves} saves</span>
              <span className="text-gray-300 dark:text-slate-600">·</span>
              <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-5">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${product.price.toLocaleString()}</span>
              <span className={`mb-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
                product.condition === "Like New"
                  ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                  : product.condition === "Good"
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
              }`}>{product.condition}</span>
            </div>

            {/* Description */}
            <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-4 mb-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Qty + buy */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0 border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-bold text-lg">−</button>
                <span className="px-4 py-2.5 font-semibold text-gray-900 dark:text-white min-w-[40px] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-bold text-lg">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors shadow-lg shadow-violet-600/25"
              >
                <FiShoppingBag size={18} />
                {addedMsg ? "Added!" : "Add to Cart"}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { icon: FiShield, label: "Buyer Protection" },
                { icon: FiTruck,  label: "Fast Shipping" },
                { icon: FiPackage,label: "Secure Packaging" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-2.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-center">
                  <Icon size={16} className="text-violet-600 dark:text-violet-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Seller card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={product.sellerImage} alt={product.sellerName} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{product.sellerName}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-0.5"><FiStar size={11} className="text-amber-400" fill="currentColor" /> {product.sellerRating}</span>
                    <span>·</span>
                    <span>{product.sellerSales} sales</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5"><FiMapPin size={10} /> {product.sellerLocation}</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 rounded-xl text-sm font-medium hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                View Seller Profile
              </button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4">More in {product.category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => (
                <Link
                  key={p._id}
                  href={`/products/${p._id}`}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-violet-600/10 hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">{p.title}</h3>
                    <p className="text-base font-extrabold text-gray-900 dark:text-white mt-1.5">${p.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
