"use client";

import { Briefcase, User } from "lucide-react";
import { AdminLayout, ViewMenu } from "@/components/dashboard/layouts";
import { type DashboardUser } from "@/components/dashboard/shell";
import {
  InitialAvatar,
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

type ManagedUser = {
  name: string;
  email: string;
  role: "Seeker" | "Recruiter";
  joined: string;
  status: "Active" | "Suspended";
  avatar: string;
};

const users: ManagedUser[] = [
  {
    name: "Jordan Davis",
    email: "jordan.davis@example.com",
    role: "Seeker",
    joined: "Oct 12, 2023",
    status: "Active",
    avatar: "bg-sky-700",
  },
  {
    name: "Elena Rodriguez",
    email: "elena.r@talentflow.io",
    role: "Recruiter",
    joined: "Sep 28, 2023",
    status: "Active",
    avatar: "bg-rose-700",
  },
  {
    name: "Marcus Webb",
    email: "m.webb@outlook.com",
    role: "Seeker",
    joined: "Aug 05, 2023",
    status: "Suspended",
    avatar: "bg-zinc-700",
  },
  {
    name: "Tom Hiddleston",
    email: "t.hiddles@loki-tech.com",
    role: "Recruiter",
    joined: "Nov 01, 2023",
    status: "Active",
    avatar: "bg-slate-600",
  },
];

const stats = [
  {
    label: "Total Active Users",
    value: "12,842",
    hint: "+12% vs last month",
    hintTone: "text-emerald-400",
  },
  {
    label: "Recruiter Growth",
    value: "843",
    hint: "High demand",
    hintTone: "text-emerald-400",
  },
  {
    label: "Suspended Accounts",
    value: "124",
    hint: "0.8% of total",
    hintTone: "text-zinc-500",
  },
  {
    label: "New Signups (24h)",
    value: "42",
    hint: "Steady activity",
    hintTone: "text-amber-400",
  },
];

export function AdminUsers({ user }: { user: DashboardUser }) {
  return (
    <AdminLayout
      user={user}
      searchPlaceholder="Search by email..."
      topbarExtra={<ViewMenu label="Manage Roles" />}
    >
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="User Management"
          description="Review, filter, and manage platform access for all users."
          actions={
            <>
              <SelectBox
                label="Filter by role"
                options={["All Roles", "Seekers", "Recruiters", "Admins"]}
                className="w-36"
              />
              <button type="button" className={btnPrimary}>
                Export List
              </button>
            </>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className={cn(card, "mt-6 overflow-x-auto")}>
          <table className="w-full min-w-215 text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className={th}>User Name</th>
                <th className={th}>Email Address</th>
                <th className={th}>Role</th>
                <th className={th}>Join Date</th>
                <th className={th}>Status</th>
                <th className={cn(th, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <tr
                  key={row.email}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className={td}>
                    <span className="flex items-center gap-3">
                      <InitialAvatar name={row.name} color={row.avatar} />
                      <span className="font-medium text-white">{row.name}</span>
                    </span>
                  </td>
                  <td className={cn(td, "text-zinc-400")}>{row.email}</td>
                  <td className={td}>
                    {row.role === "Recruiter" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-2.5 py-1 text-xs text-violet-300 ring-1 ring-violet-500/30 ring-inset">
                        <Briefcase className="size-3" />
                        Recruiter
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-300 ring-1 ring-white/10 ring-inset">
                        <User className="size-3" />
                        Seeker
                      </span>
                    )}
                  </td>
                  <td className={cn(td, "text-zinc-400")}>{row.joined}</td>
                  <td className={td}>
                    <StatusBadge
                      tone={row.status === "Active" ? "green" : "red"}
                    >
                      {row.status}
                    </StatusBadge>
                  </td>
                  <td className={cn(td, "text-right whitespace-nowrap")}>
                    {row.status === "Active" ? (
                      <>
                        <button
                          type="button"
                          className="text-sm text-zinc-200 transition-colors hover:text-white"
                        >
                          {row.role === "Seeker"
                            ? "Make Recruiter"
                            : "Make Seeker"}
                        </button>
                        <button
                          type="button"
                          className="ml-4 text-sm text-red-400 transition-colors hover:text-red-300"
                        >
                          Suspend
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="text-sm text-emerald-400 transition-colors hover:text-emerald-300"
                        >
                          Activate
                        </button>
                        <button
                          type="button"
                          className="ml-4 text-sm text-zinc-400 transition-colors hover:text-white"
                        >
                          Delete
                        </button>
                      </>
                    )}
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
