"use client";

import { useState } from "react";
import {
  Eye,
  Mail,
  Plus,
  Timer,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { AdminLayout } from "@/components/dashboard/layouts";
import { type DashboardUser } from "@/components/dashboard/shell";
import {
  PageHeader,
  SelectBox,
  StatCard,
  StatusBadge,
  btnPrimary,
  card,
  td,
  th,
} from "@/components/dashboard/ui";
import { cn } from "cn";

type Job = {
  title: string;
  ref: string;
  company: string;
  companyInitial: string;
  category: string;
  type: string;
  posted: string;
  status: "Active" | "Closed";
};

const jobs: Job[] = [
  {
    title: "Senior Product Designer",
    ref: "HL-90210",
    company: "Nexus Lab",
    companyInitial: "N",
    category: "Design",
    type: "Full-time",
    posted: "Oct 24, 2023",
    status: "Active",
  },
  {
    title: "Full-stack Engineer",
    ref: "HL-88231",
    company: "Quantum",
    companyInitial: "Q",
    category: "Engineering",
    type: "Contract",
    posted: "Oct 22, 2023",
    status: "Active",
  },
  {
    title: "Marketing Director",
    ref: "HL-11022",
    company: "Vanguard",
    companyInitial: "V",
    category: "Marketing",
    type: "Full-time",
    posted: "Oct 15, 2023",
    status: "Closed",
  },
  {
    title: "Backend Architect",
    ref: "HL-99032",
    company: "CloudScale",
    companyInitial: "C",
    category: "Engineering",
    type: "Remote",
    posted: "Oct 20, 2023",
    status: "Active",
  },
  {
    title: "UX Research Lead",
    ref: "HL-44112",
    company: "Humanize",
    companyInitial: "H",
    category: "Design",
    type: "Hybrid",
    posted: "Oct 19, 2023",
    status: "Active",
  },
];

export function AdminJobs({ user }: { user: DashboardUser }) {
  const [tab, setTab] = useState<"Active" | "Closed">("Active");

  return (
    <AdminLayout
      user={user}
      searchPlaceholder="Search jobs, companies, or IDs..."
    >
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Manage Jobs"
          description="Oversee all active listings and historical job posts across the platform."
          actions={
            <button type="button" className={btnPrimary}>
              <Plus className="size-4" />
              Create Job
            </button>
          }
        />

        <div className="mt-6 flex flex-wrap items-end gap-4">
          <div>
            <p className="mb-2 text-sm text-zinc-400">Status</p>
            <SelectBox
              label="Filter by status"
              options={["All Statuses", "Active", "Pending", "Closed"]}
              className="w-56"
            />
          </div>
          <div>
            <p className="mb-2 text-sm text-zinc-400">Category</p>
            <SelectBox
              label="Filter by category"
              options={[
                "All Categories",
                "Design",
                "Engineering",
                "Marketing",
                "Product",
              ]}
              className="w-56"
            />
          </div>
          <div className="inline-flex rounded-lg border border-white/10 bg-[#111] p-1">
            {(["Active", "Closed"] as const).map((option) => (
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
                {option} ({option === "Active" ? 128 : 45})
              </button>
            ))}
          </div>
        </div>

        <div className={cn(card, "mt-5 overflow-x-auto")}>
          <table className="w-full min-w-225 text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className={th}>Title</th>
                <th className={th}>Company</th>
                <th className={th}>Category</th>
                <th className={th}>Type</th>
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
                  <td className={td}>
                    <span className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-[#1c1c1c] text-xs font-semibold text-zinc-200">
                        {job.companyInitial}
                      </span>
                      <span className="text-zinc-200">{job.company}</span>
                    </span>
                  </td>
                  <td className={td}>
                    <span className="inline-block rounded-full border border-white/10 bg-[#1c1c1c] px-3 py-1 text-xs text-zinc-300">
                      {job.category}
                    </span>
                  </td>
                  <td className={cn(td, "text-zinc-300")}>{job.type}</td>
                  <td className={cn(td, "whitespace-nowrap text-zinc-400")}>
                    {job.posted}
                  </td>
                  <td className={td}>
                    <StatusBadge
                      tone={job.status === "Active" ? "green" : "gray"}
                    >
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
                      aria-label={`Delete ${job.title}`}
                      className="ml-5 text-zinc-400 transition-colors hover:text-red-400"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <StatCard
            label="Engagement Rate"
            value="82.4%"
            icon={TrendingUp}
            hint="+5.2% from last month"
            hintTone="text-emerald-400"
          />
          <StatCard
            label="Avg. Time to Fill"
            value="14 Days"
            icon={Timer}
            hint="Stable performance"
            hintTone="text-zinc-400"
          />
          <StatCard
            label="Total Applications"
            value="12,840"
            icon={Mail}
            hint="-2.1% across tech sectors"
            hintTone="text-amber-400"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
