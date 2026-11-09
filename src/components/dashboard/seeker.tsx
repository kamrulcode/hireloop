"use client";

import {
  Bell,
  Bookmark,
  Briefcase,
  CreditCard,
  FileText,
  Gift,
  LayoutDashboard,
  Mail,
  Megaphone,
  RefreshCw,
  Send,
  Settings,
  Calendar,
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
  { label: "Jobs", icon: Briefcase },
  { label: "Saved Jobs", icon: Bookmark },
  { label: "Applications", icon: FileText },
  { label: "Billing", icon: CreditCard },
  { label: "Settings", icon: Settings },
];

const stats = [
  { label: "Saved Jobs", value: "12", icon: Bookmark, color: "text-white" },
  {
    label: "Applications Submitted",
    value: "24",
    icon: Send,
    color: "text-white",
  },
  {
    label: "Interviews Scheduled",
    value: "3",
    icon: Calendar,
    color: "text-amber-400",
  },
  {
    label: "Offers Received",
    value: "1",
    icon: Gift,
    color: "text-emerald-400",
  },
];

type Activity = {
  icon: typeof Mail;
  color: string;
  before: string;
  highlight?: string;
  after?: string;
  time: string;
};

const activities: Activity[] = [
  {
    icon: RefreshCw,
    color: "text-violet-400",
    before: "Application for Senior Product Designer at TechFlow updated to ",
    highlight: "'Under Review'",
    time: "2 hours ago",
  },
  {
    icon: Megaphone,
    color: "text-emerald-400",
    before:
      "New Job Alert: Lead Frontend Engineer at FinGrid matches your profile.",
    time: "5 hours ago",
  },
  {
    icon: Mail,
    color: "text-white",
    before:
      "You have a new message from Sarah Jenkins (Hiring Manager at CloudOps).",
    time: "1 day ago",
  },
];

export function SeekerDashboard({ user }: { user: DashboardUser }) {
  return (
    <DashboardShell
      brand={<Logo />}
      sidebarTop={
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111] p-3">
          <Avatar user={user} className="size-10 shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>
            <p className="text-xs text-zinc-500">Professional Tier</p>
          </div>
        </div>
      }
      sidebarBottom={
        <button
          type="button"
          className="h-11 w-full rounded-lg bg-white text-sm font-medium text-black transition-colors hover:bg-zinc-200"
        >
          Post Resume
        </button>
      }
      navItems={navItems}
      searchPlaceholder="Search opportunities..."
      topbarRight={
        <>
          <button
            type="button"
            aria-label="Messages"
            className="relative text-zinc-400 hover:text-white"
          >
            <Mail className="size-5" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-red-500" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative text-zinc-400 hover:text-white"
          >
            <Bell className="size-5" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-500" />
          </button>
          <Avatar user={user} className="size-8" />
        </>
      }
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-[#111] p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-zinc-400">{stat.label}</p>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <p className="mt-5 text-3xl font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <a href="#" className="text-sm text-zinc-400 hover:text-white">
            View All Activity
          </a>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {[...activities, ...activities].map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#111] px-4 py-4"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1c1c1c]">
                <activity.icon className={`size-4 ${activity.color}`} />
              </span>
              <p className="min-w-0 flex-1 text-sm text-zinc-200">
                {activity.before}
                {activity.highlight && (
                  <span className="text-amber-400">{activity.highlight}</span>
                )}
              </p>
              <p className="shrink-0 text-sm text-zinc-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
      <Fab />
    </DashboardShell>
  );
}
