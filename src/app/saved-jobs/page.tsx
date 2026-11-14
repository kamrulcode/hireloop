import type { Metadata } from "next";
import { SeekerSavedJobs } from "@/components/dashboard/seeker-saved-jobs";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Saved Jobs — HireLoop" };

export default async function SavedJobsPage() {
  const user = await requireRole("seeker");
  return (
    <SeekerSavedJobs
      user={{ name: user.name, email: user.email, image: user.image }}
    />
  );
}
