import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import OrderStatusUpdater from "@/components/dashboard/OrderStatusUpdater";

export const metadata = { title: "Seller Orders" };

export default async function DashboardOrdersPage() {
  const session = await getServerSession(authOptions);
  let orders: Array<{
    id: string; status: string; total: number; address: string; createdAt: Date;
    user: { name: string; email: string };
    items: { id: string; qty: number; price: number; product: { title: string; sellerId: string } }[];
  }> = [];

  try {
    orders = await prisma.order.findMany({
      where: { items: { some: { product: { sellerId: session!.user.id } } } },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { title: true, sellerId: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch { /* DB not available */ }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Incoming Orders</h1>
        <p className="text-sm text-muted">{orders.length} orders containing your products</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
          <p className="text-muted">No orders yet. Promote your products!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString()} · {order.user.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-primary">{formatCurrency(order.total)}</p>
                  <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                </div>
              </div>
              <div className="space-y-2">
                {order.items.filter((i) => i.product.sellerId === session!.user.id).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.title} × {item.qty}</span>
                    <span className="font-medium">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
