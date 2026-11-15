"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CircleCheck,
  Clock,
  Cloud,
  Code2,
  Cog,
  Euro,
  FileText,
  Globe2,
  MapPin,
  Megaphone,
  Pencil,
  PenTool,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

import { RecruiterLayout } from "@/components/dashboard/layouts";
import { type RecruiterJob } from "@/components/dashboard/recruiter-jobs-data";
import { type DashboardUser } from "@/components/dashboard/shell";
import {
  Breadcrumb,
  StatCard,
  StatusBadge,
  btnIndigo,
  btnOutline,
  card,
} from "@/components/dashboard/ui";

// Same department → icon/colour mapping the manage-jobs table uses.
const departmentIcons: Record<
  RecruiterJob["icon"],
  { icon: LucideIcon; className: string }
> = {
  engineering: { icon: Code2, className: "text-violet-400" },
  design: { icon: PenTool, className: "text-orange-400" },
  infrastructure: { icon: Cloud, className: "text-sky-400" },
  marketing: { icon: Megaphone, className: "text-red-400" },
  quality: { icon: Cog, className: "text-yellow-400" },
};

/** Small label / value row used inside the "Job overview" card. */
function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-3 last:border-0 last:pb-0">
      <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
        {label}
      </span>
      <span className="text-right text-sm text-zinc-200">{children}</span>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className={cn(card, "p-6")}>
      <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
        <Icon className="size-4 text-indigo-400" />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function RecruiterViewJob({
  user,
  job,
}: {
  user: DashboardUser;
  job: RecruiterJob;
}) {
  const department = departmentIcons[job.icon];
  const DepartmentIcon = department.icon;
  const isActive = job.status === "Active";

  const salary =
    job.minSalary && job.maxSalary
      ? `${job.minSalary} – ${job.maxSalary}`
      : job.pay;

  return (
    <RecruiterLayout user={user} hideTopbar>
      <div className="mx-auto max-w-6xl">
        <Breadcrumb
          items={[
            { label: "Manage Jobs", href: "/manage-jobs" },
            { label: "Job Listings & Postings", href: "/manage-jobs" },
            job.title,
          ]}
        />

        {/* Title row */}
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#171717]">
              <DepartmentIcon className={cn("size-6", department.className)} />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                {job.title}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="size-4 text-zinc-500" />
                  {job.company}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-zinc-500" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe2 className="size-4 text-zinc-500" />
                  {job.remote ? "Remote" : "On-site"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/manage-jobs" className={btnOutline}>
              <ArrowLeft className="size-4" />
              Back to jobs
            </Link>
            <Link
              href={`/manage-jobs/${job.id}?mode=edit`}
              className={btnIndigo}
            >
              <Pencil className="size-4" />
              Edit job
            </Link>
          </div>
        </div>

        {/* Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge tone={isActive ? "green" : "gray"}>
            {job.status}
          </StatusBadge>
          <span className="inline-block rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1 text-xs whitespace-nowrap text-zinc-300">
            {job.type}
          </span>
          <span className="inline-block rounded-full bg-indigo-500/15 px-3 py-1 text-xs whitespace-nowrap text-indigo-300 ring-1 ring-indigo-500/30 ring-inset">
            {job.category}
          </span>
          <span className="inline-block rounded-full bg-white/5 px-3 py-1 text-xs whitespace-nowrap text-zinc-300 ring-1 ring-white/10 ring-inset">
            {job.department}
          </span>
        </div>

        {/* Key numbers */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Applicants"
            value={String(job.applicants)}
            icon={Users}
            hint="Candidates so far"
          />
          <StatCard
            label="Compensation"
            value={salary}
            icon={Euro}
            hint={job.frequency === "per hour" ? "Per hour" : "Per year"}
          />
          <StatCard
            label="Application deadline"
            value={job.deadline}
            icon={CalendarDays}
            hint={job.postedAgo}
          />
          <StatCard
            label="Status"
            value={isActive ? "Live" : "Closed"}
            icon={isActive ? CircleCheck : Clock}
            valueTone={isActive ? "text-emerald-400" : "text-zinc-400"}
            hint={isActive ? "Accepting applications" : "No longer accepting"}
          />
        </div>

        {/* Description + sidebar */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <SectionCard title="About this role" icon={FileText}>
              <p className="text-sm leading-relaxed whitespace-pre-line text-zinc-300">
                {job.responsibilities}
              </p>
            </SectionCard>

            <SectionCard
              title="Qualifications & requirements"
              icon={CircleCheck}
            >
              {job.qualifications.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No requirements listed for this job yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {job.qualifications.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-relaxed text-zinc-300"
                    >
                      <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>

          <aside className="flex flex-col gap-6">
            <SectionCard title="Job overview" icon={Briefcase}>
              <div className="flex flex-col">
                <DetailRow label="Company">{job.company}</DetailRow>
                <DetailRow label="Category">{job.category}</DetailRow>
                <DetailRow label="Department">{job.department}</DetailRow>
                <DetailRow label="Job type">{job.type}</DetailRow>
                <DetailRow label="Work mode">
                  {job.remote ? "Remote" : "On-site"}
                </DetailRow>
                <DetailRow label="Location">{job.location}</DetailRow>
                <DetailRow label="Salary">{job.pay}</DetailRow>
                <DetailRow label="Deadline">{job.deadline}</DetailRow>
                <DetailRow label="Job ID">
                  <span className="font-mono text-xs break-all text-zinc-400">
                    {job.id}
                  </span>
                </DetailRow>
              </div>
            </SectionCard>

            <section className={cn(card, "p-6")}>
              <h2 className="text-sm font-semibold text-white">
                Need to change something?
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Update the salary, deadline, or requirements — changes appear on
                the listing immediately.
              </p>
              <Link
                href={`/manage-jobs/${job.id}?mode=edit`}
                className={cn(btnIndigo, "mt-4 w-full")}
              >
                <Pencil className="size-4" />
                Edit job post
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </RecruiterLayout>
  );
}
