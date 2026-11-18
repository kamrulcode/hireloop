"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Bookmark,
  Briefcase,
  Building2,
  CalendarDays,
  CircleCheck,
  Clock,
  Cloud,
  Code2,
  Coins,
  Cog,
  Globe2,
  Laptop,
  MapPin,
  Megaphone,
  PenTool,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

import type { RecruiterJob } from "@/components/dashboard/recruiter-jobs-data";
import { Breadcrumb, StatCard, card } from "@/components/dashboard/ui";
import { notify } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { applyToJob } from "@/lib/actions/applications";
import { getSavedJobs, removeSavedJob, saveJob } from "@/lib/actions/savedjobs";

/** Same department → icon/colour mapping the browse list uses. */
const departmentStyles: Record<
  RecruiterJob["icon"],
  { icon: LucideIcon; className: string }
> = {
  engineering: { icon: Code2, className: "bg-violet-500/15 text-violet-400" },
  design: { icon: PenTool, className: "bg-orange-500/15 text-orange-400" },
  infrastructure: { icon: Cloud, className: "bg-sky-500/15 text-sky-400" },
  marketing: { icon: Megaphone, className: "bg-red-500/15 text-red-400" },
  quality: { icon: Cog, className: "bg-amber-500/15 text-amber-400" },
};

const chip =
  "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1 text-xs whitespace-nowrap text-zinc-300";

/** "$25 – $40" from the raw numbers stored in Mongo. */
function salaryLabel(job: RecruiterJob) {
  if (!job.minSalary && !job.maxSalary) return job.pay;

  if (job.minSalary && job.maxSalary) {
    return `$${job.minSalary} – $${job.maxSalary}`;
  }

  return `$${job.minSalary || job.maxSalary}`;
}

/** Pull "3+ years" out of the first qualification that mentions experience. */
function experienceLabel(job: RecruiterJob) {
  for (const item of job.qualifications) {
    const match = item.match(
      /(\d+)\s*(?:\+|plus)?\s*(?:-|–|to)?\s*(\d+)?\s*years?/i,
    );
    if (!match) continue;

    return match[2] ? `${match[1]} – ${match[2]} Years` : `${match[1]}+ Years`;
  }

  return "Not specified";
}

/** The backend stores responsibilities as one paragraph — split it into bullets. */
function responsibilityBullets(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]?/g) ?? [];

  const bullets = sentences.map((item) => item.trim()).filter(Boolean);

  return bullets.length > 0 ? bullets : [text];
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-white">
      <Icon className="size-4 text-indigo-400" />
      {children}
    </h2>
  );
}

const benefits = [
  {
    icon: ShieldCheck,
    title: "Health insurance",
    description: "Medical, dental, and vision cover for you and your family.",
  },
  {
    icon: Coins,
    title: "Performance bonus",
    description: "Annual bonus tied to company and individual goals.",
  },
  {
    icon: Laptop,
    title: "Equipment budget",
    description: "Set up your workspace with the hardware you prefer.",
  },
  {
    icon: Clock,
    title: "Flexible hours",
    description: "Plan your day around a few shared core hours.",
  },
];

export function BrowseJobDetail({ job }: { job: RecruiterJob }) {
  const [saved, setSaved] = useState(false);
  const [savedOwnerEmail, setSavedOwnerEmail] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const { data } = authClient.useSession();
  const user = data?.user;
  const router = useRouter();
  const email = user?.email;
  const isSaved = email === savedOwnerEmail && saved;

  useEffect(() => {
    if (!email) return;

    let active = true;
    getSavedJobs(email)
      .then((savedJobs) => {
        if (active) {
          setSaved(
            savedJobs.some(
              ({ job: savedJob }) =>
                (savedJob._id ?? savedJob.id) === job.id,
            ),
          );
          setSavedOwnerEmail(email);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          notify.error(
            "Could not load saved jobs",
            error instanceof Error ? error.message : "Please try again.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [email, job.id]);

  const department = departmentStyles[job.icon];
  const DepartmentIcon = department.icon;

  const isOpen = job.status === "Active";
  const responsibilities = responsibilityBullets(job.responsibilities);

  const handleToggleSaved = async () => {
    if (!email) {
      router.push(
        `/login?redirectTo=${encodeURIComponent(`/browser-jobs/${job.id}`)}`,
      );
      return;
    }

    if (user?.role !== "seeker") {
      notify.error("Access denied", "Only job seekers can save jobs.");
      return;
    }

    if (saving) return;

    try {
      setSaving(true);
      if (isSaved) {
        await removeSavedJob(job.id, email);
        setSaved(false);
        notify.success(
          "Removed from saved jobs",
          `${job.title} is no longer in your list.`,
        );
      } else {
        await saveJob(job.id, email);
        setSaved(true);
        notify.success("Job saved", `We saved ${job.title} for you.`);
      }
    } catch (error) {
      notify.error(
        "Could not update saved jobs",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const description = [
    `${job.company} is looking for a ${job.title} to join their ${job.category} team. This ${
      job.remote ? "remote" : "on-site"
    } ${job.type.toLowerCase()} role is based in ${job.location}.`,
    `You will work closely with designers, engineers, and product managers to ship work that reaches real users. The team values clear communication, small iterations, and ownership of the outcome — not just the ticket.`,
  ];

  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    // 1. Check login
    if (!user) {
      router.push(`/login?redirectTo=/browser-jobs/${job.id}`);
      return;
    }

    // 2. Only seekers can apply
    if (user.role !== "seeker") {
      notify.error("Access denied", "Only job seekers can apply for jobs.");
      return;
    }

    // 3. Prevent multiple clicks
    if (applying) return;

    try {
      setApplying(true);

      // 4. Send only userId and jobId
      await applyToJob({
        userId: user.id,
        jobId: job.id,
      });

      notify.success(
        "Application submitted",
        `You applied for ${job.title} successfully.`,
      );

      // 5. Navigate to applications page
      router.push("/dashboard/seeker/applications");
    } catch (error) {
      notify.error(
        "Application failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-3">
        <Breadcrumb
          items={[{ label: "Browse Jobs", href: "/browser-jobs" }, job.title]}
        />
        <Link
          href="/browser-jobs"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      {/* Header */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-[#111] p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <span
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-xl",
                department.className,
              )}
            >
              <DepartmentIcon className="size-7" />
            </span>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {job.title}
              </h1>

              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="size-4 text-zinc-500" />
                  {job.company}
                </span>
                <span aria-hidden className="text-zinc-600">
                  •
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="size-4" />
                  Verified Employer
                </span>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={chip}>
                  <MapPin className="size-3.5 text-zinc-500" />
                  {job.location}
                </span>
                <span className={chip}>
                  <Briefcase className="size-3.5 text-zinc-500" />
                  {job.type}
                </span>
                <span className={chip}>
                  <Globe2 className="size-3.5 text-zinc-500" />
                  {job.remote ? "Remote" : "On-site"}
                </span>
                {job.applicants > 0 && (
                  <span className={chip}>
                    <Users className="size-3.5 text-zinc-500" />
                    {job.applicants} applicants
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
              aria-pressed={isSaved}
              onClick={handleToggleSaved}
              className={cn(
                "flex size-11 items-center justify-center rounded-lg border transition-colors disabled:opacity-50",
                saved
                  ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300"
                  : "border-white/10 bg-[#141414] text-zinc-400 hover:border-white/20 hover:text-white",
              )}
            >
              <Bookmark className={cn("size-5", isSaved && "fill-current")} />
            </button>

            {/* <button
              type="button"
              disabled={!isOpen}
              onClick={handleApply}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[#4f46e5] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#5b5bf0] disabled:pointer-events-none disabled:opacity-50"
            >
              {isOpen ? "Apply Now" : "Applications closed"}
            </button> */}
            <button
              type="button"
              disabled={!isOpen || applying}
              onClick={handleApply}
              className="..."
            >
              {applying
                ? "Applying..."
                : isOpen
                  ? "Apply Now"
                  : "Applications closed"}
            </button>
          </div>
        </div>
      </div>

      {/* Key facts */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Salary"
          value={salaryLabel(job)}
          icon={Banknote}
          hint={job.frequency === "per hour" ? "Per hour" : "Per year"}
        />
        <StatCard
          label="Location"
          value={job.location}
          icon={MapPin}
          hint={job.remote ? "Remote" : "On-site"}
        />
        <StatCard
          label="Job Type"
          value={job.type}
          icon={Briefcase}
          hint={job.category}
        />
        <StatCard
          label="Experience"
          value={experienceLabel(job)}
          icon={Clock}
          hint="Required"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          {/* Description + responsibilities + requirements */}
          <section className={cn(card, "p-6")}>
            <SectionTitle icon={Briefcase}>Job Description</SectionTitle>
            <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-zinc-300">
              {description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 border-t border-white/5 pt-6">
              <h3 className="text-sm font-semibold text-white">
                Key Responsibilities
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {responsibilities.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-300"
                  >
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-white/5 pt-6">
              <h3 className="text-sm font-semibold text-white">Requirements</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-indigo-500/15 px-3 py-1 text-xs text-indigo-300 ring-1 ring-indigo-500/30 ring-inset">
                  {job.category}
                </span>
                <span className={chip}>{job.type}</span>
                <span className={chip}>
                  {job.remote ? "Remote" : "On-site"}
                </span>
              </div>

              {job.qualifications.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-500">
                  No specific requirements were listed for this role.
                </p>
              ) : (
                <ul className="mt-4 flex flex-col gap-2.5">
                  {job.qualifications.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-300"
                    >
                      <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Benefits */}
          <section className={cn(card, "p-6")}>
            <SectionTitle icon={ShieldCheck}>Benefits</SectionTitle>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="rounded-xl border border-white/5 bg-[#0f0f0f] p-4"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-[#1a1a1a]">
                      <Icon className="size-4 text-indigo-400" />
                    </span>
                    <p className="mt-3 text-sm font-medium text-white">
                      {benefit.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <section className={cn(card, "overflow-hidden")}>
            <div className="flex h-28 items-center justify-center bg-linear-to-br from-indigo-500/30 via-violet-500/15 to-transparent">
              <span className="flex size-14 items-center justify-center rounded-xl border border-white/10 bg-[#111] text-lg font-semibold text-white">
                {job.company.slice(0, 2).toUpperCase()}
              </span>
            </div>

            <div className="p-5">
              <h2 className="text-base font-semibold text-white">
                {job.company}
              </h2>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <ShieldCheck className="size-3.5" />
                Verified Employer
              </p>

              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {job.company} is hiring across its {job.category.toLowerCase()}{" "}
                organisation. The team ships customer-facing products and works
                in small, cross-functional groups.
              </p>

              <dl className="mt-4 flex flex-col gap-3 border-t border-white/5 pt-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-500">Company size</dt>
                  <dd className="text-zinc-200">51–200 employees</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-500">Industry</dt>
                  <dd className="text-right text-zinc-200">{job.category}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-500">Headquarters</dt>
                  <dd className="text-right text-zinc-200">{job.location}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-500">Deadline</dt>
                  <dd className="inline-flex items-center gap-1.5 text-right text-zinc-200">
                    <CalendarDays className="size-3.5 text-zinc-500" />
                    {job.deadline}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() =>
                  notify.info(
                    "Website not available",
                    `${job.company} has not added a website to this listing yet.`,
                  )
                }
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#141414] text-sm font-medium text-white transition-colors hover:bg-[#1c1c1c]"
              >
                <Globe2 className="size-4" />
                Visit Website
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
