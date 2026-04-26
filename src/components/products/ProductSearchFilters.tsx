"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, Check } from "lucide-react";

interface FilterProps {
  categories: { name: string; count: number }[];
  currentCategory?: string;
  currentSort?: string;
  currentQ?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

export default function ProductSearchFilters({
  categories,
  currentCategory,
  currentSort,
  currentQ,
  currentMinPrice,
  currentMaxPrice,
}: FilterProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const values = {
      q: currentQ,
      category: currentCategory,
      sort: currentSort,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
      ...overrides,
    };
    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    return `/products?${params.toString()}`;
  };

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-sm font-medium lg:hidden mb-4"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      <div className={`space-y-8 ${mobileOpen ? "block" : "hidden"} lg:block`}>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Collections</h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push(buildUrl({ category: undefined, page: undefined }))}
              className={`flex w-full items-center gap-3 cursor-pointer group text-left`}
            >
              <div className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${!currentCategory ? 'border-primary bg-primary' : 'border-[var(--card-border)] bg-[var(--input-bg)] group-hover:border-primary'}`}>
                <Check className={`h-3 w-3 ${!currentCategory ? 'text-white' : 'text-transparent'}`} />
              </div>
              <span className={`text-sm font-medium transition-colors ${!currentCategory ? 'text-[var(--foreground)]' : 'text-muted group-hover:text-[var(--foreground)]'}`}>All Curations</span>
            </button>
            
            {(categories.length > 0 ? categories : [
              { name: "The Minimalist", count: 12 },
              { name: "Abstract Edge", count: 8 },
              { name: "Sculptural", count: 15 },
              { name: "Artwork", count: 4 }
            ]).map((cat) => (
              <button
                key={cat.name}
                onClick={() => router.push(buildUrl({ category: cat.name, page: undefined }))}
                className="flex w-full items-center gap-3 cursor-pointer group text-left"
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${currentCategory === cat.name ? 'border-primary bg-primary' : 'border-[var(--card-border)] bg-[var(--input-bg)] group-hover:border-primary'}`}>
                  <Check className={`h-3 w-3 ${currentCategory === cat.name ? 'text-white' : 'text-transparent'}`} />
                </div>
                <span className={`text-sm font-medium transition-colors ${currentCategory === cat.name ? 'text-[var(--foreground)]' : 'text-muted group-hover:text-[var(--foreground)]'}`}>{cat.name}</span>
                <span className="ml-auto text-[10px] text-muted font-bold">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Price Range</h3>
          <div className="space-y-4">
            <div className="h-1.5 w-full bg-[var(--surface-dark)] rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-full bg-primary/20 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium bg-[var(--surface-dark)] px-3 py-1.5 rounded-lg text-muted">$0</div>
              <div className="text-xs font-medium bg-[var(--surface-dark)] px-3 py-1.5 rounded-lg text-muted">$10k+</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Class Filter</h3>
          <div className="flex flex-wrap gap-2">
            {['Limited Edition', 'Popular Selling', 'New Season'].map((tag) => (
               <button key={tag} className="rounded-full bg-[var(--surface-dark)] px-3 py-1.5 text-[10px] font-bold tracking-wider text-muted uppercase hover:text-[var(--foreground)] hover:bg-primary/20 transition-all border border-transparent hover:border-primary/20">
                 {tag}
               </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Colors</h3>
          <div className="flex flex-wrap gap-3">
            {['#6C63FF', '#4A9FFF', '#FF9800', '#EF4444', '#10B981', '#A0A0B0', '#FFFFFF'].map((color, i) => (
              <button 
                key={i} 
                className={`h-6 w-6 rounded-full flex items-center justify-center border-2 border-transparent hover:border-white/40 transition-all`}
                style={{ backgroundColor: color }}
              >
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <button 
                key={size}
                className={`h-10 w-10 flex items-center justify-center rounded-lg text-xs font-bold transition-colors bg-[var(--surface-dark)] text-muted hover:text-[var(--foreground)] hover:bg-primary/20`}
              >
                {size}
              </button>
            ))}
          </div>
          <button className="text-primary text-[10px] font-black uppercase tracking-widest mt-4 hover:underline block">
            + VIEW ALL SIZES
          </button>
        </div>
      </div>
    </>
  );
}
