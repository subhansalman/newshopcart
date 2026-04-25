import Link from "next/link";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Layers, Search } from "lucide-react";
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
  title: "Products | ShopCart",
  description: "Browse our curated collection of products.",
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
    // DB not available
  }

  // Fallback products
  if (products.length === 0) {
    products = [
      { id: "f1", title: "Ambar Craftsman Vessel", price: 14000, images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=600"], stock: 5, category: { name: "Sculptural" }, reviews: [], createdAt: new Date() },
      { id: "f2", title: "Obsidian Chronograph", price: 42000, images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600"], stock: 2, category: { name: "Accessories" }, reviews: [], createdAt: new Date() },
      { id: "f3", title: "Monochrome Low-Top", price: 28000, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600"], stock: 12, category: { name: "Footwear" }, reviews: [], createdAt: new Date() },
      { id: "f4", title: "Minimalist Stoneware", price: 4500, images: ["https://images.unsplash.com/photo-1565193998248-d5a03e726549?q=80&w=600"], stock: 24, category: { name: "Home" }, reviews: [], createdAt: new Date() },
      { id: "f5", title: "Celestial Glass Pendant", price: 19500, images: ["https://images.unsplash.com/photo-1543198126-a8ad8e47fb21?q=80&w=600"], stock: 8, category: { name: "Lighting" }, reviews: [], createdAt: new Date() },
      { id: "f6", title: "Geometric Shadow Table", price: 85000, images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600"], stock: 3, category: { name: "Home" }, reviews: [], createdAt: new Date() },
    ];
    totalProducts = products.length;
  }

  const totalPages = Math.ceil(totalProducts / perPage);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-56 shrink-0">
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

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">Seasonal Curations</h1>
                <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
                  Explore our latest atelier arrivals, where every piece is selected for distinct visual integrity and absolute craftsmanship.
                </p>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                <Link href="/products?sort=popular" className="px-5 py-1.5 text-[11px] uppercase tracking-wider font-bold bg-white text-gray-900 rounded-md shadow-sm border border-gray-200">Popular</Link>
                <Link href="/products?sort=newest" className="px-5 py-1.5 text-[11px] uppercase tracking-wider font-bold text-gray-500 hover:text-gray-900 transition-colors">Newest</Link>
                <Link href="/products?sort=price_asc" className="px-5 py-1.5 text-[11px] uppercase tracking-wider font-bold text-gray-500 hover:text-gray-900 transition-colors">Price</Link>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-gray-50 border border-gray-200">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">No pieces found</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
                  Try adjusting your search or filter criteria.
                </p>
                <Link href="/products" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition-colors">
                  View Collection
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const avgRating =
                      product.reviews.length > 0
                        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                        : 0;

                    return (
                      <Link key={product.id} href={`/products/${product.id}`} className="group block">
                        <div className="h-full flex flex-col group-hover:-translate-y-1 transition-transform duration-300">
                          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 mb-4 border border-gray-100">
                            <Image
                              src={product.images[0] || "https://picsum.photos/500"}
                              alt={product.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>

                          <div className="px-1 flex-1 flex flex-col">
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <h3 className="text-[15px] font-semibold leading-snug text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                {product.title}
                              </h3>
                              <p className="text-[15px] font-bold text-primary shrink-0">
                                {formatCurrency(product.price)}
                              </p>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{product.category.name}</p>

                            <div className="mt-auto flex items-center gap-1.5">
                              <div className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium text-gray-600">{avgRating > 0 ? avgRating.toFixed(1) : "4.9"}</span>
                              </div>
                              <span className="text-[10px] text-gray-400 tracking-wider uppercase">· Studio Exclusive</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white hover:bg-primary-dark transition-colors w-full sm:w-auto shadow-lg shadow-primary/20">
                    <Layers className="h-4 w-4" />
                    65 Curated
                  </button>

                  {/* Pagination */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products?${new URLSearchParams({ ...params, page: String(Math.max(1, page - 1)) }).toString()}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((pageNum) => (
                        <Link
                          key={pageNum}
                          href={`/products?${new URLSearchParams({ ...params, page: String(pageNum) }).toString()}`}
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                            pageNum === page
                              ? "bg-primary text-white shadow-md shadow-primary/20"
                              : "bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={`/products?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
