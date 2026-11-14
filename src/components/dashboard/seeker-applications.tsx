"use client";

import { useState } from "react";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
  Database,
  Download,
  PenTool,
  type LucideIcon,
} from "lucide-react";
import { SeekerLayout } from "@/components/dashboard/layouts";
import { type DashboardUser } from "@/components/dashboard/shell";
import {
  PageHeader,
  StatCard,
  StatusBadge,
  btnPrimary,
  card,
  td,
  th,
  type Tone,
} from "@/components/dashboard/ui";
import { cn } from "cn";

type Application = {
  title: string;
  type: string;
  mode: string;
  company: string;
  applied: string;
  status: "Applied" | "Review" | "Shortlisted" | "Rejected" | "Offered";
  icon: LucideIcon;
  iconClass: string;
};

const applications: Application[] = [
  {
    title: "Senior Frontend Engineer",
    type: "Full-time",
    mode: "Remote",
    company: "Stark Industries",
    applied: "2 hours ago",
    status: "Applied",
    icon: Code2,
    iconClass: "bg-[#1c1c1c] text-zinc-200",
  },
  {
    title: "Product Designer",
    type: "Contract",
    mode: "Hybrid",
    company: "Cyberdyne Systems",
    applied: "1 day ago",
    status: "Review",
    icon: PenTool,
    iconClass: "bg-[#1c1c1c] text-zinc-200",
  },
  {
    title: "Lead Data Scientist",
    type: "Full-time",
    mode: "On-site",
    company: "Wayne Enterprises",
    applied: "4 days ago",
    status: "Shortlisted",
    icon: Database,
    iconClass: "bg-[#1c1c1c] text-zinc-200",
  },
  {
    title: "Cloud Architect",
    type: "Full-time",
    mode: "Remote",
    company: "Oscorp Tech",
    applied: "1 week ago",
    status: "Rejected",
    icon: Cloud,
    iconClass: "bg-red-600/80 text-white",
  },
  {
    title: "AI Research Engineer",
    type: "Full-time",
    mode: "Hybrid",
    company: "Hooli Corp",
    applied: "2 weeks ago",
    status: "Offered",
    icon: Bot,
    iconClass: "bg-emerald-700 text-white",
  },
];

const statusTone: Record<Application["status"], Tone> = {
  Applied: "gray",
  Review: "amber",
  Shortlisted: "blue",
  Rejected: "red",
  Offered: "green",
};

const stats = [
  { label: "Total Applied", value: "24" },
  { label: "Shortlisted", value: "8" },
  { label: "Interviews", value: "3", valueTone: "text-amber-400" },
  { label: "Success Rate", value: "12%", valueTone: "text-emerald-400" },
];

export function SeekerApplications({ user }: { user: DashboardUser }) {
  const [tab, setTab] = useState<"Active" | "Archived">("Active");

  return (
    <SeekerLayout user={user} searchPlaceholder="Search applications...">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="My Applications"
          description="Track your job applications and interview progress in real-time."
          actions={
            <>
              <div className="inline-flex rounded-lg border border-white/10 bg-[#111] p-1">
                {(["Active", "Archived"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTab(option)}
                    className={cn(
                      "h-8 rounded-md px-3.5 text-sm transition-colors",
                      tab === option
                        ? "bg-white/10 font-medium text-white"
                        : "text-zinc-400 hover:text-white",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button type="button" className={btnPrimary}>
                <Download className="size-4" />
                Export PDF
              </button>
            </>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className={cn(card, "mt-6")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-215 text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className={th}>Job Title</th>
                  <th className={th}>Company</th>
                  <th className={th}>Applied</th>
                  <th className={th}>Status</th>
                  <th className={cn(th, "text-right")}>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.title}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className={td}>
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-md",
                            app.iconClass,
                          )}
                        >
                          <app.icon className="size-4" />
                        </span>
                        <span>
                          <span className="block font-medium text-white">
                            {app.title}
                          </span>
                          <span className="block text-xs text-zinc-500">
                            {app.type} • {app.mode}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td className={cn(td, "text-zinc-300")}>{app.company}</td>
                    <td className={cn(td, "whitespace-nowrap text-zinc-400")}>
                      {app.applied}
                    </td>
                    <td className={td}>
                      <StatusBadge
                        tone={statusTone[app.status]}
                        dot={app.status !== "Applied"}
                      >
                        {app.status}
                      </StatusBadge>
                    </td>
                    <td className={cn(td, "text-right")}>
                      <button
                        type="button"
                        className="text-sm text-zinc-200 transition-colors hover:text-white"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
            <p className="text-sm text-zinc-500">
              Showing 1–5 of 24 applications
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                className="flex size-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                <ChevronLeft className="size-4" />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md text-sm transition-colors",
                    page === 1
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                className="flex size-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SeekerLayout>
  );
}
