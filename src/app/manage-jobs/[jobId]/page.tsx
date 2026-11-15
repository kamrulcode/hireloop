import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecruiterUpdateJob } from "@/components/dashboard/recruiter-job-editor";
import { toRecruiterJob } from "@/components/dashboard/recruiter-jobs-data";
import { getJobById } from "@/lib/actions/getjobs";
import { requireRole } from "@/lib/session";
import { RecruiterViewJob } from "@/components/dashboard/recruiter-view-job";

export const metadata: Metadata = { title: "Update Job Post — HireLoop" };

interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
  searchParams: Promise<{
    mode?: string;
  }>;
}

export default async function UpdateJobPage({
  params,
  searchParams,
}: PageProps) {
  const user = await requireRole("recruiter");

  const { jobId } = await params;
  const { mode } = await searchParams;
  const jobDocument = await getJobById(jobId);

  // No job with that id (or it was deleted) → show the 404 page.
  if (!jobDocument) notFound();

  if (mode === "view") {
    return (
      <RecruiterViewJob
        user={{ name: user.name, email: user.email, image: user.image }}
        job={toRecruiterJob(jobDocument)}
      />
    );
  }

  return (
    <RecruiterUpdateJob
      user={{ name: user.name, email: user.email, image: user.image }}
      job={toRecruiterJob(jobDocument)}
    />
  );
}
