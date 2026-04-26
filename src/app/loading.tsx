import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero skeleton */}
      <div className="mb-16 rounded-3xl bg-[var(--sidebar-bg)] p-12">
        <div className="max-w-xl space-y-4">
          <div className="h-4 w-32 skeleton rounded" />
          <div className="h-12 w-3/4 skeleton rounded" />
          <div className="h-12 w-1/2 skeleton rounded" />
          <div className="h-5 w-full skeleton rounded" />
          <div className="h-5 w-2/3 skeleton rounded" />
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-36 skeleton rounded-full" />
            <div className="h-12 w-36 skeleton rounded-full" />
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="mb-16">
        <div className="text-center mb-8 space-y-3">
          <div className="h-8 w-48 skeleton rounded mx-auto" />
          <div className="h-4 w-64 skeleton rounded mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-6 space-y-3">
              <div className="mx-auto h-14 w-14 skeleton rounded-xl" />
              <div className="h-4 w-20 skeleton rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Products skeleton */}
      <div className="mb-8 space-y-3">
        <div className="h-8 w-48 skeleton rounded" />
        <div className="h-4 w-64 skeleton rounded" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
