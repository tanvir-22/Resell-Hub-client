"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useUser } from "@/components/dashboard/DashboardShell";
import { FiPlusSquare, FiSearch, FiEdit2, FiTrash2, FiRefreshCw, FiCamera, FiPackage, FiChevronDown } from "react-icons/fi";
import { getProducts, updateProduct, deleteProduct } from "@/lib/api/products";
import { uploadImage } from "@/lib/api/upload";

const CATEGORIES = ["all", "Electronics", "Fashion", "Home & Living", "Books", "Sports", "Cameras", "Computers", "Vehicles", "Other"];
const CONDITIONS = ["Like New", "Used", "Refurbished"];
const inputCls   = "w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500";

function EditModal({ product, onClose, onSave }) {
  const [form, setForm]   = useState({ ...product });
  const [image, setImage] = useState(product.images?.[0] || null);
  const [imgUploading, setImgUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setImgUploading(true);
    try {
      const url = await uploadImage(file);
      // Replace first image, keep the rest unchanged
      setForm(f => ({
        ...f,
        images: [url, ...(Array.isArray(f.images) ? f.images.slice(1) : [])],
      }));
    } finally { setImgUploading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = await updateProduct(product._id, form);
    setSaving(false);
    if (!data.error) onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
          <h3 className="font-bold text-gray-900 dark:text-white">Edit Product</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold">✕</button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Image */}
          <div className="relative cursor-pointer" onClick={() => fileRef.current?.click()}>
            <div className="h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700">
              {image ? (
                <img src={image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full"><FiCamera size={28} className="text-gray-400" /></div>
              )}
              {imgUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="absolute bottom-2 right-2 bg-violet-600 text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
              <FiCamera size={11} /> Change
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Title</label>
            <input value={form.title} onChange={set("title")} className={inputCls} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea value={form.description} onChange={set("description")} rows={3} className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Price ($)</label>
              <input value={form.price} onChange={set("price")} type="number" min="0" step="0.01" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Stock</label>
              <input value={form.stock} onChange={set("stock")} type="number" min="0" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Category</label>
              <select value={form.category} onChange={set("category")} className={inputCls}>
                {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Condition</label>
              <select value={form.condition} onChange={set("condition")} className={inputCls}>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-70">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-5 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 font-medium text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SellerProducts() {
  const user = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing]   = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    if (!user) return;
    getProducts({ sellerId: user.id })
      .then(d => { setProducts(Array.isArray(d) ? d : []); setLoading(false); });
  };

  useEffect(load, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p._id !== id));
    setDeleting(null);
  };

  const visible = products.filter(p => {
    if (category !== "all" && p.category !== category) return false;
    if (search && !p.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Products</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{products.length} product{products.length !== 1 ? "s" : ""} listed</p>
        </div>
        <Link href="/dashboard/seller/add-product" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <FiPlusSquare size={16} /> Add New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div className="relative">
          <select value={category} onChange={e => setCategory(e.target.value)} className="appearance-none pl-3 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
            {CATEGORIES.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
          </select>
          <FiChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-56 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
          <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
            <FiPackage size={28} className="text-violet-500" />
          </div>
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No products found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-5">Start listing items to sell on ResellHub.</p>
          <Link href="/dashboard/seller/add-product" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            <FiPlusSquare size={15} /> Add First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(p => (
            <div key={p._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden group hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-lg transition-all">
              <div className="relative h-40 bg-gray-100 dark:bg-slate-700 overflow-hidden">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full"><FiPackage size={32} className="text-gray-300 dark:text-slate-500" /></div>
                )}
                <span className="absolute top-2 left-2 text-xs font-semibold bg-white/90 dark:bg-slate-800/90 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-lg">
                  {p.condition}
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{p.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-violet-600 dark:text-violet-400 font-bold">${p.price}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Stock: {p.stock}</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{p.category}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditing(p)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border border-gray-200 dark:border-slate-600 py-2 rounded-lg hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 text-gray-600 dark:text-gray-300 transition-colors">
                    <FiEdit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={deleting === p._id}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border border-gray-200 dark:border-slate-600 py-2 rounded-lg hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-60"
                  >
                    {deleting === p._id ? <FiRefreshCw size={13} className="animate-spin" /> : <FiTrash2 size={13} />} Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={updated => { setProducts(prev => prev.map(p => p._id === updated._id ? updated : p)); setEditing(null); }}
        />
      )}
    </div>
  );
}
