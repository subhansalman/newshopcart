"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { Menu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardClientLayoutProps {
  children: React.ReactNode;
  session: {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  } | null;
}

export default function DashboardClientLayout({
  children,
  session,
}: DashboardClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = session?.user ?? { id: "", name: "Guest", email: null, image: null, role: "ADMIN" };

  return (
    <div className="flex min-h-[calc(100vh-64px)] relative">
      <DashboardSidebar
        userName={user.name || "User"}
        userImage={user.image}
        userRole={user.role || "ADMIN"}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-[var(--background)]">
        {/* Mobile Header */}
        <header className="flex h-14 items-center border-b border-[var(--card-border)] bg-[var(--card-bg)] px-5 lg:hidden gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={cn(
              "p-2 -ml-2 text-foreground/60 hover:text-foreground transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl",
            )}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-sm text-foreground">
              {user.role === "ADMIN" ? "Admin Portal" : "Digital Atelier"}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
