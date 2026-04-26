import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, stock: { gt: 0 } },
      include: { category: true, reviews: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    });
    return products;
  } catch {
    return [];
  }
}

// Fallback products for when DB is unavailable
const FALLBACK_PRODUCTS = [
  { id: "f1", title: "Obsidian Chronograph", price: 42000, images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600"], category: { name: "Accessories" }, reviews: [{ rating: 5 }, { rating: 4 }] },
  { id: "f2", title: "Monochrome Low-Top", price: 28000, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600"], category: { name: "Footwear" }, reviews: [{ rating: 5 }] },
  { id: "f3", title: "Artisan Portrait", price: 8500, images: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600"], category: { name: "Artwork" }, reviews: [{ rating: 4 }, { rating: 5 }] },
  { id: "f4", title: "Ambar Craftsman Vessel", price: 14000, images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=600"], category: { name: "Sculptural" }, reviews: [{ rating: 5 }] },
  { id: "f5", title: "Nebula Speaker", price: 19500, images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600"], category: { name: "Electronics" }, reviews: [{ rating: 4 }, { rating: 4 }] },
  { id: "f6", title: "Sapphire Smart Band", price: 12000, images: ["https://images.unsplash.com/photo-1546868871-af0de0ae72be?q=80&w=600"], category: { name: "Accessories" }, reviews: [{ rating: 5 }, { rating: 5 }] },
  { id: "f7", title: "Geometric Shadow Table", price: 85000, images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600"], category: { name: "Home" }, reviews: [{ rating: 4 }] },
  { id: "f8", title: "Celestial Glass Pendant", price: 19500, images: ["https://images.unsplash.com/photo-1543198126-a8ad8e47fb21?q=80&w=600"], category: { name: "Lighting" }, reviews: [{ rating: 5 }, { rating: 4 }] },
  { id: "f9", title: "Midnight Canvas Tote", price: 6500, images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600"], category: { name: "Bags" }, reviews: [{ rating: 5 }] },
  { id: "f10", title: "Arctic White Headphones", price: 32000, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600"], category: { name: "Electronics" }, reviews: [{ rating: 4 }, { rating: 5 }] },
  { id: "f11", title: "Prism Desk Lamp", price: 11000, images: ["https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?q=80&w=600"], category: { name: "Lighting" }, reviews: [{ rating: 5 }] },
  { id: "f12", title: "Velvet Lounge Chair", price: 67000, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600"], category: { name: "Home" }, reviews: [{ rating: 5 }, { rating: 4 }] },
];

const CATEGORIES = [
  { name: "All", icon: "✦" },
  { name: "Electronics", icon: "⚡" },
  { name: "Footwear", icon: "👟" },
  { name: "Accessories", icon: "⌚" },
  { name: "Home", icon: "🏠" },
  { name: "Artwork", icon: "🎨" },
  { name: "Lighting", icon: "💡" },
];

function getAverageRating(reviews: { rating: number }[]) {
  if (!reviews || reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export default async function HomePage() {
  let products = await getFeaturedProducts();
  if (products.length === 0) {
    products = FALLBACK_PRODUCTS as any;
  }

  const curatedRotaries = products.slice(0, 4);
  const featuredMasterpieces = products.slice(2, 6);
  const chosenForYou = products.slice(4, 8);

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section id="hero" className="hero-section relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 hero-gradient" />

        {/* Decorative blurs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-[#48D1CC]/20 rounded-full blur-[60px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="animate-fade-in z-10">
              <p className="hero-label inline-block text-xs font-semibold text-white/90 uppercase tracking-[0.25em] mb-5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                Premium Shopping
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                Shop Smarter,<br />
                Live <span className="italic font-serif bg-gradient-to-r from-white to-white/80 bg-clip-text">Better</span>.
              </h1>
              <p className="text-lg text-white/60 max-w-md mb-8 leading-relaxed">
                Find the best curated products at unbeatable prices. Your one-stop destination for premium shopping.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/products"
                  id="hero-cta"
                  className="hero-btn group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary-dark transition-all btn-glow shadow-lg shadow-primary/30"
                >
                  Start Shopping
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white border border-white/25 hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  View Collections
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-10">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white/50 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm" />
                    ))}
                  </div>
                  <span className="text-xs text-white/60 font-medium">2K+ Happy Buyers</span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-white/60 font-medium ml-1">4.9 Rating</span>
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="hero-image-container relative">
                {/* Floating ring decoration */}
                <div className="absolute -top-6 -right-6 w-[460px] h-[460px] rounded-[2rem] border-2 border-white/15 rotate-3" />
                <div className="relative w-[420px] h-[420px] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800"
                    alt="Shop Smarter - Stylish man with glasses"
                    fill
                    className="object-cover"
                    priority
                    sizes="420px"
                  />
                  {/* Overlay gradient at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0ABFBC]/40 via-transparent to-transparent" />
                </div>
                {/* Floating product badge */}
                <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-3 shadow-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">1,200+</p>
                      <p className="text-[10px] text-gray-500">Products Listed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Category Navigation ─── */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.name}
              href={cat.name === "All" ? "/products" : `/products?category=${cat.name}`}
              className={`category-pill flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                i === 0
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Curated Rotaries ─── */}
      <section id="curated-rotaries" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Curated Rotaries</h2>
            <p className="text-sm text-gray-500 mt-1">Handpicked essentials for the modern connoisseur</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors group">
            All Products <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {curatedRotaries.map((product: any, idx: number) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="product-card rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.images[0] || "https://picsum.photos/400"}
                    alt={product.title}
                    fill
                    className="product-image object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {/* Quick action overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  {/* Category tag */}
                  <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full">
                    {product.category?.name || "General"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm font-bold text-primary">{formatCurrency(product.price)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Section divider with dots ─── */}
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <div className="w-2 h-2 rounded-full bg-gray-300" />
      </div>

      {/* ─── Featured Masterpieces ─── */}
      <section id="featured-masterpieces" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Masterpieces</h2>
            <p className="text-sm text-gray-500 mt-1">Editor&apos;s choice, curated with precision</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors group">
            View All <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredMasterpieces.map((product: any, idx: number) => {
            const avgRating = getAverageRating(product.reviews);
            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group" style={{ animationDelay: `${idx * 80}ms` }}>
                <div className="product-card rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                      src={product.images[0] || "https://picsum.photos/400"}
                      alt={product.title}
                      fill
                      className="product-image object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-primary">{formatCurrency(product.price)}</p>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Section divider with dots ─── */}
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-gray-300" />
      </div>

      {/* ─── Chosen For You ─── */}
      <section id="chosen-for-you" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chosen For You</h2>
            <p className="text-sm text-gray-500 mt-1">AI-powered picks based on trending styles</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors group">
            Explore More <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {chosenForYou.map((product: any, idx: number) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="product-card rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.images[0] || "https://picsum.photos/400"}
                    alt={product.title}
                    fill
                    className="product-image object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full">
                    {product.category?.name || "General"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm font-bold text-primary">{formatCurrency(product.price)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section id="cta-banner" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="cta-banner relative overflow-hidden rounded-3xl px-8 py-16 sm:px-14">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#7B6CFF] to-primary-dark" />
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/8 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                Ready to refine<br />your style?
              </h2>
              <p className="text-white/60 mb-0 lg:mb-0 leading-relaxed">
                Join thousands of curated shoppers and discover products tailored to your unique taste.
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                id="cta-email-input"
                className="flex-1 lg:w-72 rounded-xl bg-white/10 border border-white/20 px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:ring-0 outline-none backdrop-blur-sm transition-colors"
              />
              <button
                id="cta-signup-btn"
                className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary hover:bg-white/90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Brands / Trust Strip ─── */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Trusted by leading brands</p>
          <div className="flex items-center justify-center gap-10 sm:gap-16 opacity-40">
            {["ATELIER", "NOVA", "PRISM", "HORIZON", "CRAFT"].map((brand) => (
              <span key={brand} className="text-lg sm:text-xl font-bold tracking-widest text-gray-600">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
