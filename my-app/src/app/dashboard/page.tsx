import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import { 
  Package, ShoppingCart, DollarSign, TrendingUp, Sparkles, ArrowUpRight,
  Download, Calendar, Users, Zap, MoreVertical
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard | ShopCart" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Dummy data for stats to match the design EXACTLY, in a real app this would be fetched
  const adminStats = {
    revenue: 142850.00,
    orders: 1284,
    products: 452,
    customers: 8921
  };

  const sellerStats = {
    revenue: 142850.00,
    conversion: 3.82,
    flows: 24
  };

  if (session?.user?.role === "ADMIN") {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1">Curation Overview</h1>
            <p className="text-muted">Welcome back, Curator. Here is your shop performance at a glance.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white">
              <Calendar className="h-4 w-4 text-muted" />
              <span>Oct 12 - Oct 19, 2024</span>
            </div>
            <button className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 rounded-lg px-4 py-2.5 text-sm font-medium">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Total Revenue</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                +12.4%
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">${adminStats.revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
            <p className="text-xs text-muted">from $127K last month</p>
          </div>

          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Active Orders</span>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold mb-1">{adminStats.orders.toLocaleString()}</p>
            <p className="text-xs text-muted">24 orders pending curation</p>
          </div>

          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Total Products</span>
              <Package className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold mb-1">{adminStats.products}</p>
            <p className="text-xs text-muted">12 new arrivals this week</p>
          </div>

          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Total Customers</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                +5.2%
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{adminStats.customers.toLocaleString()}</p>
            <p className="text-xs text-muted">Active membership growth</p>
          </div>
        </div>

        {/* Charts and Insights */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Analytics Chart (~60%) */}
          <div className="lg:col-span-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-white">Sales Analytics</h2>
              <div className="flex items-center gap-2 text-xs font-medium text-muted">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                MONTHLY YIELD
              </div>
            </div>
            
            <div className="flex items-end justify-between h-56 gap-2">
              {/* Dummy chart data to match design */}
              {[
                { m: 'JAN', h: 45 }, { m: 'FEB', h: 55 }, { m: 'MAR', h: 45 },
                { m: 'APR', h: 65 }, { m: 'MAY', h: 80 }, { m: 'JUN', h: 100, active: true },
                { m: 'JUL', h: 60 }, { m: 'AUG', h: 40 }, { m: 'SEP', h: 70 }, { m: 'OCT', h: 65 }
              ].map((col) => (
                <div key={col.m} className="flex flex-col items-center flex-1 gap-3">
                  <div className="w-full relative h-full flex items-end justify-center group">
                    <div 
                      className={`w-full max-w-[40px] rounded-t-md transition-all ${col.active ? 'bg-primary' : 'bg-primary/30 group-hover:bg-primary/50'}`} 
                      style={{ height: `${col.h}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-medium text-muted">{col.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curator Insights (~40%) */}
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary-dark p-6 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Zap className="h-24 w-24 text-white" />
            </div>
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Curator Insights</h3>
              </div>
              
              <p className="text-sm text-white/90 leading-relaxed mb-6">
                Our AI models suggest a 15% increase in high-end leather accessories for the 'Atelier' collection next week. Demand is peaking in the European market.
              </p>

              <div className="space-y-3 mb-6">
                <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-1">Recommendation</span>
                  <p className="text-xs text-white">Boost 'Obsidian Tote' visibility on homepage.</p>
                </div>
                <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-1">Stock Alert</span>
                  <p className="text-xs text-white">Linen shirts running low in Size M.</p>
                </div>
              </div>
            </div>

            <button className="relative z-10 w-full rounded-lg bg-white px-4 py-3 text-sm font-bold text-primary hover:bg-white/90 transition-colors shadow-lg shadow-black/10">
              Execute All Suggestions
            </button>
          </div>
        </div>

        {/* Recent Curation Flow */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Curation Flow</h2>
            <Link href="/dashboard/orders" className="text-sm font-medium text-primary hover:text-primary-light transition-colors">
              View All Orders →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left font-semibold text-muted py-4 px-2 uppercase tracking-wider text-xs">Order ID</th>
                  <th className="text-left font-semibold text-muted py-4 px-2 uppercase tracking-wider text-xs">Customer</th>
                  <th className="text-left font-semibold text-muted py-4 px-2 uppercase tracking-wider text-xs">Collection</th>
                  <th className="text-left font-semibold text-muted py-4 px-2 uppercase tracking-wider text-xs">Value</th>
                  <th className="text-left font-semibold text-muted py-4 px-2 uppercase tracking-wider text-xs">Status</th>
                  <th className="text-right font-semibold text-muted py-4 px-2 uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "#SC-9042", user: "Elena Rodriguez", coll: "Atelier Winter '24", val: 2450.00, status: "SHIPPED", sColor: "text-success bg-success/10" },
                  { id: "#SC-9043", user: "Julian Thorne", coll: "Minimalist Edit", val: 1120.00, status: "PENDING", sColor: "text-warning bg-warning/10" },
                  { id: "#SC-9044", user: "Aiko Tanaka", coll: "Collections Primary", val: 5900.00, status: "PROCESSING", sColor: "text-accent bg-accent/10" },
                ].map((row) => (
                  <tr key={row.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2 font-medium text-white/70">{row.id}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[var(--surface-dark)] border border-[var(--card-border)] flex items-center justify-center text-xs font-bold text-white">
                          {row.user.charAt(0)}
                        </div>
                        <span className="font-medium text-white">{row.user}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-white/70">{row.coll}</td>
                    <td className="py-4 px-2 font-medium text-white">${row.val.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                    <td className="py-4 px-2">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold tracking-wider ${row.sColor}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-muted transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Performance Canvas</h1>
        <p className="text-muted text-sm max-w-2xl">An editorial overview of your boutique's metrics, seasonal curations, and fulfillment velocity.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Live Pulse</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Revenue Growth</span>
            <p className="text-4xl font-bold text-white mb-2">${sellerStats.revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
            <div className="flex items-center gap-1 text-xs font-medium text-success">
              <ArrowUpRight className="h-3 w-3" />
              12.4% from last period
            </div>
          </div>
        </div>

        {/* Click Through / Conversion */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Conversion</span>
          <p className="text-3xl font-bold text-white mb-6">{sellerStats.conversion}%</p>
          <div className="h-2 w-full bg-[var(--surface-dark)] rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-[38%]"></div>
          </div>
        </div>

        {/* Active Curation */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Active Curation</span>
          <p className="text-3xl font-bold text-white mb-4">{sellerStats.flows} Flows</p>
          <div className="flex -space-x-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-10 w-10 rounded-full border-2 border-[var(--card-bg)] bg-[var(--surface-dark)] flex items-center justify-center text-xs font-bold text-white shadow-sm z-[1]">
                C{i}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Chart & Spotlight */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-white">Curation Analytics</h2>
            <div className="flex bg-[var(--surface-dark)] rounded-lg p-1">
              <button className="px-4 py-1 text-xs font-medium text-white bg-primary rounded-md shadow-sm">7D</button>
              <button className="px-4 py-1 text-xs font-medium text-muted hover:text-white transition-colors">30D</button>
            </div>
          </div>
          <div className="flex items-end justify-between h-48 gap-3">
             {/* Dummy chart data to match design */}
             {[
                { m: 'MON', h: 45 }, { m: 'TUE', h: 60 }, { m: 'WED', h: 100, active: true },
                { m: 'THU', h: 75 }, { m: 'FRI', h: 55 }, { m: 'SAT', h: 65 }, { m: 'SUN', h: 60 }
              ].map((col) => (
                <div key={col.m} className="flex flex-col items-center flex-1 gap-3">
                  <div className="w-full relative h-full flex items-end justify-center group">
                    <div 
                      className={`w-full max-w-[48px] rounded-t-md transition-all ${col.active ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary/40'}`} 
                      style={{ height: `${col.h}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-muted">{col.m}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Spotlight Card */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface-dark)] overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800')] bg-cover bg-center mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
          
          <div className="relative z-20 h-full p-6 flex flex-col justify-end">
            <span className="inline-flex rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-3 w-fit backdrop-blur-md">
              Spotlight
            </span>
            <h3 className="text-xl font-bold text-white mb-2">New Seasonal Campaign</h3>
            <p className="text-xs text-white/80 mb-6 leading-relaxed">
              Your A-I white curation is outperforming projections by 25%. Review the heatmaps to optimize placement.
            </p>
            <Link href="#" className="text-sm font-semibold text-primary hover:text-white transition-colors flex items-center gap-1">
              Explore Strategy <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Curation Flow Table */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Curation Flow</h2>
            <p className="text-xs text-muted">Live updates of incoming artisan inventory.</p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search curations..." 
              className="pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-white focus:border-primary focus:ring-0 outline-none w-full sm:w-64"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="text-left font-semibold text-muted py-4 px-2 uppercase tracking-wider text-[10px]">Item</th>
                <th className="text-left font-semibold text-muted py-4 px-2 uppercase tracking-wider text-[10px]">Category</th>
                <th className="text-left font-semibold text-muted py-4 px-2 uppercase tracking-wider text-[10px]">Status</th>
                <th className="text-left font-semibold text-muted py-4 px-2 uppercase tracking-wider text-[10px]">Impact</th>
                <th className="text-left font-semibold text-muted py-4 px-2 uppercase tracking-wider text-[10px]">Value</th>
                <th className="text-right font-semibold text-muted py-4 px-2 uppercase tracking-wider text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Artisan Wool Coat", cat: "Outerwear", status: "ACTIVE", sColor: "text-success", impact: "High", val: 890.00 },
                { name: "Hand-Thrown Vessel", cat: "Home", status: "PREOP", sColor: "text-warning", impact: "Medium", val: 245.00 },
                { name: "Chronos Watch v1", cat: "Accessories", status: "ACTIVE", sColor: "text-success", impact: "Extreme", val: 1280.00 },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[var(--card-border)] last:border-0 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[var(--surface-dark)] border border-[var(--card-border)] overflow-hidden">
                         <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=100&q=80`} alt={row.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="font-semibold text-white">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-white/70">{row.cat}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${row.sColor.replace('text', 'bg')}`}></div>
                      <span className={`text-[10px] font-bold tracking-wider ${row.sColor}`}>{row.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-white/70">{row.impact}</td>
                  <td className="py-4 px-2 font-bold text-white">${row.val.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                  <td className="py-4 px-2 text-right">
                    <button className="p-1.5 hover:bg-white/10 rounded-md text-muted transition-colors inline-flex">
                      <MoreVertical className="h-4 w-4" />
                    </button>
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
