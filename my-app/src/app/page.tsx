import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Star,
  ShoppingBag,
  Cpu,
  Shirt,
  BookOpen,
  Home,
  Dumbbell,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRecommendations } from "@/lib/recommendations";

const CATEGORIES = [
  { name: "Electronics", icon: Cpu, color: "from-blue-500 to-indigo-600" },
  { name: "Clothing", icon: Shirt, color: "from-pink-500 to-rose-600" },
  { name: "Books", icon: BookOpen, color: "from-amber-500 to-orange-600" },
  { name: "Home & Kitchen", icon: Home, color: "from-emerald-500 to-teal-600" },
  { name: "Sports", icon: Dumbbell, color: "from-purple-500 to-violet-600" },
];

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, stock: { gt: 0 } },
      include: { category: true, reviews: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return products;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const products = await getFeaturedProducts();

  let recommendedProducts: any[] = [];
  if (session?.user?.id) {
    try {
      const userOrders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: { items: { include: { product: { include: { category: true } } } } },
      });

      const purchasedCategories = [...new Set(userOrders.flatMap((o) => o.items.map((i) => i.product.category.name)))];
      const purchasedTags = [...new Set(userOrders.flatMap((o) => o.items.flatMap((i) => i.product.tags)))];
      const purchasedIds = new Set(userOrders.flatMap((o) => o.items.map((i) => i.productId)));

      const allProducts = await prisma.product.findMany({
        where: { isActive: true, stock: { gt: 0 }, id: { notIn: [...purchasedIds] } },
        include: { category: true, reviews: true },
      });

      recommendedProducts = getRecommendations(purchasedCategories, purchasedTags, allProducts);
    } catch {
      // Ignore
    }
  }


  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D1A] via-[#1A1A2E] to-[#16162A]" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary-light/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 mb-6 backdrop-blur-sm border border-white/10">
                <Sparkles className="h-4 w-4 text-primary-light" />
                AI-Powered Recommendations
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                Curated Shopping,{" "}
                <span className="bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>
              <p className="text-lg text-white/60 max-w-xl mb-8 leading-relaxed">
                Discover products tailored to your taste. Our AI-driven marketplace
                connects you with the best sellers and curated collections across Pakistan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary-dark transition-all btn-glow shadow-lg shadow-primary/25"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Become a Seller
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                <div>
                  <p className="text-2xl font-bold text-white">25K+</p>
                  <p className="text-sm text-white/50">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">8K+</p>
                  <p className="text-sm text-white/50">Sellers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">99%</p>
                  <p className="text-sm text-white/50">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:flex items-center justify-center animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary-light/30 rounded-3xl blur-2xl" />
                <div className="relative w-[400px] h-[400px] rounded-3xl glass flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8">
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-primary/40 to-primary-light/20 flex items-center justify-center">
                      <Zap className="h-12 w-12 text-white/80" />
                    </div>
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-primary-light/40 to-primary/20 flex items-center justify-center">
                      <TrendingUp className="h-12 w-12 text-white/80" />
                    </div>
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-primary-light/30 to-blue-500/20 flex items-center justify-center">
                      <Star className="h-12 w-12 text-white/80" />
                    </div>
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-500/30 to-primary/20 flex items-center justify-center">
                      <Sparkles className="h-12 w-12 text-white/80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Browse Categories</h2>
          <p className="text-muted max-w-md mx-auto">
            Explore our curated collections across every category
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative overflow-hidden rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className="relative">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--badge-bg)] group-hover:scale-110 transition-transform">
                  <cat.icon className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm font-semibold">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-1">Featured Products</h2>
              <p className="text-muted">Hand-picked selections just for you</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const avgRating =
                product.reviews.length > 0
                  ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / product.reviews.length
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
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
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
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* AI Recommendations */}
      {session && recommendedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">Recommended for You</h2>
              </div>
              <p className="text-muted">AI-powered suggestions based on your taste</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Explore More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => {
              const avgRating =
                product.reviews && product.reviews.length > 0
                  ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / product.reviews.length
                  : 0;
              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group relative">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 to-primary-light/30 opacity-0 blur transition group-hover:opacity-100" />
                  <div className="product-card relative rounded-xl border border-primary/20 bg-[var(--card-bg)] overflow-hidden">
                    <div className="absolute top-3 left-3 z-10 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Top Match
                    </div>
                    <div className="relative aspect-square overflow-hidden bg-[var(--surface)]">
                      <Image
                        src={product.images[0] || "https://picsum.photos/400"}
                        alt={product.title}
                        fill
                        className="product-image object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
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
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-8">
            Join thousands of sellers on ShopCart and reach millions of buyers across Pakistan.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary hover:bg-white/90 transition-colors shadow-xl"
          >
            Get Started Today
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
