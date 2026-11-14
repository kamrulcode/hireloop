import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminJobs } from "@/components/dashboard/admin-jobs";
import { SeekerJobs } from "@/components/dashboard/seeker-jobs";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Jobs — HireLoop" };

export default async function JobsPage() {
  const user = await requireRole("seeker", "admin", "recruiter");
  if (user.role === "recruiter") redirect("/manage-jobs");

  const dashboardUser = {
    name: user.name,
    email: user.email,
    image: user.image,
  };

  return user.role === "admin" ? (
    <AdminJobs user={dashboardUser} />
  ) : (
    <SeekerJobs user={dashboardUser} />
  );
}
