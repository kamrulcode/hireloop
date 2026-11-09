import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/dashboard/admin";
import { RecruiterDashboard } from "@/components/dashboard/recruiter";
import { SeekerDashboard } from "@/components/dashboard/seeker";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard — HireLoop",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = session.user;
  const role =
    (user as { role?: string }).role ?? "seeker";
  const dashboardUser = { name: user.name, image: user.image };

  if (role === "admin") return <AdminDashboard user={dashboardUser} />;
  if (role === "recruiter") return <RecruiterDashboard user={dashboardUser} />;
  return <SeekerDashboard user={dashboardUser} />;
}
