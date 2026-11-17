import type { Metadata } from "next";
import { Suspense } from "react";
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

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();

  const search = first(params.search)?.trim();
  if (search) query.set("search", search);

  // The client keeps these params in the URL; forward the filter values to
  // the Express API, which does the actual filtering.
  for (const key of ["type", "remote", "category"] as const) {
    const value = first(params[key]);
    if (value) query.set(key, value);
  }

  const jobs = (await getJobsData(query.toString())).map((job, index) =>
    toRecruiterJob(job, index),
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#0a0a0a]">
        <Suspense
          fallback={
            <p className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-500">
              Loading jobs…
            </p>
          }
        >
          <BrowseJobs jobs={jobs} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
