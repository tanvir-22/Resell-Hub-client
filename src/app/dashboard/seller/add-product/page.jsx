"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiCamera, FiCheck, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const inputCls = "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all";

const CATEGORIES  = ["Electronics", "Fashion", "Home & Living", "Books", "Sports", "Cameras", "Computers", "Vehicles", "Other"];
const CONDITIONS  = ["Like New", "Used", "Refurbished"];

export default function AddProduct() {
  const router = useRouter();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "", description: "", category: CATEGORIES[0], condition: CONDITIONS[0],
    price: "", stock: "1",
  });
  const [image, setImage]         = useState(null);
  const [imageUrl, setImageUrl]   = useState("");
  const [imgUploading, setImgUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }
    setImage(URL.createObjectURL(file));
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res  = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) setImageUrl(json.data.url);
      else setError("Image upload failed");
    } catch { setError("Image upload failed"); }
    finally { setImgUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) { setError("Title and price are required"); return; }
    if (!imageUrl) { setError("Please upload a product image"); return; }

    setSaving(true); setError("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, image: imageUrl }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed to create product"); setSaving(false); return; }
    router.push("/dashboard/seller/products");
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/seller/products" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Add Product</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">List a new item for sale.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl">{error}</div>}

        {/* Image upload */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Product Image *</p>
          <div
            onClick={() => fileRef.current?.click()}
            className="relative cursor-pointer border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-2xl overflow-hidden hover:border-violet-400 dark:hover:border-violet-500 transition-colors group"
            style={{ minHeight: "180px" }}
          >
            {image ? (
              <img src={image} alt="" className="w-full h-48 object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400 dark:text-slate-500">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
                  <FiCamera size={24} className="group-hover:text-violet-500 transition-colors" />
                </div>
                <p className="text-sm">Click to upload product image</p>
                <p className="text-xs text-gray-300 dark:text-slate-600">PNG, JPG up to 5MB</p>
              </div>
            )}
            {imgUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            {image && !imgUploading && (
              <div className="absolute top-3 right-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck size={14} className="text-white" />
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>

        {/* Basic info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Product Details</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
            <input value={form.title} onChange={set("title")} placeholder="e.g. iPhone 15 Pro Max 256GB" required className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={set("description")} rows={4} placeholder="Describe the product condition, features, and any relevant details..." className={`${inputCls} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select value={form.category} onChange={set("category")} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Condition</label>
              <select value={form.condition} onChange={set("condition")} className={inputCls}>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price ($) *</label>
              <input value={form.price} onChange={set("price")} type="number" min="0" step="0.01" placeholder="0.00" required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stock Quantity</label>
              <input value={form.stock} onChange={set("stock")} type="number" min="1" placeholder="1" className={inputCls} />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit" disabled={saving || imgUploading}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            {saving ? "Publishing..." : "Publish Product"}
          </button>
          <Link href="/dashboard/seller/products" className="px-6 py-3.5 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 font-medium text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
