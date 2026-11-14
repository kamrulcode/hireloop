"use client";

import {
  Bookmark,
  Boxes,
  ChevronDown,
  Clock,
  Hexagon,
  Infinity as InfinityIcon,
  Leaf,
  MapPin,
  Triangle,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { SeekerLayout } from "@/components/dashboard/layouts";
import { type DashboardUser } from "@/components/dashboard/shell";
import { SelectBox, card } from "@/components/dashboard/ui";
import { cn } from "cn";

const tabs = [
  { label: "All Saved", count: null },
  { label: "Design", count: 8 },
  { label: "Engineering", count: 12 },
  { label: "Product", count: 4 },
];

type SavedJob = {
  title: string;
  company: string;
  location: string;
  salary?: string;
  saved: string;
  note?: string;
  noteTone?: string;
  state: "open" | "draft" | "closed";
  logo: LucideIcon;
};

const jobs: SavedJob[] = [
  {
    title: "Senior Product Designer",
    company: "TechFlow",
    location: "San Francisco, CA (Hybrid)",
    salary: "$160k - $200k + Equity",
    saved: "Saved 2 hours ago",
    note: "Closes in 3 days",
    noteTone: "text-amber-400",
    state: "open",
    logo: Hexagon,
  },
  {
    title: "Frontend Engineer",
    company: "Vercel",
    location: "Remote, Global",
    salary: "$140k - $180k",
    saved: "Saved yesterday",
    state: "open",
    logo: Triangle,
  },
  {
    title: "Staff UX Researcher",
    company: "Linear",
    location: "New York, NY (On-site)",
    salary: "$180k - $220k",
    saved: "Saved 3 days ago",
    state: "draft",
    logo: Boxes,
  },
  {
    title: "Full Stack Developer",
    company: "Meta",
    location: "Menlo Park, CA (Hybrid)",
    salary: "$150k - $210k + Bonus",
    saved: "Saved 5 days ago",
    state: "open",
    logo: InfinityIcon,
  },
  {
    title: "Design Systems Lead",
    company: "Spotify",
    location: "Remote, USA",
    saved: "Closed yesterday",
    note: "Closed yesterday",
    noteTone: "text-red-400",
    state: "closed",
    logo: Leaf,
  },
];

export function SeekerSavedJobs({ user }: { user: DashboardUser }) {
  return (
    <SeekerLayout
      user={user}
      searchPlaceholder="Search jobs, companies, or skills..."
      topbarExtra={
        <button
          type="button"
          className="hidden h-9 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200 sm:inline-flex"
        >
          + Upload Resume
        </button>
      }
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Saved Jobs</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Manage and track your bookmarked opportunities.
            </p>
          </div>
          <div className="flex gap-3">
            <div
              className={cn(card, "flex items-center gap-3 px-4 py-3")}
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#1c1c1c]">
                <Bookmark className="size-4 text-zinc-200" />
              </span>
              <div>
                <p className="text-xs text-zinc-400">Total Saved</p>
                <p className="text-2xl leading-tight font-semibold text-white">
                  24
                </p>
              </div>
            </div>
            <div
              className={cn(card, "flex items-center gap-3 px-4 py-3")}
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#1c1c1c]">
                <Clock className="size-4 text-amber-400" />
              </span>
              <div>
                <p className="text-xs text-zinc-400">Closing Soon</p>
                <p className="text-2xl leading-tight font-semibold text-white">
                  3
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            card,
            "mt-6 flex flex-wrap items-center justify-between gap-3 px-4 py-3",
          )}
        >
          <div className="flex flex-wrap items-center gap-1">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                type="button"
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm transition-colors",
                  i === 0
                    ? "bg-white/10 font-medium text-white"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-1.5 text-zinc-500">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500">Sort by:</span>
            <SelectBox
              label="Sort saved jobs"
              options={["Recently Saved", "Closing Soon", "Salary"]}
              className="w-40"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {jobs.map((job) => {
            const closed = job.state === "closed";
            return (
              <div
                key={job.title}
                className={cn(
                  "flex flex-col gap-5 rounded-xl border border-white/10 p-6 lg:flex-row lg:items-center",
                  closed ? "bg-[#0d0d0d]" : "bg-[#111]",
                )}
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <span
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#141414]",
                      closed && "opacity-50",
                    )}
                  >
                    <job.logo className="size-5 text-zinc-300" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2
                        className={cn(
                          "text-lg font-semibold",
                          closed ? "text-zinc-500" : "text-white",
                        )}
                      >
                        {job.title}
                      </h2>
                      <span
                        className={cn(
                          "rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase",
                          closed ? "text-zinc-600" : "text-zinc-500",
                        )}
                      >
                        {job.company}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs text-zinc-300">
                        <MapPin className="size-3.5 text-zinc-500" />
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs text-zinc-300">
                          <Wallet className="size-3.5 text-zinc-500" />
                          {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
                  <div className="text-right">
                    <p className="flex items-center justify-end gap-1.5 text-xs text-zinc-500">
                      <Clock className="size-3.5" />
                      {job.saved}
                    </p>
                    {job.note && (
                      <p className={cn("mt-1 text-xs", job.noteTone)}>
                        {job.note}
                      </p>
                    )}
                  </div>
                  {!closed && (
                    <button
                      type="button"
                      aria-label={`Bookmark ${job.title}`}
                      className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <Bookmark className="size-4 fill-current" />
                    </button>
                  )}
                  {job.state === "closed" ? (
                    <button
                      type="button"
                      className="h-9 rounded-lg border border-red-500/30 px-4 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      Remove from List
                    </button>
                  ) : job.state === "draft" ? (
                    <button
                      type="button"
                      className="h-9 rounded-lg border border-white/10 bg-[#141414] px-4 text-sm font-medium text-zinc-200 transition-colors hover:bg-[#1c1c1c]"
                    >
                      Draft Started
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="h-9 rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-white"
          >
            Load More
            <ChevronDown className="size-4" />
          </button>
        </div>
      </div>
    </SeekerLayout>
  );
}
