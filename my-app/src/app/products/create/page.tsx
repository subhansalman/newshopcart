"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createProduct } from "./actions";
import { 
  Package, ImagePlus, DollarSign, Tag, Sparkles, 
  ChevronRight, Upload, X, Check
} from "lucide-react";
import toast from "react-hot-toast";
import Footer from "@/components/layout/Footer";

export default function CreateProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (session && session.user?.role !== "SELLER" && session.user?.role !== "ADMIN") {
      router.push("/");
      toast.error("Only sellers or admins can create products");
    }
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) setCategories(data);
        else setCategories([
          { id: "1", name: "The Minimalist" },
          { id: "2", name: "Abstract Edge" },
          { id: "3", name: "Sculptural" },
          { id: "4", name: "Artwork" }
        ]);
      })
      .catch(() => {
        setCategories([
          { id: "1", name: "The Minimalist" },
          { id: "2", name: "Abstract Edge" },
          { id: "3", name: "Sculptural" },
          { id: "4", name: "Artwork" }
        ]);
      });
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createProduct(formData);
      toast.success("Product published to the atelier!");
      router.push("/dashboard/products");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted mb-4">
              <span className="hover:text-primary cursor-pointer transition-colors">Products</span>
              <ChevronRight className="h-2.5 w-2.5" />
              <span className="text-primary">Create</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-white">New Creation</h1>
            <p className="text-muted text-sm max-w-xl leading-relaxed">
              Define the core identity, visual aesthetic, and logistics details of your next masterpiece.
            </p>
          </div>
          <button 
            type="submit" 
            form="product-form" 
            disabled={loading}
            className="rounded-xl bg-primary px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 shrink-0"
          >
            {loading ? "Publishing..." : "Publish Product"}
          </button>
        </div>

        <form id="product-form" onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left - Core Identity & Visuals */}
            <div className="lg:col-span-2 space-y-10">
              {/* Core Identity */}
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Core Identity</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Product Name</label>
                    <input name="title" placeholder="e.g. Midnight Silk Blaze" required
                      className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--surface-dark)] px-4 py-3.5 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-muted/40" />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Category</label>
                      <select name="categoryId" required
                        className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--surface-dark)] px-4 py-3.5 text-sm text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                        <option value="" className="bg-[var(--card-bg)]">Select category</option>
                        {categories.map((c) => (<option key={c.id} value={c.id} className="bg-[var(--card-bg)]">{c.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Tags</label>
                      <div className="relative">
                        <input name="tags" placeholder="premium, trending" 
                          className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--surface-dark)] px-4 py-3.5 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-muted/40" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <span className="bg-primary/20 text-primary text-[9px] font-black uppercase px-2 py-0.5 rounded-sm">HOT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Editorial Description</label>
                    <textarea name="description" rows={5} placeholder="Describe the craftsmanship, materials, and the narrative behind this piece..." required
                      className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--surface-dark)] px-4 py-3.5 text-sm text-white focus:border-primary outline-none transition-all resize-none placeholder:text-muted/40" />
                  </div>
                </div>
              </div>

              {/* Visual Portfolio */}
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <ImagePlus className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Visual Portfolio</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-[var(--card-border)] rounded-2xl p-12 flex flex-col items-center justify-center text-center group hover:border-primary transition-all cursor-pointer bg-[var(--surface-dark)]/50">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Click to Upload</p>
                    <p className="text-xs text-muted max-w-[200px]">Drag and drop your high-resolution product imagery (PNG, JPG up to 10MB)</p>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Manual Image URL</label>
                    <input name="images" placeholder="https://picsum.photos/800"
                      className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--surface-dark)] px-4 py-3.5 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-muted/40" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Pricing, Logistics & AI */}
            <div className="space-y-10">
              {/* Valuation */}
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Valuation</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Base Retail Price (PKR)</label>
                    <div className="relative">
                      <input name="price" type="number" step="0.01" min="1" placeholder="0.00" required
                        className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--surface-dark)] px-4 py-3.5 pl-10 text-sm text-white font-bold focus:border-primary outline-none transition-all" />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold text-sm">$</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics */}
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Logistics</h2>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Stock Quantity</label>
                  <input name="stock" type="number" min="0" defaultValue="10"
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--surface-dark)] px-4 py-3.5 text-sm text-white font-bold focus:border-primary outline-none transition-all" />
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-8 relative overflow-hidden shadow-xl shadow-primary/20">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="h-20 w-20 text-white" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-white">AI Suggestion</h2>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed font-medium">
                    Based on current trends, <span className="font-black underline decoration-white/30 text-white">"Artisan"</span> and <span className="font-black underline decoration-white/30 text-white">"Handcrafted"</span> tags perform 32% better in the current market season.
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Success Probability</span>
                    <span className="text-lg font-black text-white">84%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
