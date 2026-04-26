"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  stock: number;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  category,
  rating = 0,
  reviewCount = 0,
  stock,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock <= 0) return;
    addItem({
      productId: id,
      title,
      price,
      qty: 1,
      image,
    });
    toast.success(`${title} added to cart!`);
  };

  return (
    <Link href={`/products/${id}`} className="group">
      <div className="product-card rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden shadow-sm">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[var(--surface)]">
          <Image
            src={image}
            alt={title}
            fill
            className="product-image object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-danger px-3 py-1 text-xs font-bold text-white">
                Out of Stock
              </span>
            </div>
          )}
          {/* Quick add button */}
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs font-medium text-primary lowercase tracking-[0.15em] mb-1">
            {category}
          </p>
          <h3 className="text-sm font-semibold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              {formatCurrency(price)}
            </p>
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="text-xs font-medium">{rating.toFixed(1)}</span>
                <span className="text-xs text-muted">({reviewCount})</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
