import type { Metadata } from "next";
import { BrowseJobs } from "@/components/landing/browse-jobs-client";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { toRecruiterJob } from "@/components/dashboard/recruiter-jobs-data";
import { getJobsData } from "@/lib/actions/getjobs";

export const metadata: Metadata = {
  title: "Browse Jobs — HireLoop",
  description:
    "Browse every open role on HireLoop. Filter by job type and search by title, company, or keyword.",
};

export default async function BrowseJobsPage() {
  // The API has no search/filter support, so the whole list is fetched once
  // and the client component filters it in place.
  const jobs = (await getJobsData()).map((job, index) =>
    toRecruiterJob(job, index),
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#0a0a0a]">
        <BrowseJobs jobs={jobs} />
      </main>
      <Footer />
    </>
  );
}
