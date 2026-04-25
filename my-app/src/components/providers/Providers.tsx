"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--toast-bg)",
              color: "var(--toast-text)",
              borderRadius: "12px",
              border: "1px solid var(--toast-border)",
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
