import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import { Package, ShoppingCart, DollarSign, TrendingUp, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Seller Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  let stats = { products: 0, orders: 0, revenue: 0, views: 0 };
  let recentOrders: Array<{
    id: string; status: string; total: number; createdAt: Date;
    user: { name: string }; items: { product: { title: string } }[];
  }> = [];

  try {
    const [productCount, sellerOrders] = await Promise.all([
      prisma.product.count({ where: { sellerId: session!.user.id } }),
      prisma.order.findMany({
        where: { items: { some: { product: { sellerId: session!.user.id } } } },
        include: { user: { select: { name: true } }, items: { include: { product: { select: { title: true, sellerId: true } } } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    stats.products = productCount;
    stats.orders = sellerOrders.length;
    stats.revenue = sellerOrders.reduce((sum, o) => {
      const sellerItems = o.items.filter((i) => i.product.sellerId === session!.user.id);
      return sum + sellerItems.reduce((s, i) => s + i.price * i.qty, 0);
    }, 0);
    recentOrders = sellerOrders.slice(0, 5);
  } catch { /* DB not available */ }

  const STATS = [
    { label: "Total Revenue", value: formatCurrency(stats.revenue), icon: DollarSign, trend: "+12.4%", color: "from-green-500/20 to-emerald-500/20" },
    { label: "Active Orders", value: stats.orders.toString(), icon: ShoppingCart, trend: "+3", color: "from-blue-500/20 to-indigo-500/20" },
    { label: "Total Products", value: stats.products.toString(), icon: Package, trend: formatCompactNumber(stats.products), color: "from-purple-500/20 to-violet-500/20" },
    { label: "Conversion Rate", value: "3.82%", icon: TrendingUp, trend: "+0.5%", color: "from-amber-500/20 to-orange-500/20" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Performance Canvas</h1>
        <p className="text-muted">An editorial overview of your boutique metrics, seasonal curations, and fulfillment velocity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">{stat.label}</span>
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <div className="flex items-center gap-1 text-xs text-success font-medium">
                <ArrowUpRight className="h-3 w-3" />
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart placeholder + Campaign card */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Curation Analytics</h2>
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">2024</span>
            </div>
          </div>
          {/* Simple bar chart */}
          <div className="flex items-end gap-3 h-48">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => {
              const heights = [60, 45, 75, 55, 80, 90, 70, 85, 65, 95, 50, 40];
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-light transition-all hover:opacity-80"
                    style={{ height: `${heights[i]}%` }} />
                  <span className="text-[10px] text-muted">{month.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaign Card */}
        <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Spotlight</span>
          </div>
          <h3 className="text-lg font-bold mb-2">New Seasonal Campaign</h3>
          <p className="text-sm text-muted mb-6">Your AI-curated collection strategy is ready. Review top-performing items and launch your next campaign.</p>
          <button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors w-full">
            Explore Strategy →
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Recent Curation Flow</h2>
          <Link href="/dashboard/orders" className="text-sm text-primary hover:underline">View All Orders →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">No orders yet. Start selling!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted py-3">Type</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted py-3">Customer</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted py-3">Total</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--badge-bg)] transition-colors">
                    <td className="py-3 text-sm">{order.items[0]?.product.title || "Order"}</td>
                    <td className="py-3 text-sm">{order.user.name}</td>
                    <td className="py-3 text-sm font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
