import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRecommendations } from "@/lib/recommendations";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  try {
    if (!userId) {
      const products = await prisma.product.findMany({
        where: { isActive: true, stock: { gt: 0 } },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      });
      return NextResponse.json(products);
    }

    const userOrders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: { include: { category: true } } } } },
    });

    const purchasedCategories = [...new Set(userOrders.flatMap((o) => o.items.map((i) => i.product.category.name)))];
    const purchasedTags = [...new Set(userOrders.flatMap((o) => o.items.flatMap((i) => i.product.tags)))];
    const purchasedIds = new Set(userOrders.flatMap((o) => o.items.map((i) => i.productId)));

    const allProducts = await prisma.product.findMany({
      where: { isActive: true, stock: { gt: 0 }, id: { notIn: [...purchasedIds] } },
      include: { category: true },
    });

    const recommendations = getRecommendations(purchasedCategories, purchasedTags, allProducts);
    return NextResponse.json(recommendations);
  } catch {
    return NextResponse.json([]);
  }
}
