import type { Metadata } from "next";
import { RecruiterManageJobs } from "@/components/dashboard/recruiter-manage-jobs";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Manage Jobs — HireLoop" };

export default async function ManageJobsPage() {
  const user = await requireRole("recruiter");
  return (
    <RecruiterManageJobs
      user={{ name: user.name, email: user.email, image: user.image }}
    />
  );
}
