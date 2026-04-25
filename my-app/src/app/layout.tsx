import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ShopCart — AI-Powered E-Commerce Marketplace",
    template: "%s | ShopCart",
  },
  description:
    "Discover curated products, shop with confidence, and enjoy AI-powered recommendations on ShopCart.",
  keywords: ["ecommerce", "marketplace", "shopping", "AI recommendations"],
  openGraph: {
    title: "ShopCart — AI-Powered E-Commerce Marketplace",
    description: "Discover curated products with AI-powered recommendations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
