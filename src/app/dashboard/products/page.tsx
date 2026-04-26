import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { Plus, Edit, Eye } from "lucide-react";

export const metadata = { title: "My Products" };

export default async function DashboardProductsPage() {
  const session = await getServerSession(authOptions);
  let products: Array<{
    id: string; title: string; price: number; stock: number; isActive: boolean;
    images: string[]; category: { name: string }; _count: { orderItems: number };
  }> = [];

  try {
    products = await prisma.product.findMany({
      where: { sellerId: session!.user.id },
      include: { category: true, _count: { select: { orderItems: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch { /* DB not available */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-sm text-muted">{products.length} products in your portfolio</p>
        </div>
        <Link href="/products/create"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
          <p className="text-muted mb-4">No products yet. Create your first listing!</p>
          <Link href="/products/create" className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white">Create Product</Link>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--card-border)] bg-[var(--badge-bg)]">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-6 py-3">Product</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-6 py-3">Category</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-6 py-3">Price</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-6 py-3">Stock</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-6 py-3">Sales</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--badge-bg)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)]">
                        <Image src={product.images[0] || "https://picsum.photos/100"} alt={product.title} fill className="object-cover" sizes="40px" />
                      </div>
                      <span className="text-sm font-medium truncate max-w-[200px]">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{product.category.name}</td>
                  <td className="px-6 py-4 text-sm font-medium">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 text-sm">{product.stock}</td>
                  <td className="px-6 py-4 text-sm">{product._count.orderItems}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.isActive ? "bg-success/20 text-success" : "bg-danger/20 text-danger"}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/products/${product.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[var(--badge-bg)]">
                        <Eye className="h-4 w-4 text-muted" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
