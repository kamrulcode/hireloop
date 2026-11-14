"use client";

import {
  Bookmark,
  Boxes,
  Hexagon,
  Infinity as InfinityIcon,
  MapPin,
  Search,
  Triangle,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { SeekerLayout } from "@/components/dashboard/layouts";
import { type DashboardUser } from "@/components/dashboard/shell";
import {
  PageHeader,
  SelectBox,
  btnPrimary,
  card,
} from "@/components/dashboard/ui";
import { cn } from "cn";

type Job = {
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  logo: LucideIcon;
};

const jobs: Job[] = [
  {
    title: "Senior Product Designer",
    company: "TechFlow",
    location: "San Francisco, CA (Hybrid)",
    salary: "$160k - $200k + Equity",
    type: "Full-time",
    posted: "2 hours ago",
    logo: Hexagon,
  },
  {
    title: "Frontend Engineer",
    company: "Vercel",
    location: "Remote, Global",
    salary: "$140k - $180k",
    type: "Full-time",
    posted: "5 hours ago",
    logo: Triangle,
  },
  {
    title: "Staff UX Researcher",
    company: "Linear",
    location: "New York, NY (On-site)",
    salary: "$180k - $220k",
    type: "Full-time",
    posted: "1 day ago",
    logo: Boxes,
  },
  {
    title: "Full Stack Developer",
    company: "Meta",
    location: "Menlo Park, CA (Hybrid)",
    salary: "$150k - $210k + Bonus",
    type: "Contract",
    posted: "1 day ago",
    logo: InfinityIcon,
  },
  {
    title: "Design Systems Lead",
    company: "Spotify",
    location: "Remote, USA",
    salary: "$170k - $205k",
    type: "Full-time",
    posted: "3 days ago",
    logo: Boxes,
  },
];

export function SeekerJobs({ user }: { user: DashboardUser }) {
  return (
    <SeekerLayout
      user={user}
      searchPlaceholder="Search jobs, companies, or skills..."
    >
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Find Your Next Role"
          description="Browse hand-picked opportunities from companies hiring right now."
        />

        <div
          className={cn(
            card,
            "mt-6 flex flex-col gap-3 p-4 lg:flex-row lg:items-center",
          )}
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              placeholder="Job title, company, or keyword..."
              aria-label="Search jobs"
              className="h-10 w-full rounded-lg border border-white/10 bg-[#141414] pr-3 pl-9 text-sm text-white outline-none placeholder:text-zinc-500 focus-visible:border-white/30"
            />
          </div>
          <SelectBox
            label="Location"
            options={["Any Location", "Remote", "San Francisco, CA", "New York, NY"]}
            className="lg:w-48"
          />
          <SelectBox
            label="Job type"
            options={["Any Type", "Full-time", "Contract", "Internship"]}
            className="lg:w-40"
          />
          <button type="button" className={btnPrimary}>
            Search
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Recommended for you
          </h2>
          <p className="text-sm text-zinc-500">248 jobs found</p>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {jobs.map((job) => (
            <div
              key={job.title}
              className={cn(
                card,
                "flex flex-col gap-5 p-6 lg:flex-row lg:items-center",
              )}
            >
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#141414]">
                  <job.logo className="size-5 text-zinc-300" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">
                      {job.title}
                    </h3>
                    <span className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
                      {job.company}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-zinc-300">
                      <MapPin className="size-3.5 text-zinc-500" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-zinc-300">
                      <Wallet className="size-3.5 text-zinc-500" />
                      {job.salary}
                    </span>
                    <span className="inline-flex items-center rounded-md border border-white/10 px-2.5 py-1 text-zinc-300">
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 lg:ml-auto">
                <p className="text-xs text-zinc-500">{job.posted}</p>
                <button
                  type="button"
                  aria-label={`Save ${job.title}`}
                  className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Bookmark className="size-4" />
                </button>
                <button
                  type="button"
                  className="h-9 rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SeekerLayout>
  );
}
