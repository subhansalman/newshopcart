import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Star,
  ShoppingBag,
  Cpu,
  Shirt,
  BookOpen,
  Home,
  Dumbbell,
  ArrowUpRight,
  Check,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRecommendations } from "@/lib/recommendations";

const CATEGORIES = [
  { name: "Electronics", icon: Cpu, color: "from-blue-500 to-indigo-600", bg: "bg-blue-500/10" },
  { name: "Clothing", icon: Shirt, color: "from-pink-500 to-rose-600", bg: "bg-pink-500/10" },
  { name: "Books", icon: BookOpen, color: "from-amber-500 to-orange-600", bg: "bg-amber-500/10" },
  { name: "Home & Kitchen", icon: Home, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10" },
  { name: "Sports", icon: Dumbbell, color: "from-purple-500 to-violet-600", bg: "bg-purple-500/10" },
];

const FALLBACK_PRODUCTS = [
  { id: "h1", title: "Ambar Craftsman Sculptural Vessel", price: 14000, images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=800"], stock: 5, category: { name: "Sculptural" }, reviews: [] },
  { id: "h2", title: "Monochrome Void Canvas", price: 42000, images: ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800"], stock: 2, category: { name: "Artwork" }, reviews: [] },
  { id: "h3", title: "Ether Silk Lounge Set", price: 28000, images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800"], stock: 12, category: { name: "The Minimalist" }, reviews: [] },
  { id: "h4", title: "Geometric Shadow Table", price: 85000, images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800"], stock: 3, category: { name: "Abstract Edge" }, reviews: [] },
  { id: "h5", title: "Celestial Glass Pendant", price: 19500, images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800"], stock: 8, category: { name: "Abstract Edge" }, reviews: [] },
  { id: "h6", title: "Minimalist Stoneware Plate", price: 4500, images: ["https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?q=80&w=800"], stock: 24, category: { name: "The Minimalist" }, reviews: [] },
  { id: "h7", title: "Artisan Wool Coat", price: 68000, images: ["https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800"], stock: 6, category: { name: "Outerwear" }, reviews: [] },
  { id: "h8", title: "Obsidian Leather Tote", price: 35000, images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800"], stock: 10, category: { name: "Accessories" }, reviews: [] },
] as any[];

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, stock: { gt: 0 } },
      include: { category: true, reviews: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return products.length > 0 ? products : FALLBACK_PRODUCTS;
  } catch {
    return FALLBACK_PRODUCTS;
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
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B1A] via-[#12122A] to-[#0D0D20]" />
        
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="hero-gradient-orb w-[500px] h-[500px] bg-primary/15 top-[-10%] left-[-5%]" />
          <div className="hero-gradient-orb w-[600px] h-[600px] bg-primary-light/8 bottom-[-15%] right-[-10%]" style={{ animationDelay: '2s' }} />
          <div className="hero-gradient-orb w-[300px] h-[300px] bg-accent/10 top-[40%] left-[50%]" style={{ animationDelay: '4s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px' 
        }} />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-2 text-sm text-white/70 mb-8 backdrop-blur-md border border-white/[0.08] animate-scale-in">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/30">
                  <Sparkles className="h-3 w-3 text-primary-light" />
                </div>
                <span className="text-xs font-medium tracking-wide">AI-Powered Recommendations</span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-8 text-balance">
                Shop Smarter,{" "}
                <br />
                <span className="hero-text-gradient">
                  Live Better.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">
                Discover products tailored to your taste. Our AI-driven marketplace
                connects you with the best sellers and curated collections.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-primary-dark px-8 py-4 text-sm font-semibold text-white transition-all btn-premium shadow-xl shadow-primary/20"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-8 py-4 text-sm font-semibold text-white hover:bg-white/[0.06] hover:border-white/25 transition-all backdrop-blur-sm"
                >
                  Become a Seller
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-10 mt-14 pt-10 border-t border-white/[0.06]">
                {[
                  { value: "25K+", label: "Products" },
                  { value: "8K+", label: "Sellers" },
                  { value: "99%", label: "Satisfaction" },
                ].map((stat) => (
                  <div key={stat.label} className="animate-count-up">
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-xs text-white/40 font-medium tracking-wider uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative animate-float">
                {/* Outer glow ring */}
                <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 to-accent/10 rounded-[32px] blur-3xl" />

                {/* Main card – hero image */}
                <div className="relative w-[420px] h-[480px] rounded-[32px] overflow-hidden glass-card">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800"
                    alt="Style curator"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="420px"
                  />
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B1A]/70 via-transparent to-transparent" />
                  {/* Bottom label */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/40">
                        <Sparkles className="h-4 w-4 text-primary-light" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">AI Style Match</p>
                        <p className="text-[10px] text-white/50">Personalized for you</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-6 glass-card rounded-2xl px-5 py-3 flex items-center gap-3 animate-slide-in-left" style={{ animationDelay: '600ms' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20">
                    <Check className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Verified Sellers</p>
                    <p className="text-[10px] text-white/50">8,000+ trusted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Browse by Category</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Curated Collections</h2>
          <p className="text-muted max-w-md mx-auto leading-relaxed">
            Explore our hand-picked selections across every category
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 stagger-children">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative overflow-hidden rounded-2xl p-7 text-center transition-all hover:-translate-y-1.5 premium-card"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500`} />
              <div className="relative">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${cat.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Hand-Picked</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted">Selections curated just for you</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors group"
            >
              View All
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {products.map((product) => {
              const avgRating =
                product.reviews.length > 0
                  ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / product.reviews.length
                  : 0;
              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="product-card rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
                    <div className="relative aspect-square overflow-hidden bg-[var(--surface-dark)]">
                      <Image
                        src={product.images[0] || "https://picsum.photos/400"}
                        alt={product.title}
                        fill
                        className="product-image object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em] mb-2">
                        {product.category.name}
                      </p>
                      <h3 className="text-sm font-semibold leading-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(product.price)}
                        </p>
                        {avgRating > 0 && (
                          <div className="flex items-center gap-1 bg-warning/10 rounded-full px-2 py-0.5">
                            <Star className="h-3 w-3 fill-warning text-warning" />
                            <span className="text-xs font-bold text-warning">{avgRating.toFixed(1)}</span>
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
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">AI Curated</p>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Recommended for You</h2>
              <p className="text-muted">Personalized suggestions based on your taste</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors group"
            >
              Explore More
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {recommendedProducts.map((product) => {
              const avgRating =
                product.reviews && product.reviews.length > 0
                  ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / product.reviews.length
                  : 0;
              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group relative">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-primary-light/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                  <div className="product-card relative rounded-2xl border border-primary/15 bg-[var(--card-bg)] overflow-hidden">
                    <div className="absolute top-3 left-3 z-10 rounded-full bg-gradient-to-r from-primary to-primary-dark px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md flex items-center gap-1 shadow-lg shadow-primary/20">
                      <Sparkles className="h-3 w-3" />
                      Top Match
                    </div>
                    <div className="relative aspect-square overflow-hidden bg-[var(--surface-dark)]">
                      <Image
                        src={product.images[0] || "https://picsum.photos/400"}
                        alt={product.title}
                        fill
                        className="product-image object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em] mb-2">
                        {product.category.name}
                      </p>
                      <h3 className="text-sm font-semibold leading-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(product.price)}
                        </p>
                        {avgRating > 0 && (
                          <div className="flex items-center gap-1 bg-warning/10 rounded-full px-2 py-0.5">
                            <Star className="h-3 w-3 fill-warning text-warning" />
                            <span className="text-xs font-bold text-warning">{avgRating.toFixed(1)}</span>
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-[#3B35A0]" />
        <div className="absolute inset-0">
          <div className="hero-gradient-orb w-[400px] h-[400px] bg-white/10 top-[-20%] left-[10%]" />
          <div className="hero-gradient-orb w-[500px] h-[500px] bg-white/5 bottom-[-30%] right-[5%]" style={{ animationDelay: '3s' }} />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} />
        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80 mb-8 backdrop-blur-sm border border-white/10">
            <Sparkles className="h-3 w-3" />
            Join 8,000+ sellers
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-balance">
            Ready to Start Selling?
          </h2>
          <p className="text-white/60 max-w-lg mx-auto mb-10 leading-relaxed">
            Join thousands of sellers on ShopCart and reach millions of buyers with our AI-powered marketplace.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-10 py-4 text-sm font-bold text-primary hover:bg-white/95 transition-all shadow-2xl shadow-black/20 hover:shadow-black/30 hover:-translate-y-0.5"
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
