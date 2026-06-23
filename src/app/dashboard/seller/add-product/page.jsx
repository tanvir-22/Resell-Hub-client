"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiCamera, FiCheck, FiArrowLeft, FiX, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { uploadImage } from "@/lib/api/upload";
import { createProduct } from "@/lib/api/products";
import { useSession } from "@/lib/auth-client";

const inputCls = "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all";

const CATEGORIES = ["Electronics", "Fashion", "Home & Living", "Books", "Sports", "Cameras", "Computers", "Vehicles", "Other"];
const CONDITIONS = ["Like New", "Good", "Used", "Refurbished"];
const MAX_IMAGES = 4;

export default function AddProduct() {
  const router  = useRouter();
  const fileRef = useRef(null);
  const { data: session } = useSession();

  const [form, setForm] = useState({
    title: "", description: "", category: CATEGORIES[0], condition: CONDITIONS[0],
    price: "", stock: "1", phone: "",
  });

  // Each entry: { preview: string, url: string | null, uploading: boolean }
  const [images, setImages]     = useState([]);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImages = async (e) => {
    const files = Array.from(e.target.files || []);
    const slots = MAX_IMAGES - images.length;
    if (slots <= 0) return;
    const toProcess = files.slice(0, slots);

    // add placeholders immediately so UI updates
    const placeholders = toProcess.map(file => ({
      preview: URL.createObjectURL(file),
      url: null,
      uploading: true,
    }));
    setImages(prev => [...prev, ...placeholders]);

    for (let i = 0; i < toProcess.length; i++) {
      const preview = placeholders[i].preview;
      try {
        const url = await uploadImage(toProcess[i]);
        setImages(prev => prev.map(img =>
          img.preview === preview ? { ...img, url, uploading: false } : img
        ));
      } catch {
        setImages(prev => prev.filter(img => img.preview !== preview));
        setError("One image failed to upload — please try again.");
      }
    }
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const removeImage = (preview) => {
    setImages(prev => prev.filter(img => img.preview !== preview));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) { setError("Title and price are required"); return; }
    if (images.length === 0)        { setError("Please upload at least one product image"); return; }
    if (images.some(i => i.uploading)) { setError("Please wait for uploads to finish"); return; }

    setSaving(true); setError("");
    const imageUrls = images.map(i => i.url).filter(Boolean);
    const user = session?.user;
    const data = await createProduct({
      ...form,
      images: imageUrls,
      user: {
        _id:   user?.id    || "",
        name:  user?.name  || "",
        email: user?.email || "",
        phone: form.phone  || user?.phone || "",
      },
    });
    if (data.error) { setError(data.error || "Failed to create product"); setSaving(false); return; }
    router.push("/dashboard/seller/products");
  };

  const allUploaded = images.length > 0 && images.every(i => !i.uploading && i.url);

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
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Image upload */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Product Images * <span className="font-normal text-gray-400">({images.length}/{MAX_IMAGES})</span>
            </p>
            {allUploaded && (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                <FiCheck size={13} /> All uploaded
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Existing image thumbnails */}
            {images.map((img) => (
              <div key={img.preview} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 group">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                {img.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                {!img.uploading && img.url && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <FiCheck size={11} className="text-white" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img.preview)}
                  className="absolute top-1.5 left-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX size={11} className="text-white" />
                </button>
              </div>
            ))}

            {/* Add more slot */}
            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 flex flex-col items-center justify-center gap-1.5 text-gray-400 dark:text-slate-500 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 flex items-center justify-center transition-colors">
                  {images.length === 0 ? <FiCamera size={20} /> : <FiPlus size={20} />}
                </div>
                <span className="text-xs font-medium">{images.length === 0 ? "Add photo" : "Add more"}</span>
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Upload up to {MAX_IMAGES} images · PNG, JPG up to 5MB each · First image is the cover
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImages}
          />
        </div>

        {/* Basic info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Product Details</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
            <input value={form.title} onChange={set("title")} placeholder="e.g. Dell Inspiron 15 Laptop" required className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={set("description")} rows={4} placeholder="Describe the condition, features, included accessories..." className={`${inputCls} resize-none`} />
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (৳) *</label>
              <input value={form.price} onChange={set("price")} type="number" min="0" step="0.01" placeholder="0.00" required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stock Quantity</label>
              <input value={form.stock} onChange={set("stock")} type="number" min="1" placeholder="1" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contact Phone</label>
            <input value={form.phone} onChange={set("phone")} type="tel" placeholder="e.g. 01700000000" className={inputCls} />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || images.some(i => i.uploading)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
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
