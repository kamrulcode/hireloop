"use client";

import {
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  ChevronDown,
  CircleHelp,
  CreditCard,
  FileText,
  LayoutDashboard,
  Mail,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Avatar,
  DashboardShell,
  type DashboardUser,
  type NavItem,
} from "@/components/dashboard/shell";
import { Logo } from "@/components/logo";
import { cn } from "cn";

const seekerNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Jobs", icon: Briefcase, href: "/jobs" },
  { label: "Saved Jobs", icon: Bookmark, href: "/saved-jobs" },
  { label: "Applications", icon: FileText, href: "/applications" },
  { label: "Billing", icon: CreditCard, href: "/billing" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const recruiterNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Manage Jobs", icon: Briefcase, href: "/manage-jobs" },
  { label: "Applications", icon: FileText, href: "/applications" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Users", icon: Users, href: "/users" },
  { label: "Companies", icon: Building2, href: "/companies" },
  { label: "Jobs", icon: Briefcase, href: "/jobs" },
  { label: "Payments", icon: CreditCard, href: "/payments" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

type LayoutProps = {
  user: DashboardUser;
  searchPlaceholder?: string;
  topbarExtra?: React.ReactNode;
  children: React.ReactNode;
};

function TopbarIcon({
  label,
  icon: Icon,
  dot,
}: {
  label: string;
  icon: LucideIcon;
  dot?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative text-zinc-400 transition-colors hover:text-white"
    >
      <Icon className="size-5" />
      {dot && (
        <span
          className={cn(
            "absolute -top-1 -right-1 size-2 rounded-full",
            dot,
          )}
        />
      )}
    </button>
  );
}

export function ViewMenu({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="hidden h-10 items-center gap-2 border-l border-white/10 pl-4 text-sm text-zinc-300 transition-colors hover:text-white sm:flex sm:pl-5"
    >
      {label}
      <ChevronDown className="size-4 text-zinc-500" />
    </button>
  );
}

export function SeekerLayout({
  user,
  searchPlaceholder = "Search opportunities...",
  topbarExtra,
  children,
}: LayoutProps) {
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
      navItems={seekerNav}
      searchPlaceholder={searchPlaceholder}
      topbarRight={
        <>
          <TopbarIcon label="Notifications" icon={Bell} dot="bg-emerald-500" />
          <TopbarIcon label="Messages" icon={Mail} dot="bg-red-500" />
          {topbarExtra}
          <Avatar user={user} className="size-8" />
        </>
      }
    >
      {children}
    </DashboardShell>
  );
}

export function RecruiterLayout({
  user,
  searchPlaceholder = "Search applications, jobs, or talent...",
  topbarExtra,
  children,
}: LayoutProps) {
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
      navItems={recruiterNav}
      searchPlaceholder={searchPlaceholder}
      topbarRight={
        <>
          <TopbarIcon label="Notifications" icon={Bell} dot="bg-red-500" />
          {topbarExtra}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-zinc-500">TechFlow Inc.</p>
          </div>
          <Avatar user={user} className="size-8" />
        </>
      }
    >
      {children}
    </DashboardShell>
  );
}

export function AdminLayout({
  user,
  searchPlaceholder = "Global search...",
  topbarExtra,
  children,
}: LayoutProps) {
  return (
    <DashboardShell
      brand={
        <div>
          <Logo />
          <p className="text-xs text-zinc-500">Admin Console</p>
        </div>
      }
      sidebarBottom={
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#111] p-3">
          <Avatar user={user} className="size-9 shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user.name}
            </p>
            <p className="text-xs text-zinc-500">Super Admin</p>
          </div>
        </div>
      }
      navItems={adminNav}
      searchPlaceholder={searchPlaceholder}
      topbarRight={
        <>
          <TopbarIcon label="Notifications" icon={Bell} dot="bg-red-500" />
          <TopbarIcon label="Help" icon={CircleHelp} />
          {topbarExtra ?? <ViewMenu label="Admin View" />}
        </>
      }
    >
      {children}
    </DashboardShell>
  );
}
