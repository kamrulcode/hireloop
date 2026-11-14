"use client";

import { Avatar, type DashboardUser } from "@/components/dashboard/shell";
import { RecruiterLayout } from "@/components/dashboard/layouts";
import {
  PageHeader,
  SelectBox,
  btnPrimary,
  card,
  inputClass,
  textareaClass,
} from "@/components/dashboard/ui";
import { cn } from "cn";

const labelClass = "mb-2 block text-sm text-zinc-300";

const notifications = [
  { id: "new-applicant", label: "New applicant alerts", hint: "Email me when someone applies to a job." },
  { id: "weekly-digest", label: "Weekly performance digest", hint: "Receive a summary of job and applicant metrics." },
  { id: "candidate-messages", label: "Candidate messages", hint: "Notify me about new messages from candidates." },
];

export function RecruiterSettings({ user }: { user: DashboardUser }) {
  return (
    <RecruiterLayout user={user} searchPlaceholder="Search settings...">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Settings"
          description="Manage your recruiter profile, company details, and notifications."
        />

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className={cn(card, "p-6 lg:col-span-2")}>
            <h2 className="text-xl font-semibold text-white">
              Profile Information
            </h2>

            <div className="mt-5 flex items-center gap-5">
              <Avatar user={user} className="size-20 text-2xl" />
              <div>
                <button
                  type="button"
                  className="h-9 rounded-lg border border-white/10 bg-[#141414] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1c1c1c]"
                >
                  Change Avatar
                </button>
                <p className="mt-2 text-xs text-zinc-500">
                  JPG, GIF or PNG. Max size of 5MB.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="recruiter-name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="recruiter-name"
                  defaultValue={user.name}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="recruiter-email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="recruiter-email"
                  type="email"
                  defaultValue={user.email ?? "recruiter@techflow.io"}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="recruiter-title" className={labelClass}>
                  Job Title
                </label>
                <input
                  id="recruiter-title"
                  defaultValue="Talent Acquisition Lead"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="recruiter-phone" className={labelClass}>
                  Phone Number
                </label>
                <input
                  id="recruiter-phone"
                  type="tel"
                  defaultValue="+1 (415) 555-0132"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-white/10 pt-6">
              <button type="button" className={btnPrimary}>
                Save Profile
              </button>
            </div>
          </div>

          <div className={cn(card, "p-6")}>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Choose when HireLoop should reach out.
            </p>

            <div className="mt-5 flex flex-col gap-5">
              {notifications.map((item) => (
                <label
                  key={item.id}
                  htmlFor={item.id}
                  className="flex cursor-pointer items-start gap-3"
                >
                  <input
                    id={item.id}
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 size-4 shrink-0 accent-violet-500"
                  />
                  <span>
                    <span className="block text-sm text-zinc-200">
                      {item.label}
                    </span>
                    <span className="block text-xs text-zinc-500">
                      {item.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className={cn(card, "p-6 lg:col-span-2")}>
            <h2 className="text-xl font-semibold text-white">
              Company Details
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="company-name" className={labelClass}>
                  Company Name
                </label>
                <input
                  id="company-name"
                  defaultValue="TechFlow Inc."
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="company-website" className={labelClass}>
                  Website
                </label>
                <input
                  id="company-website"
                  type="url"
                  defaultValue="https://techflow.io"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="company-industry" className={labelClass}>
                  Industry
                </label>
                <SelectBox
                  id="company-industry"
                  label="Industry"
                  options={[
                    "Software & SaaS",
                    "Fintech",
                    "Healthcare",
                    "E-commerce",
                  ]}
                  className="h-10"
                />
              </div>
              <div>
                <label htmlFor="company-size" className={labelClass}>
                  Company Size
                </label>
                <SelectBox
                  id="company-size"
                  label="Company size"
                  options={["1-10", "11-50", "51-200", "201-500", "500+"]}
                  className="h-10"
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="company-about" className={labelClass}>
                About the Company
              </label>
              <textarea
                id="company-about"
                rows={4}
                defaultValue="TechFlow builds workflow tools that help product teams ship faster."
                className={textareaClass}
              />
            </div>

            <div className="mt-6 flex gap-3 border-t border-white/10 pt-6">
              <button type="button" className={btnPrimary}>
                Save Company
              </button>
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}
