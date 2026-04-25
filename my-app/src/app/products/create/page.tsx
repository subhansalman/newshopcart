"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createProduct } from "./actions";
import { Package, ImagePlus, DollarSign, Tag, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Footer from "@/components/layout/Footer";

export default function CreateProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (session && session.user?.role !== "SELLER") {
      router.push("/");
      toast.error("Only sellers can create products");
    }
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createProduct(formData);
      toast.success("Product created!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Products &gt; Create</p>
            <h1 className="text-3xl font-bold">New Creation</h1>
            <p className="text-muted">Define the core identity, visual aesthetic, and logistics details of your next masterpiece.</p>
          </div>
          <button type="submit" form="product-form" disabled={loading}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50">
            {loading ? "Publishing..." : "Publish Product"}
          </button>
        </div>

        <form id="product-form" onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Core Identity */}
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Core Identity</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Product Name</label>
                    <input name="title" placeholder="e.g. Midnight Silk Blaze" required
                      className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Category</label>
                      <select name="categoryId" required
                        className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm">
                        <option value="">Select category</option>
                        {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Tags (comma separated)</label>
                      <input name="tags" placeholder="premium, trending" className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Editorial Description</label>
                    <textarea name="description" rows={4} placeholder="Describe the craftsmanship and narrative..." required
                      className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm resize-none" />
                  </div>
                </div>
              </div>

              {/* Visual Portfolio */}
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                <div className="flex items-center gap-2 mb-6">
                  <ImagePlus className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Visual Portfolio</h2>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Image URLs (comma separated)</label>
                  <input name="images" placeholder="https://picsum.photos/400, https://picsum.photos/401"
                    className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm" />
                  <p className="text-xs text-muted mt-1">Use picsum.photos or any image hosting URL</p>
                </div>
              </div>
            </div>

            {/* Right - Pricing & Logistics */}
            <div className="space-y-8">
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Valuation</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Base Retail Price (PKR)</label>
                    <input name="price" type="number" step="0.01" min="1" placeholder="0.00" required
                      className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Logistics</h2>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Stock Quantity</label>
                  <input name="stock" type="number" min="0" defaultValue="10"
                    className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm" />
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-primary">AI Suggestion</h2>
                </div>
                <p className="text-sm text-muted">Based on current trends, &quot;Artisan&quot; and &quot;Handcrafted&quot; tags perform 32% better in the current market season.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
