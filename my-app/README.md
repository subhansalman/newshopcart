# ShopCart — AI-Powered E-Commerce Marketplace

A full-stack e-commerce marketplace built with Next.js, featuring multi-role authentication, AI-powered recommendations, and a premium seller dashboard.

## Features

- 🔐 **Multi-role Auth** — Buyer / Seller / Admin via NextAuth.js (Google OAuth + Credentials)
- 🛍️ **Product Listings** — Server-rendered with search, category filters, price range, and pagination
- 🛒 **Persistent Cart** — Zustand with localStorage persistence
- 💳 **Full Checkout** — Shipping form, payment selection, order creation with stock verification
- 📦 **Order Tracking** — Visual status tracker (Pending → Paid → Processing → Shipped → Delivered)
- 🤖 **AI Recommendations** — Category & tag-based scoring algorithm
- 📊 **Seller Dashboard** — Revenue stats, curation analytics, order management
- 🌙 **Dark Mode** — Toggle with system preference detection
- 📱 **Fully Responsive** — Mobile-first design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v4 |
| Cart State | Zustand + persist |
| Validation | Zod |
| Icons | Lucide React |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your DATABASE_URL, NEXTAUTH_SECRET, etc.

# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed

# Start development server
npm run dev
```

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/shopcart
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Default Users (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopcart.pk | password123 |
| Seller | seller@shopcart.pk | password123 |
| Buyer | buyer@shopcart.pk | password123 |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes (auth, categories, recommendations)
│   ├── auth/         # Authentication pages
│   ├── cart/         # Shopping cart (client component)
│   ├── checkout/     # Checkout with server actions
│   ├── dashboard/    # Seller dashboard (protected)
│   ├── orders/       # Order history & detail
│   └── products/     # Product listing, detail, create
├── components/       # React components
│   ├── dashboard/    # Dashboard-specific components
│   ├── layout/       # Navbar, Footer
│   ├── products/     # Product cards, filters, skeletons
│   └── providers/    # Context providers
├── lib/              # Utilities (prisma, auth, validators, recommendations)
├── store/            # Zustand cart store
└── types/            # TypeScript type declarations
```

## Deployment

Optimized for Vercel deployment:

```bash
npm run build
```

## License

MIT
