"use client";

import {
  BadgeCheck,
  Building2,
  Clock,
  Eye,
  Plus,
  PlusCircle,
  Trash2,
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
  inputClass,
  td,
  th,
  type Tone,
} from "@/components/dashboard/ui";
import { cn } from "cn";

type Company = {
  name: string;
  domain: string;
  industry: string;
  recruiters: string;
  openJobs: string;
  status: "Verified" | "Pending" | "Suspended";
};

const companies: Company[] = [
  {
    name: "Nexus Lab",
    domain: "nexuslab.io",
    industry: "Product Design",
    recruiters: "24",
    openJobs: "18",
    status: "Verified",
  },
  {
    name: "CloudScale",
    domain: "cloudscale.com",
    industry: "Cloud Infrastructure",
    recruiters: "41",
    openJobs: "32",
    status: "Verified",
  },
  {
    name: "Quantum",
    domain: "quantum.dev",
    industry: "Engineering",
    recruiters: "12",
    openJobs: "9",
    status: "Pending",
  },
  {
    name: "Humanize",
    domain: "humanize.co",
    industry: "Research",
    recruiters: "8",
    openJobs: "4",
    status: "Verified",
  },
  {
    name: "Vanguard",
    domain: "vanguard.com",
    industry: "Marketing",
    recruiters: "17",
    openJobs: "0",
    status: "Suspended",
  },
];

const statusTone: Record<Company["status"], Tone> = {
  Verified: "green",
  Pending: "amber",
  Suspended: "red",
};

export function AdminCompanies({ user }: { user: DashboardUser }) {
  return (
    <AdminLayout user={user} searchPlaceholder="Search companies...">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Companies"
          description="Manage company accounts, verification, and hiring activity."
          actions={
            <button type="button" className={btnPrimary}>
              <Plus className="size-4" />
              Add Company
            </button>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Companies"
            value="4,281"
            icon={Building2}
            hint="+124 this quarter"
            hintTone="text-emerald-400"
          />
          <StatCard
            label="Verified"
            value="3,940"
            icon={BadgeCheck}
            hint="92% of all companies"
            hintTone="text-zinc-400"
          />
          <StatCard
            label="Pending Review"
            value="128"
            icon={Clock}
            hint="Needs attention"
            hintTone="text-amber-400"
          />
          <StatCard
            label="New This Month"
            value="84"
            icon={PlusCircle}
            hint="+9% vs last month"
            hintTone="text-emerald-400"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Search by name or domain..."
            aria-label="Search companies"
            className={cn(inputClass, "max-w-72")}
          />
          <SelectBox
            label="Filter by industry"
            options={[
              "All Industries",
              "Product Design",
              "Engineering",
              "Marketing",
              "Research",
            ]}
            className="w-48"
          />
          <SelectBox
            label="Filter by status"
            options={["All Statuses", "Verified", "Pending", "Suspended"]}
            className="w-44"
          />
        </div>

        <div className={cn(card, "mt-4 overflow-x-auto")}>
          <table className="w-full min-w-215 text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className={th}>Company</th>
                <th className={th}>Industry</th>
                <th className={th}>Recruiters</th>
                <th className={th}>Open Jobs</th>
                <th className={th}>Status</th>
                <th className={cn(th, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.domain}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className={td}>
                    <span className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-[#1c1c1c] text-sm font-semibold text-zinc-200">
                        {company.name.charAt(0)}
                      </span>
                      <span>
                        <span className="block font-medium text-white">
                          {company.name}
                        </span>
                        <span className="block text-xs text-zinc-500">
                          {company.domain}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className={cn(td, "text-zinc-300")}>
                    {company.industry}
                  </td>
                  <td className={cn(td, "text-zinc-400")}>
                    {company.recruiters}
                  </td>
                  <td className={cn(td, "text-zinc-400")}>
                    {company.openJobs}
                  </td>
                  <td className={td}>
                    <StatusBadge tone={statusTone[company.status]}>
                      {company.status}
                    </StatusBadge>
                  </td>
                  <td className={cn(td, "text-right whitespace-nowrap")}>
                    <button
                      type="button"
                      aria-label={`View ${company.name}`}
                      className="text-zinc-400 transition-colors hover:text-white"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${company.name}`}
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
      </div>
    </AdminLayout>
  );
}
