"use client";

import { CheckCircle2, Download } from "lucide-react";
import { SeekerLayout } from "@/components/dashboard/layouts";
import { type DashboardUser } from "@/components/dashboard/shell";
import {
  PageHeader,
  StatusBadge,
  btnOutline,
  btnPrimary,
  card,
  td,
  th,
} from "@/components/dashboard/ui";
import { cn } from "cn";

const features = [
  "Unlimited Applications",
  "Priority Candidate Badge",
  "Premium Job Insights",
  "Direct Recruiter Messaging",
];

const invoices = [
  { date: "Sep 24, 2023", plan: "Professional Tier", amount: "$29.00", id: "TRX-948102-HL" },
  { date: "Aug 24, 2023", plan: "Professional Tier", amount: "$29.00", id: "TRX-771920-HL" },
  { date: "Jul 24, 2023", plan: "Professional Tier", amount: "$29.00", id: "TRX-331085-HL" },
  { date: "Jun 24, 2023", plan: "Standard Tier", amount: "$12.00", id: "TRX-220199-HL" },
];

export function SeekerBilling({ user }: { user: DashboardUser }) {
  return (
    <SeekerLayout user={user} searchPlaceholder="Search invoices or plans...">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Subscription & Billing"
          description="Manage your professional tier features, recurring payments, and billing history."
        />

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className={cn(card, "p-6 lg:col-span-2")}>
            <div className="flex items-start justify-between gap-4">
              <span className="rounded bg-white px-2.5 py-1 text-[10px] font-semibold tracking-wider text-black uppercase">
                Current Plan
              </span>
              <div className="text-right">
                <p className="text-2xl font-semibold text-white">
                  $29
                  <span className="ml-0.5 text-sm font-normal text-zinc-400">
                    /mo
                  </span>
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Next billing date: Oct 24, 2023
                </p>
              </div>
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              Professional Tier
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Unlock global job insights and unlimited applications.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {features.map((feature) => (
                <p
                  key={feature}
                  className="flex items-center gap-2 text-sm text-zinc-200"
                >
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  {feature}
                </p>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className={btnPrimary}>
                Upgrade Plan
              </button>
              <button type="button" className={btnOutline}>
                Manage Plan
              </button>
            </div>
          </div>

          <div className={cn(card, "p-6")}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">
                Payment Method
              </h2>
              <span className="rounded border border-white/10 px-2 py-1 text-[10px] tracking-wider text-zinc-500 uppercase">
                Secure by Stripe
              </span>
            </div>

            <div className="relative mt-5 overflow-hidden rounded-xl bg-[linear-gradient(120deg,#4c1d95_0%,#a21caf_55%,#1e1b4b_100%)] p-5 shadow-lg">
              <span className="absolute -top-10 -right-10 size-36 rounded-full bg-white/10 blur-2xl" />
              <span className="absolute -bottom-12 left-10 size-32 rounded-full bg-fuchsia-400/20 blur-2xl" />

              <div className="relative flex items-start justify-between">
                <span className="flex h-7 w-10 items-center justify-center rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400">
                  <span className="h-3 w-6 rounded-sm border border-yellow-600/50" />
                </span>
                <span className="text-sm font-semibold tracking-widest text-white">
                  VISA
                </span>
              </div>

              <p className="relative mt-6 text-lg tracking-[0.2em] text-white">
                •••• •••• •••• 4242
              </p>

              <div className="relative mt-5 flex items-end justify-between gap-3 text-[10px] tracking-wider uppercase">
                <div>
                  <p className="text-violet-200">Card Holder</p>
                  <p className="mt-0.5 text-xs font-medium tracking-normal text-white normal-case">
                    Alexander Seeker
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-violet-200">Expires</p>
                  <p className="mt-0.5 text-xs font-medium text-white">12/25</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 w-full text-center text-sm text-zinc-300 transition-colors hover:text-white"
            >
              + Add New Payment Method
            </button>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Billing History</h2>
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-white"
          >
            <Download className="size-4" />
            Export PDF
          </button>
        </div>

        <div className={cn(card, "mt-4 overflow-x-auto")}>
          <table className="w-full min-w-180 text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className={th}>Date</th>
                <th className={th}>Plan</th>
                <th className={th}>Amount</th>
                <th className={th}>Transaction ID</th>
                <th className={cn(th, "text-right")}>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className={cn(td, "text-zinc-300")}>{invoice.date}</td>
                  <td className={cn(td, "text-zinc-300")}>{invoice.plan}</td>
                  <td className={cn(td, "text-zinc-200")}>{invoice.amount}</td>
                  <td className={cn(td, "text-zinc-400")}>{invoice.id}</td>
                  <td className={cn(td, "text-right")}>
                    <StatusBadge tone="green">Paid</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className={cn(
            card,
            "mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <div>
            <h2 className="text-lg font-semibold text-white">
              Need help with your invoice?
            </h2>
            <p className="mt-1 max-w-xl text-sm text-zinc-400">
              Our support team is available 24/7 to help you resolve any payment
              issues or clarify billing details.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button type="button" className={btnOutline}>
              Contact Support
            </button>
            <button
              type="button"
              className="text-sm text-zinc-300 transition-colors hover:text-white"
            >
              Read Refund Policy
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-zinc-500">
          <p>© 2023 HireLoop Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="transition-colors hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </SeekerLayout>
  );
}
