"use client";

import {
  Building2,
  CalendarDays,
  CreditCard,
  Download,
  Filter,
  User,
} from "lucide-react";
import { AdminLayout } from "@/components/dashboard/layouts";
import { type DashboardUser } from "@/components/dashboard/shell";
import {
  InitialAvatar,
  PageHeader,
  StatCard,
  StatusBadge,
  btnOutline,
  btnPrimary,
  card,
  td,
  th,
  type Tone,
} from "@/components/dashboard/ui";
import { cn } from "cn";

const stats = [
  {
    label: "Total Revenue",
    value: "$1,284,500",
    icon: CreditCard,
    delta: "+12.4%",
  },
  {
    label: "Monthly Revenue",
    value: "$94,210",
    icon: CalendarDays,
    delta: "+8.1%",
  },
  {
    label: "Active Pro Users",
    value: "12,408",
    icon: User,
    delta: "+2.3%",
  },
  {
    label: "Active Enterprise Users",
    value: "842",
    icon: Building2,
    delta: "+15.7%",
  },
];

type Transaction = {
  email: string;
  plan: string;
  amount: string;
  date: string;
  relative: string;
  id: string;
  status: "Success" | "Pending" | "Failed";
  avatar: string;
};

const transactions: Transaction[] = [
  {
    email: "jordan.daniels@enterprise.co",
    plan: "Enterprise",
    amount: "$4,500.00",
    date: "May 19, 2026",
    relative: "Just now",
    id: "TXN-882910443",
    status: "Success",
    avatar: "bg-orange-700",
  },
  {
    email: "sarah.k@techflow.io",
    plan: "Pro",
    amount: "$299.00",
    date: "May 18, 2026",
    relative: "1 day ago",
    id: "TXN-773410291",
    status: "Success",
    avatar: "bg-rose-700",
  },
  {
    email: "marcus.lee@gmail.com",
    plan: "Starter",
    amount: "$49.00",
    date: "May 17, 2026",
    relative: "2 days ago",
    id: "TXN-110294857",
    status: "Pending",
    avatar: "bg-zinc-700",
  },
  {
    email: "e.lopez@globalfoundries.com",
    plan: "Enterprise",
    amount: "$12,000.00",
    date: "May 10, 2026",
    relative: "9 days ago",
    id: "TXN-009485712",
    status: "Failed",
    avatar: "bg-indigo-700",
  },
];

const statusTone: Record<Transaction["status"], Tone> = {
  Success: "green",
  Pending: "amber",
  Failed: "red",
};

export function AdminPayments({ user }: { user: DashboardUser }) {
  return (
    <AdminLayout
      user={user}
      searchPlaceholder="Search transactions, users, or IDs..."
    >
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Payments & Subscriptions"
          description="Comprehensive overview of platform revenue and active subscriptions."
        />

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className={cn(card, "mt-6")}>
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3">
            <h2 className="text-xl font-semibold text-white">
              Recent Transactions
            </h2>
            <div className="flex items-center gap-3">
              <button type="button" className={btnOutline}>
                <Filter className="size-4" />
                Filter
              </button>
              <button type="button" className={btnPrimary}>
                <Download className="size-4" />
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-sm">
              <thead>
                <tr className="border-y border-white/10">
                  <th className={th}>User Email</th>
                  <th className={th}>Plan</th>
                  <th className={th}>Amount</th>
                  <th className={th}>Date</th>
                  <th className={th}>Transaction ID</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className={td}>
                      <span className="flex items-center gap-3">
                        <InitialAvatar
                          name={tx.email}
                          color={tx.avatar}
                          className="size-9"
                        />
                        <span className="text-zinc-200">{tx.email}</span>
                      </span>
                    </td>
                    <td className={td}>
                      <span className="inline-block rounded-full border border-white/10 bg-[#1c1c1c] px-3 py-1 text-xs text-zinc-300">
                        {tx.plan}
                      </span>
                    </td>
                    <td className={cn(td, "font-medium text-zinc-200")}>
                      {tx.amount}
                    </td>
                    <td className={cn(td, "whitespace-nowrap")}>
                      <span className="text-zinc-300">{tx.date}</span>
                      <span className="ml-2 text-xs text-zinc-500">
                        • {tx.relative}
                      </span>
                    </td>
                    <td className={cn(td, "text-zinc-400")}>{tx.id}</td>
                    <td className={td}>
                      <StatusBadge tone={statusTone[tx.status]}>
                        {tx.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
