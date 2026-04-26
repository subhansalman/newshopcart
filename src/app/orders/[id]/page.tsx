import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { MapPin, CheckCircle2 } from "lucide-react";
import Footer from "@/components/layout/Footer";

const STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

interface OrderDetailProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  let order;
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
  } catch { /* DB not available */ }

  if (!order || order.userId !== session.user.id) notFound();

  const currentIndex = STATUSES.indexOf(order.status);

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">Order #{order.id.slice(-8).toUpperCase()}</h1>
        <p className="text-muted mb-8">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        {/* Status Tracker */}
        {order.status !== "CANCELLED" && (
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 mb-8">
            <h2 className="text-sm font-semibold mb-6">Order Status</h2>
            <div className="flex items-center justify-between">
              {STATUSES.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-2 flex-1">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    i <= currentIndex ? "border-primary bg-primary text-white" : "border-[var(--card-border)] text-muted"
                  }`}>
                    {i <= currentIndex ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <span className={`text-[10px] font-medium ${i <= currentIndex ? "text-primary" : "text-muted"}`}>{s}</span>
                  {i < STATUSES.length - 1 && (
                    <div className={`hidden sm:block absolute h-0.5 w-full ${i < currentIndex ? "bg-primary" : "bg-[var(--card-border)]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 mb-8">
          <h2 className="text-sm font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--surface)]">
                  <Image src={item.product.images[0] || "https://picsum.photos/200"} alt={item.product.title} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 flex justify-between">
                  <div>
                    <p className="text-sm font-semibold">{item.product.title}</p>
                    <p className="text-xs text-muted">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-primary">{formatCurrency(item.price * item.qty)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address + Total */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address</h2>
            <p className="text-sm text-muted">{order.address}</p>
          </div>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="text-sm font-semibold mb-3">Payment Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>{formatCurrency(order.total)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">Shipping</span><span className="text-success">Free</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-[var(--card-border)]">
                <span>Total</span><span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
