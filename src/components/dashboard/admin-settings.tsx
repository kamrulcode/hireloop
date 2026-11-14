"use client";

import { ShieldAlert } from "lucide-react";
import { AdminLayout } from "@/components/dashboard/layouts";
import { Avatar, type DashboardUser } from "@/components/dashboard/shell";
import {
  PageHeader,
  SelectBox,
  btnOutline,
  btnPrimary,
  card,
  inputClass,
} from "@/components/dashboard/ui";
import { cn } from "cn";

const labelClass = "mb-2 block text-sm text-zinc-300";

export function AdminSettings({ user }: { user: DashboardUser }) {
  return (
    <AdminLayout user={user} searchPlaceholder="Search settings...">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Settings"
          description="Manage your account details and platform configuration."
        />

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className={cn(card, "p-6 lg:col-span-2")}>
            <h2 className="text-xl font-semibold text-white">
              Profile Information
            </h2>

            <div className="mt-5 flex items-center gap-5">
              <Avatar user={user} className="size-20 text-2xl" />
              <div>
                <button type="button" className={btnOutline}>
                  Change Avatar
                </button>
                <p className="mt-2 text-xs text-zinc-500">
                  JPG, GIF or PNG. Max size of 5MB.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="admin-name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="admin-name"
                  defaultValue={user.name}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="admin-email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  defaultValue={user.email ?? "admin@hireloop.com"}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-white/10 pt-6">
              <button type="button" className={btnPrimary}>
                Update Profile
              </button>
              <button type="button" className={btnOutline}>
                Reset Password
              </button>
            </div>
          </div>

          <div className={cn(card, "p-6")}>
            <h2 className="text-xl font-semibold text-white">Security</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Update the password used to access the admin console.
            </p>

            <div className="mt-5 flex flex-col gap-4">
              <div>
                <label htmlFor="current-password" className={labelClass}>
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="new-password" className={labelClass}>
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className={labelClass}>
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              <button type="button" className={btnPrimary}>
                Update Password
              </button>
            </div>
          </div>

          <div className={cn(card, "p-6 lg:col-span-2")}>
            <h2 className="text-xl font-semibold text-white">
              Platform Settings
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Defaults applied across the HireLoop marketplace.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="platform-name" className={labelClass}>
                  Platform Name
                </label>
                <input
                  id="platform-name"
                  defaultValue="HireLoop"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="support-email" className={labelClass}>
                  Support Email
                </label>
                <input
                  id="support-email"
                  type="email"
                  defaultValue="support@hireloop.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="default-currency" className={labelClass}>
                  Default Currency
                </label>
                <SelectBox
                  id="default-currency"
                  label="Default currency"
                  options={["USD ($)", "EUR (€)", "GBP (£)"]}
                  className="h-10"
                />
              </div>
              <div>
                <label htmlFor="review-sla" className={labelClass}>
                  Company Review SLA
                </label>
                <SelectBox
                  id="review-sla"
                  label="Company review SLA"
                  options={["24 hours", "48 hours", "72 hours"]}
                  className="h-10"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-white/10 pt-6">
              <button type="button" className={btnPrimary}>
                Save Changes
              </button>
            </div>
          </div>

          <div className={cn(card, "p-6")}>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <ShieldAlert className="size-5 text-red-400" />
              Danger Zone
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Deactivating your account signs you out everywhere and suspends
              admin access until a platform owner restores it.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-red-500/30 px-4 text-sm font-medium text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
