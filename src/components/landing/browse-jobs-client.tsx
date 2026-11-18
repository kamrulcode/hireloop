"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cloud,
  Cog,
  MapPin,
  Megaphone,
  PenTool,
  Search,
  SlidersHorizontal,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

import {
  JOB_CATEGORIES,
  JOB_TYPES,
  type RecruiterJob,
} from "@/components/dashboard/recruiter-jobs-data";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getSavedJobs, removeSavedJob, saveJob } from "@/lib/actions/savedjobs";
import { notify } from "@/components/ui/toast";

const PAGE_SIZE = 5;

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "salary", label: "Highest Salary" },
  { value: "applicants", label: "Most Applicants" },
  { value: "title", label: "Title A–Z" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

/** Same department → icon/colour mapping the dashboard uses. */
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
  "inline-flex items-center rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1 text-xs whitespace-nowrap text-zinc-300";

const pagerBtn =
  "flex size-9 items-center justify-center rounded-lg border border-white/10 bg-[#111] text-sm text-zinc-400 transition-colors hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-40";

/** Turn a stored salary string ("120k", "95000", …) into a sortable number. */
function salaryScore(job: RecruiterJob) {
  const raw = (job.maxSalary || job.minSalary || "").trim();
  if (!raw) return 0;

  const numeric = Number.parseFloat(raw.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(numeric)) return 0;

  return /k\s*$/i.test(raw) ? numeric * 1000 : numeric;
}

/** 1 … 4 5 6 … 12 — collapse long page ranges the way the mockup does. */
function pageItems(current: number, total: number): (number | "ellipsis")[] {
  const items: (number | "ellipsis")[] = [];

  for (let page = 1; page <= total; page += 1) {
    const isEdge = page === 1 || page === total;
    const isNearCurrent = Math.abs(page - current) <= 1;

    if (isEdge || isNearCurrent) {
      items.push(page);
    } else if (items[items.length - 1] !== "ellipsis") {
      items.push("ellipsis");
    }
  }

  return items;
}

function RadioRow({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li>
      <label
        className={cn(
          "flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-sm transition-colors",
          checked ? "text-white" : "text-zinc-300 hover:text-white",
        )}
      >
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-white/30",
            checked
              ? "border-[#4f46e5] bg-[#4f46e5]"
              : "border-white/15 bg-transparent",
          )}
        >
          {checked && <span className="size-1.5 rounded-full bg-white" />}
        </span>
        {label}
      </label>
    </li>
  );
}

function FilterGroup({
  title,
  name,
  value,
  options,
  onChange,
}: {
  title: string;
  name: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (value: string | null) => void;
}) {
  return (
    <div className="border-t border-white/5 pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
        {title}
      </h3>
      <ul className="mt-2 flex flex-col gap-0.5">
        <RadioRow
          name={name}
          label="All"
          checked={value === null}
          onChange={() => onChange(null)}
        />
        {options.map((option) => (
          <RadioRow
            key={option.value}
            name={name}
            label={option.label}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
        ))}
      </ul>
    </div>
  );
}

function ActiveFilter({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-1 text-xs text-indigo-200">
      {label}
      <button
        type="button"
        onClick={onClear}
        aria-label={`Clear ${label} filter`}
        className="text-indigo-300/70 transition-colors hover:text-white"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

function JobCard({
  job,
  saved,
  saving,
  onToggleSaved,
}: {
  job: RecruiterJob;
  saved: boolean;
  saving: boolean;
  onToggleSaved: (id: string) => void;
}) {
  const department = departmentStyles[job.icon];
  const DepartmentIcon = department.icon;
  const locationMentionsRemote = /remote/i.test(job.location);

  return (
    <article className="group relative rounded-xl border border-white/10 bg-[#111] p-5 transition-colors hover:border-white/20 hover:bg-[#141414]">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            department.className,
          )}
        >
          <DepartmentIcon className="size-6" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-white transition-colors group-hover:text-indigo-300">
              {job.title}
            </h2>

            <button
              type="button"
              aria-label={
                saved
                  ? `Remove ${job.title} from saved jobs`
                  : `Save ${job.title}`
              }
              aria-pressed={saved}
              disabled={saving}
              onClick={() => onToggleSaved(job.id)}
              className={cn(
                "relative z-20 flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:opacity-50",
                saved
                  ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300"
                  : "border-white/10 bg-[#141414] text-zinc-500 hover:border-white/20 hover:text-white",
              )}
            >
              <Bookmark className={cn("size-4", saved && "fill-current")} />
            </button>
          </div>

          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-400">
            <span>{job.company}</span>
            <span aria-hidden className="text-zinc-600">
              •
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 text-zinc-500" />
              {job.location}
              {job.remote && !locationMentionsRemote && (
                <span className="text-zinc-500">(Remote)</span>
              )}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={chip}>{job.pay}</span>
            <span className={chip}>{job.type}</span>

            {job.status === "Active" && (
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs whitespace-nowrap text-emerald-400 ring-1 ring-emerald-500/30 ring-inset">
                Easy Apply
              </span>
            )}

            {job.applicants >= 50 && (
              <span className="inline-flex items-center rounded-full bg-amber-500/15 px-3 py-1 text-xs whitespace-nowrap text-amber-400 ring-1 ring-amber-500/30 ring-inset">
                Hot Job
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stretched link makes the whole card clickable without nesting the
          bookmark button inside an anchor. */}
      <Link
        href={`/browser-jobs/${job.id}`}
        aria-label={`View details for ${job.title}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
      />
    </article>
  );
}

export function BrowseJobs({ jobs }: { jobs: RecruiterJob[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = authClient.useSession();
  const user = data?.user;
  const email = user?.email;
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedOwnerEmail, setSavedOwnerEmail] = useState<string | undefined>();
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const currentSavedIds = email === savedOwnerEmail ? savedIds : [];

  useEffect(() => {
    if (!email) return;

    let active = true;
    getSavedJobs(email)
      .then((savedJobs) => {
        if (active) {
          setSavedIds(
            savedJobs.map(({ job }) => job._id ?? job.id ?? ""),
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
  }, [email]);

  // All filter state lives in the URL, so it survives refreshes and is
  // shareable. The server page reads the same params and queries the API.
  const search = searchParams.get("search")?.trim() ?? "";
  const type = searchParams.get("type");
  const remote = searchParams.get("remote");
  const category = searchParams.get("category");

  const sortParam = searchParams.get("sort");
  const sort: SortKey = SORT_OPTIONS.some(
    (option) => option.value === sortParam,
  )
    ? (sortParam as SortKey)
    : "recent";

  const pageParam = Number(searchParams.get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  function setParam(key: string, value: string | null, resetPage = true) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Any filter change starts from page 1 again.
    if (resetPage) params.delete("page");

    const query = params.toString();
    router.push(query ? `/browser-jobs?${query}` : "/browser-jobs");
  }

  function goToPage(target: number) {
    setParam("page", target > 1 ? String(target) : null, false);
  }

  const sorted = (() => {
    const list = [...jobs];

    switch (sort) {
      case "salary":
        return list.sort((a, b) => salaryScore(b) - salaryScore(a));
      case "applicants":
        return list.sort((a, b) => b.applicants - a.applicants);
      case "title":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        // The API returns the newest job last.
        return list.reverse();
    }
  })();

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageJobs = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const hasFilters = Boolean(search || type || remote || category);

  async function toggleSaved(id: string) {
    if (!email) {
      router.push(`/login?redirectTo=${encodeURIComponent("/browser-jobs")}`);
      return;
    }

    if (user?.role !== "seeker") {
      notify.error("Access denied", "Only job seekers can save jobs.");
      return;
    }

    if (savingIds.includes(id)) return;
    setSavingIds((current) => [...current, id]);

    try {
      const isSaved = currentSavedIds.includes(id);
      if (isSaved) {
        await removeSavedJob(id, email);
        setSavedIds((current) => current.filter((savedId) => savedId !== id));
        notify.success("Removed from saved jobs", "The job was removed from your list.");
      } else {
        await saveJob(id, email);
        setSavedIds((current) => [...current, id]);
        notify.success("Job saved", "The job was added to your saved jobs.");
      }
    } catch (error) {
      notify.error(
        "Could not update saved jobs",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setSavingIds((current) => current.filter((savingId) => savingId !== id));
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Search */}
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const value = String(
            new FormData(event.currentTarget).get("search") ?? "",
          ).trim();
          setParam("search", value || null);
        }}
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111] p-3 shadow-[0_8px_40px_rgba(0,0,0,0.35)] sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            key={search}
            name="search"
            type="search"
            defaultValue={search}
            placeholder="Search by job title, keywords..."
            aria-label="Search jobs"
            className="h-12 w-full rounded-xl border border-white/10 bg-[#0d0d0d] pr-4 pl-11 text-sm text-white outline-none placeholder:text-zinc-600 focus-visible:border-white/30"
          />
        </div>
        <button
          type="submit"
          className="h-12 shrink-0 rounded-xl bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 sm:px-8"
        >
          Search Jobs
        </button>
      </form>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Filters */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-white/10 bg-[#111] p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                <SlidersHorizontal className="size-4 text-zinc-500" />
                Filters
              </h2>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => router.push("/browser-jobs")}
                  className="text-xs text-zinc-500 transition-colors hover:text-white"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <FilterGroup
                title="Job Type"
                name="filter-job-type"
                value={type}
                options={JOB_TYPES.map((item) => ({
                  value: item,
                  label: item,
                }))}
                onChange={(value) => setParam("type", value)}
              />
              <FilterGroup
                title="Work Mode"
                name="filter-work-mode"
                value={remote}
                options={[
                  { value: "true", label: "Remote" },
                  { value: "false", label: "On-site" },
                ]}
                onChange={(value) => setParam("remote", value)}
              />
              <FilterGroup
                title="Category"
                name="filter-category"
                value={category}
                options={JOB_CATEGORIES.map((item) => ({
                  value: item,
                  label: item,
                }))}
                onChange={(value) => setParam("category", value)}
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              Found{" "}
              <span className="text-indigo-400">
                {sorted.length.toLocaleString("en-US")}
              </span>{" "}
              Professional Jobs
            </h1>

            <label className="flex items-center gap-2 text-sm text-zinc-500">
              <span>Sort by:</span>
              <span className="relative">
                <select
                  value={sort}
                  onChange={(event) => setParam("sort", event.target.value)}
                  className="h-9 appearance-none rounded-lg border border-white/10 bg-[#141414] pr-9 pl-3 text-sm text-white outline-none focus-visible:border-white/30"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-zinc-500" />
              </span>
            </label>
          </div>

          {hasFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {search && (
                <ActiveFilter
                  label={`“${search}”`}
                  onClear={() => setParam("search", null)}
                />
              )}
              {type && (
                <ActiveFilter
                  label={type}
                  onClear={() => setParam("type", null)}
                />
              )}
              {remote && (
                <ActiveFilter
                  label={remote === "true" ? "Remote" : "On-site"}
                  onClear={() => setParam("remote", null)}
                />
              )}
              {category && (
                <ActiveFilter
                  label={category}
                  onClear={() => setParam("category", null)}
                />
              )}
              <button
                type="button"
                onClick={() => router.push("/browser-jobs")}
                className="ml-1 text-xs text-zinc-500 transition-colors hover:text-white"
              >
                Clear all
              </button>
            </div>
          )}

          {pageJobs.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#111] px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-[#171717]">
                <Search className="size-5 text-zinc-500" />
              </span>
              <p className="mt-4 text-base font-semibold text-white">
                No jobs match your search
              </p>
              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                Try a different keyword or clear your filters to see every open
                role.
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => router.push("/browser-jobs")}
                  className="mt-5 h-10 rounded-lg bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {pageJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={currentSavedIds.includes(job.id)}
                  saving={savingIds.includes(job.id)}
                  onToggleSaved={toggleSaved}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-8 flex items-center justify-center gap-1.5"
            >
              <button
                type="button"
                aria-label="Previous page"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={pagerBtn}
              >
                <ChevronLeft className="size-4" />
              </button>

              {pageItems(currentPage, totalPages).map((item, index) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-sm text-zinc-600"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => goToPage(item)}
                    aria-label={`Page ${item}`}
                    aria-current={item === currentPage ? "page" : undefined}
                    className={cn(
                      pagerBtn,
                      item === currentPage &&
                        "border-[#4f46e5] bg-[#4f46e5] text-white hover:border-[#5b5bf0] hover:bg-[#5b5bf0]",
                    )}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                type="button"
                aria-label="Next page"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={pagerBtn}
              >
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
