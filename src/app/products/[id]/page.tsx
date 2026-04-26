import Image from "next/image";
import Link from "next/link";
import { Star, ArrowLeft, Shield, Truck, RotateCcw, Check, BadgeCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/products/AddToCartButton";
import Footer from "@/components/layout/Footer";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return { title: "Product Not Found" };
    return {
      title: `${product.title} | ShopCart`,
      description: product.description.slice(0, 160),
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product;
  let relatedProducts: Array<{
    id: string;
    title: string;
    price: number;
    images: string[];
    category: { name: string };
  }> = [];

  try {
    product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: { select: { name: true, image: true } },
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (product) {
      relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true,
        },
        include: { category: true },
        take: 4,
      });
    }
  } catch {
    // DB not available
  }

  // Fallback product data for UI demonstration if DB is empty
  if (!product) {
    product = {
      id: "f1",
      title: "Ambar Craftsman Sculptural Vessel",
      description: "A hand-finished ceramic masterpiece exploring the boundaries of form and shadow. This vessel features a rich tan glaze with a slightly textured surface, perfect for minimalist spaces.",
      price: 14000,
      images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1200"],
      stock: 5,
      category: { name: "Sculptural" },
      seller: { name: "Alex Rivera", image: null },
      reviews: [],
    };
    relatedProducts = [
      { id: "f2", title: "Monochrome Void Canvas", price: 42000, images: ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200"], category: { name: "Artwork" } },
      { id: "f3", title: "Ether Silk Lounge Set", price: 28000, images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200"], category: { name: "The Minimalist" } },
      { id: "f4", title: "Geometric Shadow Table", price: 85000, images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200"], category: { name: "Abstract Edge" } },
      { id: "f5", title: "Celestial Glass Pendant", price: 19500, images: ["https://images.unsplash.com/photo-1543198126-a8ad8e47fb21?q=80&w=1200"], category: { name: "Abstract Edge" } },
    ];
  }

  if (!product) {
    notFound();
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back */}
        <div className="mb-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            BACK TO COLLECTION
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[var(--surface-dark)] border border-[var(--card-border)] group">
              <Image
                src={product.images[0] || "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1200"}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {product.images.length > 0 ? (
                product.images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className={`relative aspect-square overflow-hidden rounded-2xl bg-[var(--surface-dark)] border transition-all cursor-pointer hover:border-primary/50 ${i === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-[var(--card-border)]'}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="15vw"
                    />
                  </div>
                ))
              ) : (
                [1,2,3,4].map((i) => (
                   <div key={i} className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--surface-dark)] border border-[var(--card-border)] cursor-pointer hover:border-primary/50 transition-all">
                      <Image
                        src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=400&q=80`}
                        alt="Placeholder"
                        fill
                        className="object-cover"
                        sizes="15vw"
                      />
                   </div>
                ))
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">
              {product.category.name.toUpperCase()}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-[1.1]">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mb-10">
              <p className="text-4xl font-black text-primary">
                {formatCurrency(product.price)}
              </p>
            </div>

            {/* Color Swatches */}
            <div className="mb-8">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-4">Color Palette</p>
               <div className="flex gap-4">
                 {['#D2B48C', '#8B4513', '#A0522D', '#DEB887'].map((color, i) => (
                    <button 
                      key={i} 
                      className={`h-10 w-10 rounded-full border-4 transition-all ${i === 0 ? 'border-primary ring-4 ring-primary/10' : 'border-transparent bg-white/5 hover:border-white/20'}`}
                      style={{ backgroundColor: i === 0 ? color : color }} // Just to match design
                    >
                    </button>
                 ))}
               </div>
            </div>

            {/* Size selection */}
            <div className="mb-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-4">Atelier Size</p>
               <div className="flex gap-3">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button 
                      key={size}
                      className={`h-12 w-14 flex items-center justify-center rounded-xl text-xs font-black transition-all ${size === 'M' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-[var(--surface-dark)] border border-[var(--card-border)] text-muted hover:text-white hover:border-white/20'}`}
                    >
                      {size}
                    </button>
                  ))}
               </div>
            </div>

            {/* Add to Wallet */}
            <div className="mb-12">
               <AddToCartButton
                  productId={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.images[0] || "https://picsum.photos/400"}
                  stock={product.stock}
               />
               {product.stock <= 0 && <p className="text-danger text-[10px] font-bold uppercase tracking-widest mt-4 text-center">Awaiting artisan restocking</p>}
            </div>

            {/* Verified Seller Card */}
            <div className="mt-auto rounded-2xl border border-[var(--card-border)] bg-[var(--surface-dark)]/50 p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-lg border border-primary/20">
                {product.seller.name[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-bold">{product.seller.name}</p>
                  <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
                </div>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest">Curator Lead · Verified Studio</p>
              </div>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 rounded-lg px-4 py-2 hover:bg-primary/5 transition-colors">
                 PROFILE
              </button>
            </div>
          </div>
        </div>

        {/* Description & Features Sections */}
        <div className="mt-24 grid lg:grid-cols-2 gap-24 items-start border-t border-[var(--card-border)] pt-24">
           <div>
              <h2 className="text-2xl font-bold mb-8">Narrative & Origin</h2>
              <div className="prose prose-sm max-w-none text-muted leading-relaxed space-y-6">
                 <p>{product.description}</p>
                 <p>Every piece in our collection undergoes a rigorous vetting process, ensuring that the visual integrity and functional excellence meet our atelier standards.</p>
              </div>
           </div>
           
           <div className="space-y-6">
              {[
                { title: "Authentic Sourcing", desc: "Direct lineage from established artisans and boutique studios.", icon: Shield },
                { title: "Global Logistics", desc: "Expert handling and temperature-controlled shipping protocols.", icon: Truck },
                { title: "Secure Transaction", desc: "Encrypted blockchain-verified payment and escrow systems.", icon: Lock }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10 group hover:bg-primary/10 transition-all">
                   <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-5 w-5 text-primary" />
                   </div>
                   <div>
                      <h3 className="text-sm font-bold mb-2">{feature.title}</h3>
                      <p className="text-xs text-muted leading-relaxed">{feature.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Voice of the Curated – Reviews */}
        <section className="mt-24 border-t border-[var(--card-border)] pt-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Community</p>
              <h2 className="text-2xl font-bold mb-2">Voice of the Curated</h2>
              <p className="text-sm text-muted">What our atelier members are saying.</p>
            </div>
            {avgRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? 'fill-warning text-warning' : 'fill-none text-muted'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-muted">({product.reviews.length} verified)</span>
              </div>
            )}
          </div>

          {product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.reviews.slice(0, 3).map((review: { id: string; rating: number; comment: string | null; user: { name: string | null; image: string | null } }, i: number) => (
                <div key={review.id || i} className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    {review.user?.image ? (
                      <Image src={review.user.image} alt={review.user.name || "Reviewer"} width={40} height={40} className="rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary-light/10 flex items-center justify-center text-xs font-bold text-primary border border-[var(--card-border)]">
                        {review.user?.name?.[0]?.toUpperCase() || "A"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold">{review.user?.name || "Atelier Member"}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-warning text-warning' : 'fill-none text-muted'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed line-clamp-3">{review.comment || "A wonderful addition to my collection."}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Elena R.", rating: 5, comment: "Exceptional craftsmanship. The texture and finish exceeded every expectation. A true statement piece for my studio." },
                { name: "Julian T.", rating: 5, comment: "The packaging alone was a luxury experience. The product itself is simply stunning — exactly as described." },
                { name: "Aiko M.", rating: 4, comment: "Beautiful and unique. I appreciate the attention to detail. Shipping was faster than expected as well." },
              ].map((review, i) => (
                <div key={i} className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary-light/10 flex items-center justify-center text-xs font-bold text-primary border border-[var(--card-border)]">
                      {review.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{review.name}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-warning text-warning' : 'fill-none text-muted'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AI-Curated for You */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <ArrowLeft className="h-4 w-4 text-primary" />
                <h2 className="text-2xl font-bold">AI-Curated for You</h2>
              </div>
              <Link href="/products" className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                View All <ArrowLeft className="h-3 w-3 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp, idx) => (
                <Link key={rp.id} href={`/products/${rp.id}`} className="group block">
                  <div className="flex flex-col h-full">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--surface-dark)] mb-3 border border-[var(--card-border)]">
                      <Image
                        src={rp.images[0] || `https://images.unsplash.com/photo-${1500000000000 + idx}?w=500&q=80`}
                        alt={rp.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="25vw"
                      />
                    </div>
                    <div className="px-1">
                      <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors mb-1">
                        {rp.title}
                      </h3>
                      <p className="text-sm font-bold text-primary">
                        {formatCurrency(rp.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
