import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "electronics" }, update: {}, create: { name: "Electronics", slug: "electronics" } }),
    prisma.category.upsert({ where: { slug: "clothing" }, update: {}, create: { name: "Clothing", slug: "clothing" } }),
    prisma.category.upsert({ where: { slug: "books" }, update: {}, create: { name: "Books", slug: "books" } }),
    prisma.category.upsert({ where: { slug: "home-kitchen" }, update: {}, create: { name: "Home & Kitchen", slug: "home-kitchen" } }),
    prisma.category.upsert({ where: { slug: "sports" }, update: {}, create: { name: "Sports", slug: "sports" } }),
  ]);
  console.log("✅ Categories created");

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
    { title: "Samsung Galaxy S24 Ultra", description: "Latest Samsung flagship with S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor. Premium titanium build with 6.8-inch Dynamic AMOLED display.", price: 349999, stock: 25, categoryId: categories[0].id, tags: ["samsung", "smartphone", "flagship", "5g"], images: ["https://picsum.photos/seed/s24/600/600", "https://picsum.photos/seed/s24b/600/600"] },
    { title: "iPhone 15 Pro Max", description: "Apple's most powerful iPhone with A17 Pro chip, titanium design, and 48MP camera system. Features USB-C and Action Button.", price: 549999, stock: 15, categoryId: categories[0].id, tags: ["apple", "iphone", "premium", "ios"], images: ["https://picsum.photos/seed/ip15/600/600"] },
    { title: "Sony WH-1000XM5 Headphones", description: "Industry-leading noise canceling headphones with exceptional sound quality. 30-hour battery life and multipoint connection.", price: 84999, stock: 40, categoryId: categories[0].id, tags: ["audio", "headphones", "wireless", "noise-canceling"], images: ["https://picsum.photos/seed/sony5/600/600"] },
    { title: "MacBook Air M3", description: "Supercharged by M3 chip. 15.3-inch Liquid Retina display, 18-hour battery, and fanless design. Perfect for work and creativity.", price: 429999, stock: 10, categoryId: categories[0].id, tags: ["apple", "laptop", "macbook", "m3"], images: ["https://picsum.photos/seed/mbair/600/600"] },
    { title: "JBL Charge 5 Speaker", description: "Portable Bluetooth speaker with powerful JBL Original Pro Sound. IP67 waterproof and dustproof with 20 hours of playtime.", price: 32999, stock: 55, categoryId: categories[0].id, tags: ["speaker", "bluetooth", "portable", "waterproof"], images: ["https://picsum.photos/seed/jbl5/600/600"] },
    { title: "Khaadi Premium Lawn Suit", description: "Three-piece unstitched lawn suit with digital printed shirt, dyed cambric trouser, and chiffon dupatta. Elegant Pakistani fashion.", price: 7499, stock: 100, categoryId: categories[1].id, tags: ["lawn", "khaadi", "women", "summer"], images: ["https://picsum.photos/seed/khaadi/600/600"] },
    { title: "Gul Ahmed Men's Shalwar Kameez", description: "Premium wash and wear fabric shalwar kameez in classic white. Perfect for formal and casual occasions.", price: 4999, stock: 80, categoryId: categories[1].id, tags: ["men", "shalwar-kameez", "formal", "gul-ahmed"], images: ["https://picsum.photos/seed/gulahmed/600/600"] },
    { title: "Sapphire Winter Shawl Collection", description: "Luxurious embroidered shawl with intricate handwork. Premium wool blend for ultimate warmth and style.", price: 12999, stock: 35, categoryId: categories[1].id, tags: ["shawl", "winter", "women", "embroidered"], images: ["https://picsum.photos/seed/sapphire/600/600"] },
    { title: "Nike Air Max 270 - Pakistan Edition", description: "Iconic Air Max with Max Air unit for all-day comfort. Breathable mesh upper with bold colorway inspired by Pakistani flag.", price: 24999, stock: 45, categoryId: categories[1].id, tags: ["nike", "shoes", "sneakers", "sports"], images: ["https://picsum.photos/seed/nike270/600/600"] },
    { title: "J. Junaid Jamshed Premium Kurta", description: "Handcrafted premium kurta with traditional embroidery. Made from finest Egyptian cotton. A statement of Pakistani elegance.", price: 8999, stock: 60, categoryId: categories[1].id, tags: ["kurta", "men", "premium", "junaid-jamshed"], images: ["https://picsum.photos/seed/jj/600/600"] },
    { title: "Peer-e-Kamil by Umera Ahmed", description: "Best-selling Urdu novel exploring themes of faith and spiritual journey. One of the most acclaimed Pakistani literary works.", price: 999, stock: 200, categoryId: categories[2].id, tags: ["urdu", "novel", "bestseller", "spiritual"], images: ["https://picsum.photos/seed/peerkamil/600/600"] },
    { title: "Atomic Habits by James Clear", description: "Bestselling guide to building good habits and breaking bad ones. Practical strategies for everyday life improvement.", price: 1899, stock: 150, categoryId: categories[2].id, tags: ["self-help", "habits", "bestseller", "english"], images: ["https://picsum.photos/seed/atomic/600/600"] },
    { title: "Pakistan Studies Textbook", description: "Comprehensive guide covering Pakistani history, geography, and culture. Essential for students and history enthusiasts.", price: 1299, stock: 75, categoryId: categories[2].id, tags: ["education", "pakistan", "history", "textbook"], images: ["https://picsum.photos/seed/pakstudies/600/600"] },
    { title: "The Alchemist - Urdu Translation", description: "Paulo Coelho's masterpiece translated in Urdu. A magical story about following your dreams and personal legend.", price: 799, stock: 120, categoryId: categories[2].id, tags: ["urdu", "translation", "fiction", "classic"], images: ["https://picsum.photos/seed/alchemist/600/600"] },
    { title: "Learn Python Programming", description: "Complete guide to Python programming from beginner to advanced. Includes practical projects and exercises.", price: 2499, stock: 90, categoryId: categories[2].id, tags: ["programming", "python", "tech", "education"], images: ["https://picsum.photos/seed/python/600/600"] },
    { title: "Dawlance Inverter Microwave Oven", description: "30L capacity microwave with inverter technology. Multiple cooking modes including grill and convection. Energy efficient.", price: 34999, stock: 30, categoryId: categories[3].id, tags: ["microwave", "dawlance", "kitchen", "appliance"], images: ["https://picsum.photos/seed/dawlance/600/600"] },
    { title: "Interwood Coffee Table - Walnut", description: "Solid walnut wood coffee table with modern minimalist design. Handcrafted in Pakistan with premium finish.", price: 28999, stock: 15, categoryId: categories[3].id, tags: ["furniture", "table", "walnut", "interwood"], images: ["https://picsum.photos/seed/interwood/600/600"] },
    { title: "PEL Water Dispenser", description: "Hot, cold, and normal water dispenser with refrigerator cabinet. Energy-saving compressor cooling technology.", price: 19999, stock: 25, categoryId: categories[3].id, tags: ["dispenser", "pel", "water", "appliance"], images: ["https://picsum.photos/seed/pel/600/600"] },
    { title: "Prestige Non-Stick Cookware Set", description: "7-piece non-stick cookware set with heat-resistant handles. PFOA-free coating for healthy cooking.", price: 8999, stock: 50, categoryId: categories[3].id, tags: ["cookware", "non-stick", "kitchen", "set"], images: ["https://picsum.photos/seed/prestige/600/600"] },
    { title: "Handmade Multani Pottery Set", description: "Authentic blue pottery from Multan. Set includes 6 plates and 6 bowls. Traditional Pakistani craftsmanship.", price: 5999, stock: 20, categoryId: categories[3].id, tags: ["pottery", "handmade", "multan", "traditional"], images: ["https://picsum.photos/seed/pottery/600/600"] },
    { title: "CA Cricket Bat - Plus 15000", description: "Professional grade English willow cricket bat. Used by international cricketers. Premium handle with Sarawak cane.", price: 14999, stock: 35, categoryId: categories[4].id, tags: ["cricket", "bat", "ca", "professional"], images: ["https://picsum.photos/seed/cabat/600/600"] },
    { title: "Yonex Badminton Racket Astrox 88D", description: "Professional badminton racket with Rotational Generator System. Perfect for powerful smashes and quick drives.", price: 29999, stock: 20, categoryId: categories[4].id, tags: ["badminton", "yonex", "racket", "professional"], images: ["https://picsum.photos/seed/yonex/600/600"] },
    { title: "Adidas Football - Al Rihla", description: "Official match ball with connected ball technology. High-quality thermally bonded panels for consistent performance.", price: 7999, stock: 65, categoryId: categories[4].id, tags: ["football", "adidas", "match-ball", "sports"], images: ["https://picsum.photos/seed/football/600/600"] },
    { title: "Home Gym Multi-Station", description: "Complete home gym with lat pulldown, chest press, leg extension, and more. Supports up to 150kg weight stack.", price: 89999, stock: 8, categoryId: categories[4].id, tags: ["gym", "fitness", "home-gym", "equipment"], images: ["https://picsum.photos/seed/homegym/600/600"] },
    { title: "Yoga Mat Premium - 6mm", description: "Extra thick non-slip yoga mat with alignment lines. Made from eco-friendly TPE material. Includes carry strap.", price: 3499, stock: 100, categoryId: categories[4].id, tags: ["yoga", "mat", "fitness", "eco-friendly"], images: ["https://picsum.photos/seed/yogamat/600/600"] },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: { ...product, sellerId: seller.id },
    });
  }
  console.log(`✅ ${products.length} products created`);

  // Add some reviews
  const allProducts = await prisma.product.findMany({ take: 10 });
  for (const product of allProducts) {
    await prisma.review.create({
      data: {
        rating: Math.floor(Math.random() * 2) + 4,
        comment: ["Great product!", "Excellent quality, fast delivery.", "Very satisfied with my purchase.", "Good value for money.", "Highly recommended!"][Math.floor(Math.random() * 5)],
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
