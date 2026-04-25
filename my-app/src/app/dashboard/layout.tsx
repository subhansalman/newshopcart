import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/dashboard");
  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <DashboardSidebar userName={session.user.name || "Seller"} userImage={session.user.image} />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </div>
    </div>
  );
}
