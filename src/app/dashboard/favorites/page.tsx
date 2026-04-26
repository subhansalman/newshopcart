import { Star } from "lucide-react";

export const metadata = { title: "Favorites | Digital Atelier" };

export default function FavoritesPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Star className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Favorites</h1>
          <p className="text-sm text-muted">Your curated list of saved products</p>
        </div>
      </div>
      
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-12 flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Star className="h-8 w-8 text-primary opacity-50" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
        <p className="text-muted max-w-md">
          You haven't saved any products to your favorites list yet. Explore the marketplace and click the heart icon on items you love.
        </p>
      </div>
    </div>
  );
}
