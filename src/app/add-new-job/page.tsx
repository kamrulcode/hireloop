import type { Metadata } from "next";
import { RecruiterAddJob } from "@/components/dashboard/recruiter-job-editor";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Post a New Job — HireLoop" };

export default async function AddNewJobPage() {
  const user = await requireRole("recruiter");
  return (
    <RecruiterAddJob
      user={{ name: user.name, email: user.email, image: user.image }}
    />
  );
}
