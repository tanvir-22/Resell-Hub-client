"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@/components/dashboard/DashboardShell";
import { updateUser, changePassword } from "@/lib/auth-client";
import { FiCamera, FiSave, FiUser, FiLock, FiPhone, FiMapPin } from "react-icons/fi";
import { uploadImage } from "@/lib/api/upload";

const inputCls = "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all";

export default function BuyerProfile() {
  const user   = useUser();
  const router = useRouter();

  const [name, setName]               = useState("");
  const [phone, setPhone]             = useState("");
  const [address, setAddress]         = useState("");
  const [profileImg, setProfileImg]   = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [imgUploading, setImgUploading]   = useState(false);
  const [saving, setSaving]           = useState(false);

  // Populate fields once user is loaded — avoids server/client hydration mismatch
  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setPhone(user.phone || "");
    setAddress(user.address || "");
    setProfileImgUrl(user.image || "");
  }, [user]);

  const [curPw, setCurPw]   = useState("");
  const [newPw, setNewPw]   = useState("");
  const [cfmPw, setCfmPw]   = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const fileRef = useRef(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setProfileImg(URL.createObjectURL(file));
    setImgUploading(true);
    try {
      const url = await uploadImage(file);
      setProfileImgUrl(url);
      toast.success("Photo uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setImgUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await updateUser({ name, image: profileImgUrl || undefined, phone, address });
    setSaving(false);
    if (error) {
      toast.error(error.message || "Update failed");
    } else {
      toast.success("Profile saved!");
      router.refresh();
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!curPw)          { toast.error("Enter your current password"); return; }
    if (newPw.length < 8){ toast.error("New password must be at least 8 characters"); return; }
    if (newPw !== cfmPw) { toast.error("Passwords don't match"); return; }

    setPwSaving(true);
    const { error } = await changePassword({
      currentPassword: curPw,
      newPassword: newPw,
      revokeOtherSessions: false,
    });
    setPwSaving(false);

    if (error) {
      const msg = error.message || "";
      if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("incorrect")) {
        toast.error("Current password is incorrect");
      } else {
        toast.error(error.message || "Failed to update password");
      }
      return;
    }

    toast.success("Password updated successfully!");
    setCurPw(""); setNewPw(""); setCfmPw("");
  };

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your personal information.</p>
      </div>

      {/* Avatar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              {(profileImg || profileImgUrl) ? (
                <img src={profileImg || profileImgUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-2xl">{initials}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 transition-colors"
            >
              {imgUploading
                ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                : <FiCamera size={13} className="text-white" />}
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{user?.name || "User"}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <button onClick={() => fileRef.current?.click()} className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              Change photo
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 mb-5">
        <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <FiUser size={17} className="text-emerald-500" /> Personal Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input value={user?.email || ""} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
              <FiPhone size={14} /> Phone Number
            </label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
              <FiMapPin size={14} /> Address
            </label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} placeholder="Your delivery address..." className={`${inputCls} resize-none`} />
          </div>
        </div>
        <button
          type="submit" disabled={saving}
          className="mt-5 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-70 hover:scale-[1.02]"
        >
          {saving
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            : <><FiSave size={16} /> Save Changes</>}
        </button>
      </form>

      {/* Password form */}
      <form onSubmit={handlePasswordChange} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <FiLock size={17} className="text-emerald-500" /> Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
            <input type="password" value={curPw} onChange={e => setCurPw(e.target.value)} placeholder="••••••••" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
            <input type="password" value={cfmPw} onChange={e => setCfmPw(e.target.value)} placeholder="••••••••" className={inputCls} />
          </div>
        </div>
        <button
          type="submit" disabled={pwSaving || !curPw || !newPw || !cfmPw}
          className="mt-5 flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
        >
          {pwSaving
            ? <><div className="w-4 h-4 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin" /> Updating…</>
            : <><FiLock size={15} /> Update Password</>}
        </button>
      </form>
    </div>
  );
}
