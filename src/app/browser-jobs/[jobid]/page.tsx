import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  toRecruiterJob,
} from "@/components/dashboard/recruiter-jobs-data";
import { BrowseJobDetail } from "@/components/landing/browse-job-detail";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { getJobById } from "@/lib/actions/getjobs";

export const metadata: Metadata = {
  title: "Job Details — HireLoop",
  description: "Read the full description and requirements for this job.",
};

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ jobid: string }>;
}) {
  const { jobid } = await params;

  // GET /jobs/:id returns one document (or 404/400, which become null).
  const document = await getJobById(jobid);
  if (!document) notFound();

  const job = toRecruiterJob(document);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#0a0a0a]">
        <BrowseJobDetail job={job} />
      </main>
      <Footer />
    </>
  );
}
