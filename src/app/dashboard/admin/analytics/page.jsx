"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { FiTrendingUp, FiUsers, FiShoppingBag, FiTag } from "react-icons/fi";
import { getAdminAnalytics } from "@/lib/api/analytics";

const PIE_COLORS = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const EMPTY_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun"].map(m => ({ month: m, users: 0, orders: 0, revenue: 0 }));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-3 shadow-xl text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</p>
      {payload.map(({ name, value, color }) => (
        <p key={name} style={{ color }} className="font-medium">
          {name === "revenue" ? `$${Number(value).toFixed(0)}` : value} {name}
        </p>
      ))}
    </div>
  );
};

const CustomPieTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-300">{name}</p>
      <p className="text-violet-600 dark:text-violet-400 font-bold">${Number(value).toFixed(0)} revenue</p>
    </div>
  );
};

function ChartCard({ title, sub, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
      <h2 className="font-bold text-gray-900 dark:text-white">{title}</h2>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 mb-4">{sub}</p>}
      {children}
    </div>
  );
}

export default function AdminAnalytics() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then(d => { setData(d); setLoading(false); });
  }, []);

  const userGrowth    = data?.userGrowth?.length    ? data.userGrowth    : EMPTY_MONTHS;
  const monthlyOrders = data?.monthlyOrders?.length  ? data.monthlyOrders : EMPTY_MONTHS;
  const catPerf       = data?.categoryPerformance?.length ? data.categoryPerformance : [];
  const topCats       = data?.topCategories?.length   ? data.topCategories  : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Platform Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Business insights across users, products, and orders.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-72 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 1 — User Growth */}
          <ChartCard title="User Growth" sub="New user registrations per month (last 6 months)">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={userGrowth} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2.5} fill="url(#ugGrad)" name="users" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 2 — Monthly Orders */}
          <ChartCard title="Monthly Orders & Revenue" sub="Order volume and revenue last 6 months">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyOrders} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="moRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="orders"  stroke="#7c3aed" strokeWidth={2}   fill="url(#moGrad)" name="orders" />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2}   fill="url(#moRev)"  name="revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 3 — Category Performance */}
          <ChartCard title="Category Performance" sub="Product listing count per category">
            {catPerf.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <FiTag size={28} className="text-gray-300 dark:text-slate-600 mb-2" />
                <p className="text-gray-400 dark:text-gray-500 text-sm">No products listed yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={catPerf} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={n => n.length > 8 ? n.slice(0,8)+"…" : n} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} name="products" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* 4 — Top Categories by Revenue */}
          <ChartCard title="Top Categories by Revenue" sub="Revenue breakdown from delivered orders">
            {topCats.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <FiShoppingBag size={28} className="text-gray-300 dark:text-slate-600 mb-2" />
                <p className="text-gray-400 dark:text-gray-500 text-sm">No revenue data yet</p>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={200}>
                  <PieChart>
                    <Pie data={topCats} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={85} paddingAngle={3}>
                      {topCats.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomPieTip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {topCats.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-xs text-gray-700 dark:text-gray-300 flex-1 truncate">{c.name}</span>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">${c.revenue.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChartCard>
        </div>
      )}
    </div>
  );
}
