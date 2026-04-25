import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

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

// Fallback products for when DB is unavailable
const FALLBACK_PRODUCTS = [
  { id: "f1", title: "Ambar Craftsman Vessel", price: 14000, images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=600"], category: { name: "Sculptural" }, reviews: [] },
  { id: "f2", title: "Obsidian Chronograph", price: 42000, images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600"], category: { name: "Accessories" }, reviews: [] },
  { id: "f3", title: "Monochrome Low-Top", price: 28000, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600"], category: { name: "Footwear" }, reviews: [] },
  { id: "f4", title: "Artisan Portrait", price: 8500, images: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600"], category: { name: "Artwork" }, reviews: [] },
  { id: "f5", title: "Nebula Speaker", price: 19500, images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600"], category: { name: "Electronics" }, reviews: [] },
  { id: "f6", title: "Sapphire Smart Band", price: 12000, images: ["https://images.unsplash.com/photo-1546868871-af0de0ae72be?q=80&w=600"], category: { name: "Accessories" }, reviews: [] },
  { id: "f7", title: "Geometric Shadow Table", price: 85000, images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600"], category: { name: "Home" }, reviews: [] },
  { id: "f8", title: "Celestial Glass Pendant", price: 19500, images: ["https://images.unsplash.com/photo-1543198126-a8ad8e47fb21?q=80&w=600"], category: { name: "Lighting" }, reviews: [] },
];

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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0ABFBC] via-[#3DD6D0] to-[#48D1CC]" />
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <p className="text-sm font-medium text-white/80 uppercase tracking-widest mb-4">
                Premium Shopping
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                Shop Smarter,<br />
                Live <span className="italic font-serif">Better</span>.
              </h1>
              <p className="text-lg text-white/70 max-w-md mb-8 leading-relaxed">
                Find the best curated products at unbeatable prices. Your one-stop destination for premium shopping.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary-dark transition-all btn-glow shadow-lg shadow-primary/25"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Hero image */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-[420px] h-[420px] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800"
                  alt="Shop Smarter"
                  fill
                  className="object-cover"
                  priority
                  sizes="420px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Rotaries */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Curated Rotaries</h2>
          <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
            All Products <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {curatedRotaries.map((product: any) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="product-card rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.images[0] || "https://picsum.photos/400"}
                    alt={product.title}
                    fill
                    className="product-image object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm font-bold text-primary">{formatCurrency(product.price)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Masterpieces */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Masterpieces</h2>
          <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMasterpieces.map((product: any) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="product-card rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.images[0] || "https://picsum.photos/400"}
                    alt={product.title}
                    fill
                    className="product-image object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-primary">{formatCurrency(product.price)}</p>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Chosen For You */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Chosen For You</h2>
          <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
            Explore More <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {chosenForYou.map((product: any) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="product-card rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.images[0] || "https://picsum.photos/400"}
                    alt={product.title}
                    fill
                    className="product-image object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm font-bold text-primary">{formatCurrency(product.price)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section — Purple gradient */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary-dark px-8 py-14 sm:px-14">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to refine your style?
            </h2>
            <p className="text-white/70 mb-8">
              Join thousands of curated shoppers and discover products tailored to your unique taste.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:ring-0 outline-none backdrop-blur-sm"
              />
              <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-white/90 transition-colors shadow-lg">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
