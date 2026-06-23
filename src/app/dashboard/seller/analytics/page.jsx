"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { FiDollarSign, FiShoppingBag, FiPackage, FiClock, FiTrendingUp } from "react-icons/fi";
import { getSellerAnalytics } from "@/lib/api/analytics";
import { useUser } from "@/components/dashboard/DashboardShell";

const SAMPLE_MONTHLY = [
  { month: "Jan", revenue: 0, orders: 0 },
  { month: "Feb", revenue: 0, orders: 0 },
  { month: "Mar", revenue: 0, orders: 0 },
  { month: "Apr", revenue: 0, orders: 0 },
  { month: "May", revenue: 0, orders: 0 },
  { month: "Jun", revenue: 0, orders: 0 },
];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`flex items-center gap-4 p-5 rounded-2xl ${color}`}>
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <p className="text-white text-2xl font-extrabold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</p>
      {payload.map(({ name, value, color }) => (
        <p key={name} style={{ color }} className="font-medium">
          {name === "revenue" ? `$${Number(value).toFixed(2)}` : value} {name}
        </p>
      ))}
    </div>
  );
};

export default function SellerAnalytics() {
  const user = useUser();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    getSellerAnalytics(user.id)
      .then(d => { setData(d); setLoading(false); });
  }, [user?.id]);

  const monthly    = data?.monthly?.length    ? data.monthly    : SAMPLE_MONTHLY;
  const topProducts = data?.topProducts?.length ? data.topProducts : [];
  const hasData    = data?.totalSales > 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Sales Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your store performance over time.</p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FiPackage}    label="Total Products"  value={data?.totalProducts  ?? 0} color="bg-gradient-to-br from-emerald-500 to-emerald-700" />
          <StatCard icon={FiShoppingBag} label="Total Sales"   value={data?.totalSales     ?? 0} color="bg-gradient-to-br from-blue-500   to-blue-700"   />
          <StatCard icon={FiDollarSign} label="Total Revenue"  value={`$${(data?.totalRevenue ?? 0).toFixed(2)}`} color="bg-gradient-to-br from-green-500  to-green-700"  />
          <StatCard icon={FiClock}      label="Pending Orders" value={data?.pendingOrders  ?? 0} color="bg-gradient-to-br from-amber-500  to-amber-700"  />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Monthly trend */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">Monthly Revenue</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg">
              <FiTrendingUp size={13} /> Revenue trend
            </div>
          </div>
          {!hasData && (
            <div className="text-center py-4 mb-2">
              <p className="text-xs text-gray-400 dark:text-gray-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-lg inline-block">
                No sales data yet — chart will populate as you complete orders
              </p>
            </div>
          )}
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2.5} fill="url(#revGrad)" name="revenue" />
              <Area type="monotone" dataKey="orders"  stroke="#3b82f6" strokeWidth={2}   fill="url(#ordGrad)"  name="orders"  />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top products */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-2">Top Products</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">By revenue earned</p>

          {loading ? (
            <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-10 rounded-xl bg-gray-100 dark:bg-slate-700 animate-pulse" />)}</div>
          ) : topProducts.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <FiShoppingBag size={32} className="text-gray-300 dark:text-slate-600 mb-3" />
              <p className="text-gray-400 dark:text-gray-500 text-sm">No sales data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => {
                const max = topProducts[0]?.revenue || 1;
                return (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-gray-400 dark:text-gray-500 flex-shrink-0">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">{p.name}</p>
                      <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${(p.revenue / max) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">${p.revenue.toFixed(0)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {topProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">Revenue Chart</h3>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={topProducts} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={n => n.slice(0, 8) + (n.length > 8 ? "…" : "")} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} name="revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
