"use client";

import {
  Briefcase,
  Calendar,
  Eye,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { RecruiterLayout } from "@/components/dashboard/layouts";
import { type DashboardUser } from "@/components/dashboard/shell";
import {
  PageHeader,
  SelectBox,
  StatCard,
  StatusBadge,
  btnPrimary,
  card,
  inputClass,
  td,
  th,
  type Tone,
} from "@/components/dashboard/ui";
import { cn } from "cn";

type JobPost = {
  title: string;
  ref: string;
  applicants: string;
  posted: string;
  status: "Active" | "Paused" | "Closed";
};

const jobs: JobPost[] = [
  {
    title: "Senior Product Designer",
    ref: "HL-90210",
    applicants: "128",
    posted: "Oct 24, 2023",
    status: "Active",
  },
  {
    title: "Full-stack Engineer",
    ref: "HL-88231",
    applicants: "96",
    posted: "Oct 22, 2023",
    status: "Active",
  },
  {
    title: "Marketing Director",
    ref: "HL-11022",
    applicants: "41",
    posted: "Oct 15, 2023",
    status: "Paused",
  },
  {
    title: "Backend Architect",
    ref: "HL-99032",
    applicants: "74",
    posted: "Oct 20, 2023",
    status: "Active",
  },
  {
    title: "UX Research Lead",
    ref: "HL-44112",
    applicants: "12",
    posted: "Oct 19, 2023",
    status: "Closed",
  },
];

const statusTone: Record<JobPost["status"], Tone> = {
  Active: "green",
  Paused: "amber",
  Closed: "gray",
};

export function RecruiterManageJobs({ user }: { user: DashboardUser }) {
  return (
    <RecruiterLayout
      user={user}
      searchPlaceholder="Search job posts or refs..."
    >
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Manage Jobs"
          description="Create, edit, and track the performance of your open roles."
          actions={
            <button type="button" className={btnPrimary}>
              <Plus className="size-4" />
              Create Job
            </button>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active Jobs"
            value="18"
            icon={Briefcase}
            hint="6 closing this month"
            hintTone="text-amber-400"
          />
          <StatCard
            label="Total Job Posts"
            value="48"
            icon={FileText}
            hint="+4 this month"
            hintTone="text-emerald-400"
          />
          <StatCard
            label="Total Applicants"
            value="1,284"
            icon={Users}
            hint="+18% vs last month"
            hintTone="text-emerald-400"
          />
          <StatCard
            label="Interviews Scheduled"
            value="32"
            icon={Calendar}
            hint="12 this week"
            hintTone="text-zinc-400"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Search job title or ref..."
            aria-label="Search job posts"
            className={cn(inputClass, "max-w-72")}
          />
          <SelectBox
            label="Filter by status"
            options={["All Statuses", "Active", "Paused", "Closed"]}
            className="w-44"
          />
          <SelectBox
            label="Filter by category"
            options={[
              "All Categories",
              "Design",
              "Engineering",
              "Marketing",
              "Product",
            ]}
            className="w-48"
          />
        </div>

        <div className={cn(card, "mt-4 overflow-x-auto")}>
          <table className="w-full min-w-200 text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className={th}>Job Title</th>
                <th className={th}>Applicants</th>
                <th className={th}>Date Posted</th>
                <th className={th}>Status</th>
                <th className={cn(th, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.ref}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className={td}>
                    <span className="block font-medium text-white">
                      {job.title}
                    </span>
                    <span className="block text-xs text-zinc-500">
                      Ref: {job.ref}
                    </span>
                  </td>
                  <td className={cn(td, "text-zinc-300")}>{job.applicants}</td>
                  <td className={cn(td, "whitespace-nowrap text-zinc-400")}>
                    {job.posted}
                  </td>
                  <td className={td}>
                    <StatusBadge tone={statusTone[job.status]}>
                      {job.status}
                    </StatusBadge>
                  </td>
                  <td className={cn(td, "text-right whitespace-nowrap")}>
                    <button
                      type="button"
                      aria-label={`View ${job.title}`}
                      className="text-zinc-400 transition-colors hover:text-white"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Edit ${job.title}`}
                      className="ml-4 text-zinc-400 transition-colors hover:text-white"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${job.title}`}
                      className="ml-4 text-zinc-400 transition-colors hover:text-red-400"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RecruiterLayout>
  );
}
