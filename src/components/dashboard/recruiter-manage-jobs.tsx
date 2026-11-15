import Link from "next/link";
import {
  Cloud,
  Code2,
  Cog,
  Globe2,
  MapPin,
  Megaphone,
  Pencil,
  PenTool,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";

import { RecruiterLayout } from "@/components/dashboard/layouts";
import {
  type RecruiterJob,
  toRecruiterJob,
} from "@/components/dashboard/recruiter-jobs-data";
import { type DashboardUser } from "@/components/dashboard/shell";
import {
  Breadcrumb,
  StatusBadge,
  btnIndigo,
  card,
  td,
  th,
} from "@/components/dashboard/ui";

import { cn } from "cn";
import { getJobsData } from "@/lib/actions/getjobs";
import { DeleteJob } from "./recruiter-delete-job";
import { ViewDropdown } from "./ViewDropdown";

const jobIcons: Record<
  RecruiterJob["icon"],
  { icon: LucideIcon; className: string }
> = {
  engineering: { icon: Code2, className: "text-violet-400" },
  design: { icon: PenTool, className: "text-orange-400" },
  infrastructure: { icon: Cloud, className: "text-sky-400" },
  marketing: { icon: Megaphone, className: "text-red-400" },
  quality: { icon: Cog, className: "text-yellow-400" },
};

export async function RecruiterManageJobs({ user }: { user: DashboardUser }) {
  const jobs = (await getJobsData()).map(toRecruiterJob);

  return (
    <RecruiterLayout
      user={user}
      searchPlaceholder="Search job posts..."
      hideTopbar
    >
      <div className="mx-auto max-w-6xl">
        <Breadcrumb
          items={[
            { label: "Manage Jobs", href: "/manage-jobs" },
            "Job Listings & Postings",
          ]}
        />

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Manage Job Posts
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>
          <Link href="/add-new-job" className={btnIndigo}>
            <Plus className="size-4" />
            New Job Post
          </Link>
        </div>

        <div className={cn(card, "mt-6 overflow-x-auto bg-[#0c0c0c]")}>
          <table className="w-full min-w-275 text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[#101010]">
                <th className={th}>Job Title & Dept</th>
                <th className={th}>Company & Location</th>
                <th className={th}>Type</th>
                <th className={th}>Compensation</th>
                <th className={th}>Applicants</th>
                <th className={th}>Status</th>
                <th className={th}>Deadline</th>
                <th className={cn(th, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className={cn(td, "py-12 text-center text-zinc-400")}
                  >
                    No jobs posted yet.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => {
                  const meta = jobIcons[job.icon];
                  const Icon = meta.icon;
                  return (
                    <tr
                      key={job.id}
                      className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/2"
                    >
                      <td className={cn(td, "py-5")}>
                        <span className="flex items-center gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-[#171717]">
                            <Icon className={cn("size-5", meta.className)} />
                          </span>
                          <span>
                            <span className="block font-medium text-white">
                              {job.title}
                            </span>
                            <span
                              className={cn("block text-xs", meta.className)}
                            >
                              {job.department}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className={cn(td, "py-5")}>
                        <span className="block text-zinc-200">
                          {job.company}
                        </span>
                        <span className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                          {job.remote ? (
                            <Globe2 className="size-3.5 shrink-0" />
                          ) : (
                            <MapPin className="size-3.5 shrink-0" />
                          )}
                          {job.location}
                        </span>
                      </td>
                      <td className={cn(td, "py-5")}>
                        <span className="inline-block rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1 text-xs whitespace-nowrap text-zinc-300">
                          {job.type}
                        </span>
                      </td>
                      <td
                        className={cn(
                          td,
                          "py-5 whitespace-nowrap text-zinc-200",
                        )}
                      >
                        {job.pay}
                      </td>
                      <td className={cn(td, "py-5")}>
                        <span className="flex items-center gap-2 whitespace-nowrap text-zinc-300">
                          <Users className="size-4 text-zinc-500" />
                          {job.applicants} Candidates
                        </span>
                      </td>
                      <td className={cn(td, "py-5")}>
                        <StatusBadge
                          tone={job.status === "Active" ? "green" : "gray"}
                        >
                          {job.status}
                        </StatusBadge>
                      </td>
                      <td className={cn(td, "py-5 whitespace-nowrap")}>
                        <span className="block text-zinc-200">
                          {job.deadline}
                        </span>
                        <span className="block text-xs text-zinc-500">
                          {job.postedAgo}
                        </span>
                      </td>
                      <td className={cn(td, "py-5")}>
                        <span className="flex items-center justify-end gap-2">
                          <Link
                            href={`/manage-jobs/${job.id}?mode=edit`}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#4f46e5] px-3 text-sm font-medium text-white transition-colors hover:bg-[#5b5bf0]"
                          >
                            <Pencil className="size-3.5" />
                            Update
                          </Link>

                          <DeleteJob job={job} />

                          <ViewDropdown job={job} />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </RecruiterLayout>
  );
}
