import type { Metadata } from "next";
import { RecruiterApplications } from "@/components/dashboard/recruiter-applications";
import { SeekerApplications } from "@/components/dashboard/seeker-applications";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Applications — HireLoop" };

export default async function ApplicationsPage() {
  const user = await requireRole("seeker", "recruiter");

  const dashboardUser = {
    name: user.name,
    email: user.email,
    image: user.image,
  };

  return user.role === "recruiter" ? (
    <RecruiterApplications user={dashboardUser} />
  ) : (
    <SeekerApplications user={dashboardUser} />
  );
}
