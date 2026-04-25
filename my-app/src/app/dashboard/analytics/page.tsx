import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, BarChart3, Users, ShoppingBag } from "lucide-react";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  let totalRevenue = 0;
  let totalOrders = 0;
  let totalProducts = 0;
  let monthlySales: number[] = new Array(12).fill(0);

  try {
    const [products, orders] = await Promise.all([
      prisma.product.count({ where: { sellerId: session!.user.id } }),
      prisma.order.findMany({
        where: { items: { some: { product: { sellerId: session!.user.id } } } },
        include: { items: { include: { product: { select: { sellerId: true } } } } },
      }),
    ]);
    totalProducts = products;
    totalOrders = orders.length;
    orders.forEach((order) => {
      const sellerTotal = order.items
        .filter((i) => i.product.sellerId === session!.user.id)
        .reduce((s, i) => s + i.price * i.qty, 0);
      totalRevenue += sellerTotal;
      const month = new Date(order.createdAt).getMonth();
      monthlySales[month] += sellerTotal;
    });
  } catch { /* DB not available */ }

  const maxSale = Math.max(...monthlySales, 1);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted">Track your store performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Revenue</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Orders</span>
          </div>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Products</span>
          </div>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </div>
      </div>

      {/* Monthly Sales Chart */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Monthly Revenue</h2>
        </div>
        <div className="flex items-end gap-3 h-56">
          {MONTHS.map((month, i) => {
            const heightPercent = maxSale > 0 ? (monthlySales[i] / maxSale) * 100 : 0;
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-muted font-medium">{monthlySales[i] > 0 ? formatCurrency(monthlySales[i]) : ""}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-light transition-all hover:opacity-80 min-h-[4px]"
                  style={{ height: `${Math.max(heightPercent, 2)}%` }}
                />
                <span className="text-[10px] text-muted">{month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
