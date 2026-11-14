import type { Metadata } from "next";
import { AdminSettings } from "@/components/dashboard/admin-settings";
import { RecruiterSettings } from "@/components/dashboard/recruiter-settings";
import { SeekerSettings } from "@/components/dashboard/seeker-settings";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Settings — HireLoop" };

export default async function SettingsPage() {
  const user = await requireUser();
  const dashboardUser = {
    name: user.name,
    email: user.email,
    image: user.image,
  };

  if (user.role === "admin") {
    return <AdminSettings user={dashboardUser} />;
  }
  if (user.role === "recruiter") {
    return <RecruiterSettings user={dashboardUser} />;
  }
  return <SeekerSettings user={dashboardUser} />;
}
