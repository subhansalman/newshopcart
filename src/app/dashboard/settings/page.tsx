import { Settings } from "lucide-react";

export const metadata = { title: "Settings | Digital Atelier" };

export default function SettingsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted">Manage your account preferences</p>
        </div>
      </div>
      
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-12 flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Settings className="h-8 w-8 text-primary opacity-50" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
        <p className="text-muted max-w-md">
          Account settings and profile management tools are currently under development and will be available in the next major update.
        </p>
      </div>
    </div>
  );
}
