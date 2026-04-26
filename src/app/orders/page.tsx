import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Package, ShoppingBag } from "lucide-react";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/orders");

  let orders: Array<{
    id: string; status: string; total: number; createdAt: Date;
    items: { id: string; qty: number; product: { title: string; images: string[] } }[];
  }> = [];

  try {
    orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { product: { select: { title: true, images: true } } } } },
      orderBy: { createdAt: "desc" },
    });
  } catch { /* DB not available */ }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted mb-8">Track and manage your orders</p>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--badge-bg)]">
              <ShoppingBag className="h-10 w-10 text-muted" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-sm text-muted mb-6">Start shopping to see your orders here!</p>
            <Link href="/products" className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}
                className="block rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 hover:border-primary/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-bold text-primary">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
