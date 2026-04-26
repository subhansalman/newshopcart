import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Atelier ShopCart...");

  // Categories matching the Footer
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "the-minimalist" }, update: {}, create: { name: "The Minimalist", slug: "the-minimalist" } }),
    prisma.category.upsert({ where: { slug: "abstract-edge" }, update: {}, create: { name: "Abstract Edge", slug: "abstract-edge" } }),
    prisma.category.upsert({ where: { slug: "sculptural" }, update: {}, create: { name: "Sculptural", slug: "sculptural" } }),
    prisma.category.upsert({ where: { slug: "artwork" }, update: {}, create: { name: "Artwork", slug: "artwork" } }),
  ]);
  console.log("✅ Atelier Categories created");

  // Users
  const hashedPassword = await bcrypt.hash("password123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@shopcart.pk" }, update: {},
    create: { name: "Admin User", email: "admin@shopcart.pk", password: hashedPassword, role: "ADMIN" },
  });
  const seller = await prisma.user.upsert({
    where: { email: "seller@shopcart.pk" }, update: {},
    create: { name: "Ali Khan Store", email: "seller@shopcart.pk", password: hashedPassword, role: "SELLER" },
  });
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@shopcart.pk" }, update: {},
    create: { name: "Ahmed Buyer", email: "buyer@shopcart.pk", password: hashedPassword, role: "BUYER" },
  });
  console.log("✅ Users created");

  // Products
  const products = [
    { title: "Ambar Craftsman Sculptural Vessel", description: "A hand-finished ceramic masterpiece exploring the boundaries of form and shadow. This vessel features a rich tan glaze with a slightly textured surface, perfect for minimalist spaces.", price: 14000, stock: 5, categoryId: categories[2].id, tags: ["ceramic", "sculptural", "tan", "limited"], images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1200"] },
    { title: "Monochrome Void Canvas", description: "An abstract exploration of negative space and texture. This large-scale piece uses layered pigments to create a sense of infinite depth.", price: 42000, stock: 2, categoryId: categories[3].id, tags: ["art", "abstract", "monochrome", "premium"], images: ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200"] },
    { title: "Ether Silk Lounge Set", description: "Crafted from the finest mulberry silk, this set combines extreme comfort with a sophisticated architectural silhouette.", price: 28000, stock: 12, categoryId: categories[0].id, tags: ["silk", "minimalist", "luxury", "apparel"], images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200"] },
    { title: "Geometric Shadow Table", description: "A functional sculpture made from matte black steel. The interplay of light and shadow creates a shifting visual experience.", price: 85000, stock: 3, categoryId: categories[1].id, tags: ["furniture", "industrial", "black", "geometric"], images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200"] },
    { title: "Celestial Glass Pendant", description: "Hand-blown glass orb with infused gold leaf, creating a soft, warm glow that mimics a distant nebula.", price: 19500, stock: 8, categoryId: categories[1].id, tags: ["lighting", "glass", "gold", "artisan"], images: ["https://images.unsplash.com/photo-1543198126-a8ad8e47fb21?q=80&w=1200"] },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: { ...product, sellerId: seller.id },
    });
  }
  console.log(`✅ ${products.length} Atelier products created`);

  // Add some reviews
  const allProducts = await prisma.product.findMany();
  for (const product of allProducts) {
    await prisma.review.create({
      data: {
        rating: 5,
        comment: "Exquisite craftsmanship. Truly a centerpiece.",
        userId: buyer.id,
        productId: product.id,
      },
    });
  }
  console.log("✅ Reviews created");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
