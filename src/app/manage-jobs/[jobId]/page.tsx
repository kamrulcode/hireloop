import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecruiterUpdateJob } from "@/components/dashboard/recruiter-job-editor";
import { toRecruiterJob } from "@/components/dashboard/recruiter-jobs-data";
import { getJobById } from "@/lib/actions/getjobs";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Update Job Post — HireLoop" };

export default async function UpdateJobPage({
  params,
}: {
  // In this Next.js version `params` is a Promise, so it must be awaited.
  params: Promise<{ jobId: string }>;
}) {
  const user = await requireRole("recruiter");

  const { jobId } = await params;
  const jobDocument = await getJobById(jobId);

  // No job with that id (or it was deleted) → show the 404 page.
  if (!jobDocument) notFound();

  return (
    <RecruiterUpdateJob
      user={{ name: user.name, email: user.email, image: user.image }}
      job={toRecruiterJob(jobDocument)}
    />
  );
}
