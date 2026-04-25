"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface AddToCartButtonProps {
  productId: string;
  title: string;
  price: number;
  image: string;
  stock: number;
}

export default function AddToCartButton({
  productId,
  title,
  price,
  image,
  stock,
}: AddToCartButtonProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    if (stock <= 0) return;
    for (let i = 0; i < qty; i++) {
      addItem({ productId, title, price, qty: 1, image });
    }
    toast.success(`${qty}x ${title} added to cart!`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Quantity selector */}
      <div className="flex items-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-12 w-12 items-center justify-center hover:bg-[var(--badge-bg)] transition-colors rounded-l-xl"
          disabled={qty <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="flex h-12 w-12 items-center justify-center text-sm font-semibold border-x border-[var(--card-border)]">
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => Math.min(stock, q + 1))}
          className="flex h-12 w-12 items-center justify-center hover:bg-[var(--badge-bg)] transition-colors rounded-r-xl"
          disabled={qty >= stock}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        disabled={stock <= 0}
        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-all btn-glow disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
      >
        <ShoppingCart className="h-4 w-4" />
        {stock <= 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
