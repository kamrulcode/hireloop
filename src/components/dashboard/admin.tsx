"use client";

import {
  Bell,
  Briefcase,
  Building2,
  Calendar,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  Settings,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { Avatar, DashboardShell, type DashboardUser } from "@/components/dashboard/shell";
import { Logo } from "@/components/logo";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Users", icon: Users },
  { label: "Companies", icon: Building2 },
  { label: "Jobs", icon: Briefcase },
  { label: "Payments", icon: CreditCard },
  { label: "Settings", icon: Settings },
];

const stats = [
  { label: "Total Users", value: "124,892", trend: "↑12%", up: true, icon: User },
  { label: "Total Recruiters", value: "12,405", trend: "↑8%", up: true, icon: UserCheck },
  { label: "Total Companies", value: "4,281", trend: "–0%", up: false, icon: Building2 },
  { label: "Jobs Posted", value: "8,920", trend: "↑24%", up: true, icon: Briefcase },
  { label: "Platform Revenue", value: "$245,800", trend: "↑18.5%", up: true, icon: CreditCard },
];

const transactions = [
  { email: "marcus.k@techcorp.io", company: "TechCorp Inc.", plan: "Enterprise Monthly", id: "#TXN-902341", amount: "$1,299.00", date: "Oct 24, 2023, 14:20", status: "Success", avatar: "bg-amber-700" },
  { email: "sarah.l@creativestudio.com", company: "Creative Studio", plan: "Professional Annual", id: "#TXN-882103", amount: "$499.00", date: "Oct 24, 2023, 11:05", status: "Success", avatar: "bg-rose-600" },
  { email: "j.doe@freelance.org", company: "Independent", plan: "Starter Monthly", id: "#TXN-774129", amount: "$49.00", date: "Oct 23, 2023, 16:45", status: "Pending", avatar: "bg-slate-600" },
  { email: "admin@retailglobal.net", company: "Retail Global", plan: "Enterprise Monthly", id: "#TXN-552014", amount: "$1,299.00", date: "Oct 23, 2023, 09:12", status: "Failed", avatar: "bg-teal-600" },
];

const statusColors: Record<string, string> = {
  Success: "bg-emerald-400",
  Pending: "bg-amber-400",
  Failed: "bg-red-500",
};

export function AdminDashboard({ user }: { user: DashboardUser }) {
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
      navItems={navItems}
      searchPlaceholder="Global search..."
      topbarRight={
        <>
          <button type="button" aria-label="Notifications" className="relative text-zinc-400 hover:text-white">
            <Bell className="size-5" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-red-500" />
          </button>
          <button type="button" aria-label="Help" className="text-zinc-400 hover:text-white">
            <CircleHelp className="size-5" />
          </button>
        </>
      }
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Real-time platform performance and growth metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[#141414] px-4 text-sm font-medium text-white hover:bg-[#1c1c1c]"
            >
              <Calendar className="size-4" />
              Last 30 Days
            </button>
            <button
              type="button"
              className="h-10 rounded-lg bg-white px-4 text-sm font-medium text-black hover:bg-zinc-200"
            >
              Export Report
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-[#111] p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-[#1c1c1c]">
                  <stat.icon className="size-4 text-zinc-300" />
                </span>
                <span
                  className={`text-xs font-medium ${stat.up ? "text-emerald-400" : "text-zinc-500"}`}
                >
                  {stat.trend}
                </span>
              </div>
              <p className="mt-4 text-sm text-zinc-400">{stat.label}</p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-[#111]">
          <div className="flex items-center justify-between px-5 pt-5 pb-1">
            <h2 className="text-lg font-semibold text-white">
              Recent Subscription Transactions
            </h2>
            <a href="#" className="text-sm text-zinc-400 hover:text-white">
              View All Activity
            </a>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-y border-white/10 text-left text-xs tracking-wider text-zinc-500 uppercase">
                  <th className="px-5 py-3.5 font-medium">User/Recruiter</th>
                  <th className="px-5 py-3.5 font-medium">Plan Type</th>
                  <th className="px-5 py-3.5 font-medium">Transaction ID</th>
                  <th className="px-5 py-3.5 font-medium">Amount</th>
                  <th className="px-5 py-3.5 font-medium">Date</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white ${tx.avatar}`}
                        >
                          {tx.email.charAt(0).toUpperCase()}
                        </span>
                        <span>
                          <span className="block font-medium text-white">
                            {tx.email}
                          </span>
                          <span className="block text-xs text-zinc-500">
                            {tx.company}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block rounded-full border border-white/10 bg-[#1c1c1c] px-2.5 py-1 text-xs text-zinc-300">
                        {tx.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-400">{tx.id}</td>
                    <td className="px-5 py-4 text-zinc-400">{tx.amount}</td>
                    <td className="px-5 py-4 text-zinc-400">{tx.date}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2 text-sm">
                        <span
                          className={`size-2 rounded-full ${statusColors[tx.status]}`}
                        />
                        <span
                          className={
                            tx.status === "Success"
                              ? "text-emerald-400"
                              : tx.status === "Pending"
                                ? "text-amber-400"
                                : "text-red-400"
                          }
                        >
                          {tx.status}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
