import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClientLayout from "@/components/dashboard/DashboardClientLayout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  // if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/dashboard");
  // if (session?.user.role !== "SELLER" && session.user.role !== "ADMIN")
  // redirect("");

  return (
    <DashboardClientLayout session={session}>{children}</DashboardClientLayout>
  );
}
