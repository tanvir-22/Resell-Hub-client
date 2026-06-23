"use client";

import { useEffect, useState, useCallback } from "react";
import { FiSearch, FiTrash2, FiSlash, FiCheckCircle, FiUser, FiUsers, FiShield } from "react-icons/fi";
import { getAdminUsers, updateAdminUser, deleteAdminUser } from "@/lib/api/admin";

const ROLE_COLORS = {
  buyer:  "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  seller: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  admin:  "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
};

function Avatar({ user }) {
  const initials = user.name
    ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : user.email[0].toUpperCase();
  return user.image ? (
    <img src={user.image} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
  ) : (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      {initials}
    </div>
  );
}

function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <p className="text-gray-900 dark:text-white font-semibold mb-1">Are you sure?</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = useCallback((q = "") => {
    setLoading(true);
    getAdminUsers(q ? { search: q } : {})
      .then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(search), 350);
    return () => clearTimeout(t);
  }, [search, load]);

  const toggleBlock = async (u) => {
    const updated = await updateAdminUser(u._id, { blocked: !u.blocked });
    setUsers(prev => prev.map(x => x._id === u._id ? { ...x, blocked: updated.blocked } : x));
  };

  const deleteUser = async (id) => {
    await deleteAdminUser(id);
    setUsers(prev => prev.filter(u => u._id !== id));
    setConfirm(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View, search, block, and manage platform users.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total",   icon: FiUsers,      value: users.length,                               color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Active",  icon: FiCheckCircle,value: users.filter(u => !u.blocked).length,        color: "text-green-600  dark:text-green-400",  bg: "bg-green-50  dark:bg-green-900/20"  },
          { label: "Blocked", icon: FiSlash,       value: users.filter(u =>  u.blocked).length,        color: "text-red-600    dark:text-red-400",    bg: "bg-red-50    dark:bg-red-900/20"    },
        ].map(({ label, icon: Icon, value, color, bg }) => (
          <div key={label} className={`flex items-center gap-3 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800`}>
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-slate-700 animate-pulse" />)}</div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <FiUsers size={36} className="text-gray-300 dark:text-slate-600 mb-3" />
            <p className="text-gray-400 dark:text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["User", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar user={u} />
                        <span className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{u.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400 truncate max-w-[160px]">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] || ROLE_COLORS.buyer}`}>
                        {u.role === "admin" && <FiShield size={10} />}
                        {u.role || "buyer"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        u.blocked ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                      }`}>
                        {u.blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBlock(u)}
                          title={u.blocked ? "Unblock" : "Block"}
                          className={`p-2 rounded-lg transition-colors ${
                            u.blocked
                              ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                              : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          }`}
                        >
                          {u.blocked ? <FiCheckCircle size={16} /> : <FiSlash size={16} />}
                        </button>
                        <button
                          onClick={() => setConfirm({ id: u._id, name: u.name || u.email })}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirm && (
        <ConfirmModal
          msg={`This will permanently delete "${confirm.name}" and all their sessions.`}
          onConfirm={() => deleteUser(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
