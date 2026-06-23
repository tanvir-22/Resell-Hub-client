"use client";

import { useState, useRef } from "react";
import { useUser } from "@/components/dashboard/DashboardShell";
import { updateUser, changePassword } from "@/lib/auth-client";
import { FiCamera, FiSave, FiCheck, FiUser, FiLock, FiPhone, FiMapPin } from "react-icons/fi";
import { uploadImage } from "@/lib/api/upload";
import { Spinner } from "@heroui/react";

const inputCls = "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all";

export default function BuyerProfile() {
  const user = useUser();

  const [name, setName]         = useState(user?.name || "");
  const [phone, setPhone]       = useState(user?.phone || "");
  const [address, setAddress]   = useState(user?.address || "");
  const [profileImg, setProfileImg] = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState(user?.image || "");
  const [imgUploading, setImgUploading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState("");

  const [curPw, setCurPw]   = useState("");
  const [newPw, setNewPw]   = useState("");
  const [cfmPw, setCfmPw]   = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg]   = useState("");

  const fileRef = useRef(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }
    setProfileImg(URL.createObjectURL(file));
    setImgUploading(true);
    try {
      const url = await uploadImage(file);
      setProfileImgUrl(url);
    } catch { setError("Image upload failed"); }
    finally { setImgUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    const { error: err } = await updateUser({ name, image: profileImgUrl || undefined, phone });
    if (err) setError(err.message || "Update failed");
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!curPw) { setPwMsg("Please enter your current password."); return; }
    if (newPw.length < 8) { setPwMsg("New password must be at least 8 characters."); return; }
    if (newPw !== cfmPw) { setPwMsg("Passwords don't match."); return; }

    setPwSaving(true);
    setPwMsg("");

    const { error } = await changePassword({
      currentPassword: curPw,
      newPassword: newPw,
      revokeOtherSessions: false,
    });

    setPwSaving(false);

    if (error) {
      const msg = error.message || "";
      if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("incorrect")) {
        setPwMsg("Current password is incorrect.");
      } else if (msg.toLowerCase().includes("too short") || msg.toLowerCase().includes("minimum")) {
        setPwMsg("New password is too short.");
      } else {
        setPwMsg(error.message || "Failed to update password. Please try again.");
      }
      return;
    }

    setPwMsg("success");
    setCurPw("");
    setNewPw("");
    setCfmPw("");
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

      {/* Avatar section */}
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
              {imgUploading ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <FiCamera size={13} className="text-white" />}
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
        {error && <p className="text-red-600 dark:text-red-400 text-sm mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>}
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
          {saved ? <><FiCheck size={16} /> Saved!</> : saving ? "Saving..." : <><FiSave size={16} /> Save Changes</>}
        </button>
      </form>

      {/* Password change */}
      <form onSubmit={handlePasswordChange} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <FiLock size={17} className="text-emerald-500" /> Change Password
        </h2>
        {pwMsg && (
          <p className={`text-sm mb-4 p-3 rounded-xl ${pwMsg === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
            {pwMsg === "success" ? "Password updated successfully!" : pwMsg}
          </p>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
            <input type="password" value={curPw} onChange={e => { setCurPw(e.target.value); setPwMsg(""); }} placeholder="••••••••" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
            <input type="password" value={newPw} onChange={e => { setNewPw(e.target.value); setPwMsg(""); }} placeholder="Min. 8 characters" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
            <input type="password" value={cfmPw} onChange={e => { setCfmPw(e.target.value); setPwMsg(""); }} placeholder="••••••••" className={inputCls} />
          </div>
        </div>
        <button
          type="submit" disabled={pwSaving || !curPw || !newPw || !cfmPw}
          className="mt-5 flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
        >
          {pwSaving ? (
            <>
              <Spinner size="sm" classNames={{ circle1: "border-b-white dark:border-b-gray-900", circle2: "border-b-white/60 dark:border-b-gray-900/60" }} />
              Updating…
            </>
          ) : (
            <><FiLock size={15} /> Update Password</>
          )}
        </button>
      </form>
    </div>
  );
}
