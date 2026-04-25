"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

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
  const [search, setSearch] = useState(currentQ || "");
  const [minPrice, setMinPrice] = useState(currentMinPrice || "");
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice || "");
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
    });
    return `/products?${params.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ q: search || undefined, page: undefined }));
  };

  const handlePriceFilter = () => {
    router.push(
      buildUrl({
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        page: undefined,
      })
    );
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

      <div className={`space-y-6 ${mobileOpen ? "block" : "hidden"} lg:block`}>
        {/* Search */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
          <h3 className="text-sm font-semibold mb-3">Search</h3>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 pl-9 text-sm"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </form>
        </div>

        {/* Categories */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
          <h3 className="text-sm font-semibold mb-3">Categories</h3>
          <div className="space-y-1">
            <button
              onClick={() => router.push(buildUrl({ category: undefined, page: undefined }))}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                !currentCategory
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-[var(--badge-bg)]"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() =>
                  router.push(buildUrl({ category: cat.name, page: undefined }))
                }
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  currentCategory === cat.name
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-[var(--badge-bg)]"
                }`}
              >
                {cat.name}
                <span className="text-xs text-muted">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
          <h3 className="text-sm font-semibold mb-3">Price Range</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handlePriceFilter}
            className="w-full rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            Apply Price Filter
          </button>
        </div>

        {/* Sort */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
          <h3 className="text-sm font-semibold mb-3">Sort By</h3>
          <div className="space-y-1">
            {[
              { label: "Newest First", value: "newest" },
              { label: "Price: Low to High", value: "price_asc" },
              { label: "Price: High to Low", value: "price_desc" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  router.push(buildUrl({ sort: opt.value, page: undefined }))
                }
                className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                  currentSort === opt.value || (!currentSort && opt.value === "newest")
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-[var(--badge-bg)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
