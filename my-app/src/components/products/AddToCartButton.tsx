"use client";

import { useState } from "react";
import { Wallet, Minus, Plus } from "lucide-react";
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
    toast.success(`${qty}x ${title} added to your selection!`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Quantity selector */}
      <div className="flex items-center rounded-2xl border border-[var(--card-border)] bg-[var(--surface-dark)] p-1 shrink-0">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center hover:bg-white/5 transition-colors rounded-xl text-muted hover:text-white"
          disabled={qty <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="flex h-11 w-11 items-center justify-center text-sm font-black text-white">
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => Math.min(stock, q + 1))}
          className="flex h-11 w-11 items-center justify-center hover:bg-white/5 transition-colors rounded-xl text-muted hover:text-white"
          disabled={qty >= stock}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        disabled={stock <= 0}
        className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <Wallet className="h-4 w-4 group-hover:scale-110 transition-transform" />
        {stock <= 0 ? "Out of Selection" : "Add to Wallet"}
      </button>
    </div>
  );
}
