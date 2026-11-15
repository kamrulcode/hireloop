"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronDown,
  Euro,
  Globe2,
  MapPin,
} from "lucide-react";
import {
  type JobType,
  type RecruiterJob,
} from "@/components/dashboard/recruiter-jobs-data";
import { Breadcrumb, btnIndigo } from "@/components/dashboard/ui";
import { cn } from "cn";
import { createJob, updateJob } from "@/lib/actions/jobs";

const jobTypes: JobType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

const categories = [
  "Engineering & Tech",
  "Design",
  "Marketing",
  "Infrastructure",
  "Quality",
  "Product",
];

const inputClass =
  "h-11 w-full rounded-lg border border-white/10 bg-[#151515] px-3.5 text-sm text-white outline-none placeholder:text-zinc-600 focus-visible:border-indigo-500/60";
const textareaClass =
  "w-full rounded-lg border border-white/10 bg-[#151515] px-3.5 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-zinc-600 focus-visible:border-indigo-500/60";

export type JobFormDataT = {
  title: string;
  company: string;
  category: string;
  type: JobType;
  remote: boolean;
  location: string;
  deadline: string;
  minSalary: string;
  maxSalary: string;
  frequency: string;
  responsibilities: string;
  qualifications: string[];
};

function Label({
  htmlFor,
  children,
  required,
  trailing,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  trailing?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <label htmlFor={htmlFor} className="text-sm font-medium text-white">
        {children}
        {required && <span className="text-red-400"> *</span>}
      </label>
      {trailing && <span className="text-xs text-zinc-500">{trailing}</span>}
    </div>
  );
}

function IconInput({
  id,
  icon: Icon,
  ...props
}: { id: string; icon: typeof MapPin } & React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500" />
      <input id={id} {...props} className={cn(inputClass, "pl-10")} />
    </div>
  );
}

function FormSelect({
  id,
  defaultValue,
  options,
  name,
  required,
}: {
  id: string;
  defaultValue: string;
  options: string[];
  name: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className={cn(inputClass, "appearance-none pr-10")}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-zinc-500" />
    </div>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-center gap-3 text-lg font-semibold text-white">
        <span className="size-2.5 rounded-full bg-indigo-500" />
        {step}. {title}
      </h2>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

export function JobForm({
  mode,
  job,
}: {
  mode: "create" | "update";
  job?: RecruiterJob;
}) {
  const isCreate = mode === "create";
  const router = useRouter();
  const [jobType, setJobType] = useState<JobType>(job?.type ?? "Full-time");
  const [remote, setRemote] = useState(job?.remote ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qualifications = (
    job?.qualifications ?? [
      "3+ years of experience with React, TypeScript, and modern state architectures",
      "Solid understanding of DOM performance and component-driven designs",
      "Experience partnering closely with product teams and UI/UX designers",
    ]
  )
    .map((item) => `• ${item}`)
    .join("\n");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const submittedType = formData.get("type");
    const data: JobFormDataT = {
      title: String(formData.get("title") ?? ""),
      company: String(formData.get("company") ?? ""),
      category: String(formData.get("category") ?? ""),
      type: jobTypes.find((type) => type === submittedType) ?? "Full-time",
      remote: formData.get("remote") === "true",
      location: String(formData.get("location") ?? ""),
      deadline: String(formData.get("deadline") ?? ""),
      minSalary: String(formData.get("minSalary") ?? ""),
      maxSalary: String(formData.get("maxSalary") ?? ""),
      frequency: String(formData.get("frequency") ?? ""),
      responsibilities: String(formData.get("responsibilities") ?? ""),
      qualifications: String(formData.get("qualifications") ?? "")
        .split(/\r?\n/)
        .map((item) => item.replace(/^•\s*/, "").trim())
        .filter(Boolean),
    };

    setSaving(true);
    setError(null);

    try {
      if (isCreate) {
        await createJob(data);
      } else if (job) {
        // mode="update": PUT /jobs/:id instead of creating a duplicate job.
        await updateJob(job.id, data);
      }

      // Send the recruiter back to the list and re-run the server component
      // so the table shows the new / updated row.
      router.push("/manage-jobs");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Breadcrumb
        items={
          isCreate
            ? ["Manage Jobs", "Create New Listing"]
            : ["Manage Jobs", "Job Listings & Postings", "Update Job Post"]
        }
      />

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {isCreate ? "Post a New Job" : "Update Job Post"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {isCreate
              ? "Fill in the position specifications to attract qualified talent across our network."
              : "Modify position specifications, compensation range, and candidate requirements for this listing."}
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-12">
        <Section step={1} title="Basic Information">
          <div>
            <Label htmlFor="job-title" required>
              Job Title
            </Label>
            <input
              id="job-title"
              name="title"
              required
              defaultValue={job?.title ?? "Frontend Developer"}
              placeholder="e.g. Frontend Developer"
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="company-name" required>
                Company Name
              </Label>
              <IconInput
                id="company-name"
                name="company"
                icon={Building2}
                required
                defaultValue={job?.company ?? "HirePulse Network"}
                placeholder="e.g. HirePulse Network"
              />
            </div>
            <div>
              <Label htmlFor="job-category" required>
                Job Category
              </Label>
              <FormSelect
                id="job-category"
                name="category"
                required
                defaultValue={job?.category ?? "Engineering & Tech"}
                options={categories}
              />
            </div>
          </div>

          <div>
            <Label required>Job Type</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setJobType(type)}
                  aria-pressed={jobType === type}
                  className={cn(
                    "h-11 rounded-lg border text-sm transition-colors",
                    jobType === type
                      ? "border-indigo-500 bg-indigo-500/10 text-white"
                      : "border-white/10 bg-[#151515] text-zinc-400 hover:text-white",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
            <input type="hidden" name="type" value={jobType} />
          </div>
        </Section>

        <Section step={2} title="Location, Compensation & Timeline">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#151515] px-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <Globe2 className="size-5 shrink-0 text-zinc-400" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  Remote Work Allowed (isRemote)
                </p>
                <p className="text-xs text-zinc-500">
                  Enable worldwide or distributed candidate applications
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={remote}
              aria-label="Remote work allowed"
              onClick={() => setRemote((value) => !value)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                remote ? "bg-white/25" : "bg-white/10",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 size-4 rounded-full bg-white transition-all",
                  remote ? "left-6" : "left-1",
                )}
              />
            </button>
            <input type="hidden" name="remote" value={String(remote)} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="job-location" trailing="Required">
                Job Location (location)
              </Label>
              <IconInput
                id="job-location"
                name="location"
                icon={MapPin}
                required
                defaultValue={job?.location ?? "New York, USA"}
                placeholder="e.g. New York, USA"
              />
            </div>
            <div>
              <Label htmlFor="deadline">Application Deadline (deadline)</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  defaultValue={job?.deadlineIso ?? "2025-05-30"}
                  className={cn(inputClass, "pl-10 scheme-dark")}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="min-salary">Min Salary / Rate</Label>
              <div className="relative">
                <Euro className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="min-salary"
                  name="minSalary"
                  inputMode="decimal"
                  defaultValue={job?.minSalary ?? "25"}
                  className={cn(inputClass, "pl-10")}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="max-salary">Max Salary / Rate</Label>
              <div className="relative">
                <Euro className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="max-salary"
                  name="maxSalary"
                  inputMode="decimal"
                  defaultValue={job?.maxSalary ?? "40"}
                  className={cn(inputClass, "pl-10")}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <FormSelect
                id="frequency"
                name="frequency"
                defaultValue={job?.frequency ?? "per hour"}
                options={["per hour", "per year"]}
              />
            </div>
          </div>
        </Section>

        <Section step={3} title="Responsibilities & Requirements">
          <div>
            <Label htmlFor="responsibilities" required>
              Key Responsibilities
            </Label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              rows={4}
              required
              defaultValue={
                job?.responsibilities ??
                "Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products."
              }
              className={textareaClass}
            />
          </div>
          <div>
            <Label htmlFor="qualifications" required>
              Qualifications & Requirements
            </Label>
            <textarea
              id="qualifications"
              name="qualifications"
              rows={3}
              required
              defaultValue={qualifications}
              className={textareaClass}
            />
          </div>
        </Section>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-8 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <div className="mt-10">
        <button
          type="submit"
          disabled={saving}
          className={cn(btnIndigo, saving && "opacity-60")}
        >
          {saving ? "Saving..." : isCreate ? "Publish Job" : "Update Job"}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </form>
  );
}
