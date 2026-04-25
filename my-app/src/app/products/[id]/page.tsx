import Image from "next/image";
import Link from "next/link";
import { Star, ArrowLeft, Shield, Truck, RotateCcw } from "lucide-react";
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
      openGraph: {
        title: product.title,
        images: product.images[0] ? [product.images[0]] : [],
      },
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

  if (!product) {
    notFound();
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <span className="text-muted">/</span>
          <span className="text-sm text-muted">{product.category.name}</span>
          <span className="text-muted">/</span>
          <span className="text-sm font-medium truncate">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--card-border)]">
              <Image
                src={product.images[0] || "https://picsum.photos/800"}
                alt={product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-xl bg-[var(--surface)] border border-[var(--card-border)] cursor-pointer hover:border-primary transition-colors"
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
              {product.category.name}
            </p>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(avgRating)
                        ? "fill-warning text-warning"
                        : "fill-none text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted">({product.reviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </p>
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-success">
                    In Stock ({product.stock} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-danger" />
                  <span className="text-sm font-medium text-danger">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--badge-bg)] px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <AddToCartButton
              productId={product.id}
              title={product.title}
              price={product.price}
              image={product.images[0] || "https://picsum.photos/400"}
              stock={product.stock}
            />

            {/* Seller */}
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {product.seller.name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">Sold by {product.seller.name}</p>
                <p className="text-xs text-muted">Verified Seller</p>
              </div>
            </div>

            {/* Guarantees */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--card-border)] p-3 text-center">
                <Truck className="h-5 w-5 text-primary" />
                <p className="text-xs font-medium">Free Shipping</p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--card-border)] p-3 text-center">
                <Shield className="h-5 w-5 text-primary" />
                <p className="text-xs font-medium">Secure Payment</p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--card-border)] p-3 text-center">
                <RotateCcw className="h-5 w-5 text-primary" />
                <p className="text-xs font-medium">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">
            Customer Reviews ({product.reviews.length})
          </h2>
          {product.reviews.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
              <Star className="h-12 w-12 text-muted mx-auto mb-3" />
              <p className="text-muted">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {review.user.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{review.user.name}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "fill-warning text-warning"
                                : "fill-none text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/products/${rp.id}`} className="group">
                  <div className="product-card rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
                    <div className="relative aspect-square overflow-hidden bg-[var(--surface)]">
                      <Image
                        src={rp.images[0] || "https://picsum.photos/400"}
                        alt={rp.title}
                        fill
                        className="product-image object-cover"
                        sizes="25vw"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-primary uppercase mb-1">
                        {rp.category.name}
                      </p>
                      <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {rp.title}
                      </h3>
                      <p className="text-lg font-bold text-primary mt-1">
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
