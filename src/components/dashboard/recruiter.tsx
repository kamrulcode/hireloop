"use client";

import {
  Bell,
  Briefcase,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import {
  Avatar,
  DashboardShell,
  Fab,
  type DashboardUser,
} from "@/components/dashboard/shell";
import { Logo } from "@/components/logo";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Manage Jobs", icon: Briefcase },
  { label: "Applications", icon: FileText },
  { label: "Settings", icon: Settings },
];

const stats = [
  { label: "Total Job Posts", value: "48", icon: FileText },
  { label: "Total Applicants", value: "1,284", icon: Users },
  { label: "Active Jobs", value: "18", icon: Zap },
  { label: "Jobs Closed", value: "32", icon: CheckCircle2 },
];

const statusStyles: Record<string, string> = {
  Interviewing: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30",
  New: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
  Reviewing: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  Rejected: "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
};

const applications = [
  {
    name: "Julianne Moore",
    role: "Senior Product Designer",
    date: "Oct 24, 2023",
    experience: "6 years",
    status: "Interviewing",
    avatar: "bg-sky-600",
  },
  {
    name: "Robert Downey",
    role: "Backend Engineer",
    date: "Oct 23, 2023",
    experience: "4 years",
    status: "New",
    avatar: "bg-orange-600",
  },
  {
    name: "Emma Stone",
    role: "Marketing Lead",
    date: "Oct 22, 2023",
    experience: "8 years",
    status: "Reviewing",
    avatar: "bg-rose-500",
  },
  {
    name: "Chris Pratt",
    role: "Product Manager",
    date: "Oct 21, 2023",
    experience: "5 years",
    status: "Rejected",
    avatar: "bg-indigo-600",
  },
];

export function RecruiterDashboard({ user }: { user: DashboardUser }) {
  return (
    <DashboardShell
      brand={<Logo />}
      sidebarTop={
        <div className="rounded-xl border border-white/10 bg-[#111] p-3">
          <div className="flex items-center gap-3">
            <Avatar user={user} className="size-10 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user.name}
              </p>
              <p className="text-xs text-zinc-500">Recruiter</p>
            </div>
          </div>
          <span className="mt-2.5 inline-block rounded-full bg-violet-600/20 px-2.5 py-1 text-xs font-medium text-violet-300 ring-1 ring-violet-500/30">
            Premium account
          </span>
        </div>
      }
      navItems={navItems}
      searchPlaceholder="Search applications, jobs, or talent..."
      topbarRight={
        <>
          <button
            type="button"
            aria-label="Notifications"
            className="relative text-zinc-400 hover:text-white"
          >
            <Bell className="size-5" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-red-500" />
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-zinc-500">TechFlow Inc.</p>
          </div>
          <Avatar user={user} className="size-8" />
        </>
      }
    >
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold text-white">
          Welcome back, {user.name}
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-[#111] p-5"
            >
              <span className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-[#1c1c1c]">
                <stat.icon className="size-4 text-zinc-300" />
              </span>
              <p className="mt-4 text-sm text-zinc-400">{stat.label}</p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Recent Applications
          </h2>
          <a href="#" className="text-sm text-zinc-400 hover:text-white">
            View all
          </a>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-[#111]">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs tracking-wider text-zinc-500 uppercase">
                <th className="px-5 py-4 font-medium">Candidate Name</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Date Applied</th>
                <th className="px-5 py-4 font-medium">Experience</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.name}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white ${app.avatar}`}
                      >
                        {app.name.charAt(0)}
                      </span>
                      <span className="font-medium text-white">{app.name}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{app.role}</td>
                  <td className="px-5 py-4 text-zinc-400">{app.date}</td>
                  <td className="px-5 py-4 text-zinc-400">{app.experience}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Fab />
    </DashboardShell>
  );
}
