import Link from "next/link";
import Image from "next/image";
import { Star, SlidersHorizontal, Search, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Footer from "@/components/layout/Footer";
import ProductSearchFilters from "@/components/products/ProductSearchFilters";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    sort?: string;
  }>;
}

export const metadata = {
  title: "Products",
  description: "Browse our curated collection of products across all categories.",
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const perPage = 12;
  const skip = (page - 1) * perPage;

  let categories: { id: string; name: string; slug: string; _count: { products: number } }[] = [];
  let products: Array<{
    id: string;
    title: string;
    price: number;
    images: string[];
    stock: number;
    category: { name: string };
    reviews: { rating: number }[];
    createdAt: Date;
  }> = [];
  let totalProducts = 0;

  try {
    const where: Record<string, unknown> = { isActive: true };

    if (params.q) {
      where.title = { contains: params.q, mode: "insensitive" };
    }
    if (params.category) {
      where.category = { name: params.category };
    }
    if (params.minPrice || params.maxPrice) {
      where.price = {};
      if (params.minPrice) (where.price as Record<string, number>).gte = parseFloat(params.minPrice);
      if (params.maxPrice) (where.price as Record<string, number>).lte = parseFloat(params.maxPrice);
    }

    const orderBy: Record<string, string> = {};
    switch (params.sort) {
      case "price_asc": orderBy.price = "asc"; break;
      case "price_desc": orderBy.price = "desc"; break;
      case "newest": orderBy.createdAt = "desc"; break;
      default: orderBy.createdAt = "desc";
    }

    [products, totalProducts, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, reviews: { select: { rating: true } } },
        orderBy,
        skip,
        take: perPage,
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      }),
    ]);
  } catch {
    // DB not available - show empty state
  }

  const totalPages = Math.ceil(totalProducts / perPage);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {params.category ? params.category : "All Products"}
          </h1>
          <p className="text-muted">
            {params.q
              ? `Search results for "${params.q}"`
              : `Explore our curated collection of ${totalProducts} products`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <ProductSearchFilters
              categories={categories.map((c) => ({
                name: c.name,
                count: c._count.products,
              }))}
              currentCategory={params.category}
              currentSort={params.sort}
              currentQ={params.q}
              currentMinPrice={params.minPrice}
              currentMaxPrice={params.maxPrice}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Active filters */}
            {(params.q || params.category || params.minPrice || params.maxPrice) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted">Active filters:</span>
                {params.q && (
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...(params.category ? { category: params.category } : {}),
                    }).toString()}`}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    &ldquo;{params.q}&rdquo;
                    <X className="h-3 w-3" />
                  </Link>
                )}
                {params.category && (
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...(params.q ? { q: params.q } : {}),
                    }).toString()}`}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {params.category}
                    <X className="h-3 w-3" />
                  </Link>
                )}
                <Link
                  href="/products"
                  className="text-xs text-danger hover:underline ml-2"
                >
                  Clear all
                </Link>
              </div>
            )}

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--badge-bg)]">
                  <Search className="h-8 w-8 text-muted" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-sm text-muted mb-6 max-w-sm">
                  Try adjusting your search or filter criteria to find what you&apos;re looking for.
                </p>
                <Link
                  href="/products"
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                >
                  View All Products
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const avgRating =
                      product.reviews.length > 0
                        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                        : 0;
                    return (
                      <Link key={product.id} href={`/products/${product.id}`} className="group">
                        <div className="product-card rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
                          <div className="relative aspect-square overflow-hidden bg-[var(--surface)]">
                            <Image
                              src={product.images[0] || "https://picsum.photos/400"}
                              alt={product.title}
                              fill
                              className="product-image object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            {product.stock <= 0 && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <span className="rounded-full bg-danger px-3 py-1 text-xs font-bold text-white">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                              {product.category.name}
                            </p>
                            <h3 className="text-sm font-semibold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {product.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-bold text-primary">
                                {formatCurrency(product.price)}
                              </p>
                              {avgRating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                                  <span className="text-xs font-medium">{avgRating.toFixed(1)}</span>
                                  <span className="text-xs text-muted">({product.reviews.length})</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {page > 1 && (
                      <Link
                        href={`/products?${new URLSearchParams({
                          ...(params.q ? { q: params.q } : {}),
                          ...(params.category ? { category: params.category } : {}),
                          ...(params.sort ? { sort: params.sort } : {}),
                          page: String(page - 1),
                        }).toString()}`}
                        className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--badge-bg)] transition-colors"
                      >
                        Previous
                      </Link>
                    )}
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Link
                          key={pageNum}
                          href={`/products?${new URLSearchParams({
                            ...(params.q ? { q: params.q } : {}),
                            ...(params.category ? { category: params.category } : {}),
                            ...(params.sort ? { sort: params.sort } : {}),
                            page: String(pageNum),
                          }).toString()}`}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            pageNum === page
                              ? "bg-primary text-white"
                              : "border border-[var(--card-border)] hover:bg-[var(--badge-bg)]"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                    {page < totalPages && (
                      <Link
                        href={`/products?${new URLSearchParams({
                          ...(params.q ? { q: params.q } : {}),
                          ...(params.category ? { category: params.category } : {}),
                          ...(params.sort ? { sort: params.sort } : {}),
                          page: String(page + 1),
                        }).toString()}`}
                        className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--badge-bg)] transition-colors"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
