interface ProductBase {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  tags: string[];
  categoryId: string;
  sellerId: string;
  createdAt: Date;
}

interface CategoryBase {
  id: string;
  name: string;
  slug: string;
}

export type ProductWithCategory = ProductBase & { category: CategoryBase };

export function getRecommendations(
  purchasedCategories: string[],
  purchasedTags: string[],
  products: ProductWithCategory[]
): ProductWithCategory[] {
  const scored = products
    .filter((p) => p.isActive && p.stock > 0)
    .map((product) => {
      let score = 0;

      if (purchasedCategories.includes(product.category.name)) {
        score += 4;
      }

      const tagMatches = product.tags.filter((t) =>
        purchasedTags.some(
          (pt) => pt.toLowerCase() === t.toLowerCase()
        )
      ).length;
      score += tagMatches * 2;

      const ageInDays =
        (Date.now() - product.createdAt.getTime()) / 86_400_000;
      if (ageInDays < 7) score += 1;

      return { ...product, score };
    });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ score: _score, ...product }) => product) as ProductWithCategory[];
}
