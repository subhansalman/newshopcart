import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 skeleton rounded" />
        <div className="h-4 w-72 skeleton rounded" />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 space-y-3">
              <div className="h-4 w-20 skeleton rounded" />
              <div className="h-9 w-full skeleton rounded" />
              <div className="h-9 w-full skeleton rounded" />
              <div className="h-9 w-full skeleton rounded" />
            </div>
          ))}
        </aside>
        <div className="flex-1">
          <ProductGridSkeleton count={9} />
        </div>
      </div>
    </div>
  );
}
