"use client";

import { JobForm } from "@/components/dashboard/job-form";
import { RecruiterLayout } from "@/components/dashboard/layouts";
import { type RecruiterJob } from "@/components/dashboard/recruiter-jobs-data";
import { type DashboardUser } from "@/components/dashboard/shell";

export function RecruiterAddJob({ user }: { user: DashboardUser }) {
  return (
    <RecruiterLayout user={user} hideTopbar>
      <div className="mx-auto max-w-6xl">
        <JobForm mode="create" />
      </div>
    </RecruiterLayout>
  );
}

export function RecruiterUpdateJob({
  user,
  job,
}: {
  user: DashboardUser;
  job: RecruiterJob;
}) {
  return (
    <RecruiterLayout user={user} hideTopbar>
      <div className="mx-auto max-w-6xl">
        <JobForm mode="update" job={job} />
      </div>
    </RecruiterLayout>
  );
}
