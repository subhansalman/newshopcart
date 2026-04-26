export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden"
        >
          <div className="aspect-square skeleton" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-16 skeleton" />
            <div className="h-4 w-3/4 skeleton" />
            <div className="h-4 w-1/2 skeleton" />
            <div className="flex justify-between items-center">
              <div className="h-5 w-20 skeleton" />
              <div className="h-4 w-12 skeleton" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
