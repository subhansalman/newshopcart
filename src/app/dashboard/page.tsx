import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import {
  Package, ShoppingCart, DollarSign, TrendingUp, Sparkles,
  ArrowUpRight, Download, Calendar, Users, Zap, MoreVertical,
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard | ShopCart" };

export default async function DashboardPage() {
  const adminStats = { revenue: 142850.0, orders: 1284, products: 452, customers: 8921 };
  const sellerStats = { revenue: 142850.0, conversion: 3.82, flows: 24 };

  if (true) {
    return (
      <div className="animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Curation Overview</h1>
            <p className="text-muted text-sm">Welcome back, Curator. Here is your shop performance at a glance.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 premium-card px-4 py-2.5 text-sm !rounded-xl">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-[var(--foreground)]/80">Oct 12 - Oct 19, 2024</span>
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl px-5 py-2.5 text-sm font-medium btn-premium shadow-lg shadow-primary/20">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 stagger-children">
          {[
            { label: "Total Revenue", value: `$${adminStats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, sub: "from $127K last month", badge: "+12.4%", badgeColor: "text-success bg-success/10", icon: DollarSign },
            { label: "Active Orders", value: adminStats.orders.toLocaleString(), sub: "24 orders pending curation", icon: ShoppingCart },
            { label: "Total Products", value: adminStats.products.toString(), sub: "12 new arrivals this week", icon: Package },
            { label: "Total Customers", value: adminStats.customers.toLocaleString(), sub: "Active membership growth", badge: "+5.2%", badgeColor: "text-primary bg-primary/10", icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="stat-card group">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">{stat.label}</span>
                {stat.badge ? (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${stat.badgeColor}`}>
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.badge}
                  </span>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold mb-1.5 animate-count-up">{stat.value}</p>
              <p className="text-xs text-muted">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts and Insights */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Sales Analytics */}
          <div className="lg:col-span-2 premium-card p-6 !rounded-2xl">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-lg font-bold">Sales Analytics</h2>
              <div className="flex items-center gap-2 text-xs font-medium text-muted">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                MONTHLY YIELD
              </div>
            </div>
            <div className="flex items-end justify-between h-56 gap-2">
              {[
                { m: "JAN", h: 45 }, { m: "FEB", h: 55 }, { m: "MAR", h: 45 },
                { m: "APR", h: 65 }, { m: "MAY", h: 80 }, { m: "JUN", h: 100, active: true },
                { m: "JUL", h: 60 }, { m: "AUG", h: 40 }, { m: "SEP", h: 70 }, { m: "OCT", h: 65 },
              ].map((col, i) => (
                <div key={col.m} className="flex flex-col items-center flex-1 gap-2">
                  <div
                    className={`chart-bar w-full max-w-[40px] rounded-t-lg transition-all cursor-pointer ${col.active ? "bg-gradient-to-t from-primary to-primary-light shadow-lg shadow-primary/20" : "bg-primary/30 group-hover:bg-primary/50"}`}
                    style={{ height: `${Math.round((col.h / 100) * 176)}px`, animationDelay: `${i * 80}ms` }}
                  />
                  <span className="text-[10px] font-bold text-muted tracking-wider">{col.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curator Insights */}
          <div className="insight-card rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-[#3B35A0] p-6 flex flex-col overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="h-28 w-28 text-white" />
            </div>
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/10">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Curator Insights</h3>
              </div>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                Our AI models suggest a 15% increase in high-end leather accessories for the &apos;Atelier&apos; collection next week.
              </p>
              <div className="space-y-3 mb-6">
                <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-sm border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 block mb-1">Recommendation</span>
                  <p className="text-xs text-white/90">Boost &apos;Obsidian Tote&apos; visibility on homepage.</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-sm border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 block mb-1">Stock Alert</span>
                  <p className="text-xs text-white/90">Linen shirts running low in Size M.</p>
                </div>
              </div>
            </div>
            <button className="relative z-10 w-full rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-primary hover:bg-white/95 transition-all shadow-xl shadow-black/10">
              Execute All Suggestions
            </button>
          </div>
        </div>

        {/* Recent Curation Flow */}
        <div className="premium-card p-6 !rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Recent Curation Flow</h2>
            <Link href="/dashboard/orders" className="text-sm font-medium text-primary hover:text-primary-light transition-colors flex items-center gap-1 group">
              View All Orders
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="premium-table w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  {["Order ID", "Customer", "Collection", "Value", "Status", "Actions"].map((h, i) => (
                    <th key={h} className={`${i === 5 ? "text-right" : "text-left"} font-bold text-muted py-4 px-3 uppercase tracking-[0.12em] text-[10px]`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "#SC-9042", user: "Elena Rodriguez", coll: "Atelier Winter '24", val: 2450.0, status: "SHIPPED", sColor: "text-success bg-success/10 border border-success/20" },
                  { id: "#SC-9043", user: "Julian Thorne", coll: "Minimalist Edit", val: 1120.0, status: "PENDING", sColor: "text-warning bg-warning/10 border border-warning/20" },
                  { id: "#SC-9044", user: "Aiko Tanaka", coll: "Collections Primary", val: 5900.0, status: "PROCESSING", sColor: "text-accent bg-accent/10 border border-accent/20" },
                ].map((row) => (
                  <tr key={row.id} className="border-b border-[var(--card-border)] last:border-0">
                    <td className="py-4 px-3 font-mono text-xs text-muted">{row.id}</td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary-light/10 border border-[var(--card-border)] flex items-center justify-center text-xs font-bold text-primary">
                          {row.user.charAt(0)}
                        </div>
                        <span className="font-medium">{row.user}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-muted">{row.coll}</td>
                    <td className="py-4 px-3 font-bold">${row.val.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 px-3">
                      <span className={`inline-flex rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wider ${row.sColor}`}>{row.status}</span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <button className="p-2 hover:bg-[var(--surface-dark)] rounded-xl text-muted transition-colors"><MoreVertical className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Seller Dashboard
  return (
    <div className="animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Performance Canvas</h1>
        <p className="text-muted text-sm max-w-2xl">An editorial overview of your boutique&apos;s metrics, seasonal curations, and fulfillment velocity.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 stagger-children">
        <div className="stat-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">Live Pulse</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted block mb-1">Revenue Growth</span>
            <p className="text-4xl font-bold mb-2 animate-count-up">${sellerStats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            <div className="flex items-center gap-1 text-xs font-medium text-success">
              <ArrowUpRight className="h-3 w-3" />
              12.4% from last period
            </div>
          </div>
        </div>

        <div className="stat-card flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted block mb-1">Conversion</span>
          <p className="text-3xl font-bold mb-6">{sellerStats.conversion}%</p>
          <div className="h-2.5 w-full bg-[var(--surface-dark)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full w-[38%] transition-all" />
          </div>
        </div>

        <div className="stat-card flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted block mb-1">Active Curation</span>
          <p className="text-3xl font-bold mb-4">{sellerStats.flows} Flows</p>
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-10 rounded-full border-2 border-[var(--card-bg)] bg-gradient-to-br from-primary/30 to-primary-light/20 flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                C{i}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics & Spotlight */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 premium-card p-6 !rounded-2xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-lg font-bold">Curation Analytics</h2>
            <div className="flex bg-[var(--surface-dark)] rounded-xl p-1 border border-[var(--card-border)]">
              <button className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg shadow-sm">7D</button>
              <button className="px-4 py-1.5 text-xs font-bold text-muted hover:text-[var(--foreground)] transition-colors">30D</button>
            </div>
          </div>
          <div className="flex items-end justify-between h-48 gap-3">
            {[
              { m: "MON", h: 45 }, { m: "TUE", h: 60 }, { m: "WED", h: 100, active: true },
              { m: "THU", h: 75 }, { m: "FRI", h: 55 }, { m: "SAT", h: 65 }, { m: "SUN", h: 60 },
            ].map((col, i) => (
              <div key={col.m} className="flex flex-col items-center flex-1 gap-2">
                <div
                  className={`chart-bar w-full max-w-[48px] rounded-t-lg cursor-pointer transition-all ${col.active ? "bg-gradient-to-t from-primary to-primary-light shadow-lg shadow-primary/20" : "bg-primary/30 group-hover:bg-primary/50"}`}
                  style={{ height: `${Math.round((col.h / 100) * 152)}px`, animationDelay: `${i * 100}ms` }}
                />
                <span className="text-[10px] font-bold text-muted tracking-wider">{col.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spotlight */}
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--surface-dark)] overflow-hidden relative group min-h-[280px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800')] bg-cover bg-center mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
          <div className="relative z-20 h-full p-6 flex flex-col justify-end">
            <span className="inline-flex rounded-lg bg-primary/90 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider mb-3 w-fit backdrop-blur-md">
              Spotlight
            </span>
            <h3 className="text-xl font-bold text-white mb-2">New Seasonal Campaign</h3>
            <p className="text-xs text-white/70 mb-6 leading-relaxed">Your AI curation is outperforming projections by 25%.</p>
            <Link href="#" className="text-sm font-semibold text-primary hover:text-white transition-colors flex items-center gap-1 group/link">
              Explore Strategy <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Curation Flow Table */}
      <div className="premium-card p-6 !rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold">Recent Curation Flow</h2>
            <p className="text-xs text-muted mt-1">Live updates of incoming artisan inventory.</p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input type="text" placeholder="Search curations..." className="pl-10 pr-4 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:border-primary focus:ring-0 outline-none w-full sm:w-64 transition-all" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="premium-table w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                {["Item", "Category", "Status", "Impact", "Value", "Action"].map((h, i) => (
                  <th key={h} className={`${i === 5 ? "text-right" : "text-left"} font-bold text-muted py-4 px-3 uppercase tracking-[0.12em] text-[10px]`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Artisan Wool Coat", cat: "Outerwear", status: "ACTIVE", sColor: "text-success", impact: "High", val: 890.0 },
                { name: "Hand-Thrown Vessel", cat: "Home", status: "PREOP", sColor: "text-warning", impact: "Medium", val: 245.0 },
                { name: "Chronos Watch v1", cat: "Accessories", status: "ACTIVE", sColor: "text-success", impact: "Extreme", val: 1280.0 },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[var(--card-border)] last:border-0">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--surface-dark)] to-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden flex items-center justify-center text-xs font-bold text-primary">
                        {row.name.charAt(0)}
                      </div>
                      <span className="font-semibold">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-muted">{row.cat}</td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${row.sColor.replace("text", "bg")} shadow-sm`} />
                      <span className={`text-[10px] font-bold tracking-wider ${row.sColor}`}>{row.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-muted">{row.impact}</td>
                  <td className="py-4 px-3 font-bold">${row.val.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  <td className="py-4 px-3 text-right">
                    <button className="p-2 hover:bg-[var(--surface-dark)] rounded-xl text-muted transition-colors"><MoreVertical className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
