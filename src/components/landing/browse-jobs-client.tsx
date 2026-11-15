"use client";

import { useState } from "react";
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

import type {
  JobType,
  RecruiterJob,
} from "@/components/dashboard/recruiter-jobs-data";

const JOB_TYPES: JobType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

const PAGE_SIZE = 5;

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "salary", label: "Highest Salary" },
  { value: "applicants", label: "Most Applicants" },
  { value: "title", label: "Title A–Z" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];
type ModeFilter = "remote" | "onsite";
type FilterValue = string | null;

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

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

function formatCount(count: number) {
  if (count >= 1000) {
    const value = count / 1000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}k`;
  }
  return String(count);
}

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

function FilterRow({
  name,
  label,
  count,
  checked,
  onSelect,
}: {
  name: string;
  label: string;
  count: number;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <label
        className={cn(
          "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-1.5 py-1.5 text-sm transition-colors",
          checked ? "text-white" : "text-zinc-300 hover:text-white",
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <input
            type="radio"
            name={name}
            checked={checked}
            onChange={onSelect}
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
          <span className="truncate">{label}</span>
        </span>
        <span className="text-xs text-zinc-500 tabular-nums">
          {formatCount(count)}
        </span>
      </label>
    </li>
  );
}

function FilterGroup({
  title,
  name,
  value,
  options,
  allCount,
  onChange,
}: {
  title: string;
  name: string;
  value: FilterValue;
  options: FilterOption[];
  allCount: number;
  onChange: (value: FilterValue) => void;
}) {
  return (
    <div className="border-t border-white/5 pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
        {title}
      </h3>
      <ul className="mt-2 flex flex-col gap-0.5">
        <FilterRow
          name={name}
          label="All"
          count={allCount}
          checked={value === null}
          onSelect={() => onChange(null)}
        />
        {options.map((option) => (
          <FilterRow
            key={option.value}
            name={name}
            label={option.label}
            count={option.count}
            checked={value === option.value}
            onSelect={() => onChange(option.value)}
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
  onToggleSaved,
}: {
  job: RecruiterJob;
  saved: boolean;
  onToggleSaved: (id: string) => void;
}) {
  const department = departmentStyles[job.icon];
  const DepartmentIcon = department.icon;
  const locationMentionsRemote = /remote/i.test(job.location);

  return (
    <article className="group rounded-xl border border-white/10 bg-[#111] p-5 transition-colors hover:border-white/20 hover:bg-[#141414]">
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
              onClick={() => onToggleSaved(job.id)}
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
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
    </article>
  );
}

export function BrowseJobs({ jobs }: { jobs: RecruiterJob[] }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<JobType | null>(null);
  const [modeFilter, setModeFilter] = useState<ModeFilter | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const normalizedQuery = query.trim().toLowerCase();

  const matchesType = (job: RecruiterJob) =>
    typeFilter === null || job.type === typeFilter;
  const matchesMode = (job: RecruiterJob) =>
    modeFilter === null || job.remote === (modeFilter === "remote");
  const matchesCategory = (job: RecruiterJob) =>
    categoryFilter === null || job.category === categoryFilter;

  const searched = normalizedQuery
    ? jobs.filter((job) =>
        [job.title, job.company, job.location, job.category, job.department]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : jobs;

  const filtered = searched.filter(
    (job) => matchesType(job) && matchesMode(job) && matchesCategory(job),
  );

  // Faceted counts: each group's numbers ignore its own selection but respect
  // the other groups, so every option shows how many jobs you would get.
  const typePool = searched.filter(
    (job) => matchesMode(job) && matchesCategory(job),
  );
  const modePool = searched.filter(
    (job) => matchesType(job) && matchesCategory(job),
  );
  const categoryPool = searched.filter(
    (job) => matchesType(job) && matchesMode(job),
  );

  // Options themselves come from the full dataset, so a search that hides a
  // type or category never makes the filter disappear.
  const typeOptions: FilterOption[] = JOB_TYPES.filter((type) =>
    jobs.some((job) => job.type === type),
  ).map((type) => ({
    value: type,
    label: type,
    count: typePool.filter((job) => job.type === type).length,
  }));

  const modeOptions: FilterOption[] = [
    { value: "remote", label: "Remote", remote: true },
    { value: "onsite", label: "On-site", remote: false },
  ]
    .filter((option) => jobs.some((job) => job.remote === option.remote))
    .map((option) => ({
      value: option.value,
      label: option.label,
      count: modePool.filter((job) => job.remote === option.remote).length,
    }));

  const categoryOptions: FilterOption[] = Array.from(
    new Set(jobs.map((job) => job.category)),
  )
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({
      value: category,
      label: category,
      count: categoryPool.filter((job) => job.category === category).length,
    }));

  // The API returns the newest job last, so "Most Recent" simply reverses it.
  const sorted = (() => {
    const list = [...filtered];

    switch (sort) {
      case "salary":
        return list.sort((a, b) => salaryScore(b) - salaryScore(a));
      case "applicants":
        return list.sort((a, b) => b.applicants - a.applicants);
      case "title":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return list.reverse();
    }
  })();

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageJobs = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const hasFilters =
    typeFilter !== null ||
    modeFilter !== null ||
    categoryFilter !== null ||
    normalizedQuery.length > 0;

  function selectType(value: FilterValue) {
    setTypeFilter(value as JobType | null);
    setPage(1);
  }

  function selectMode(value: FilterValue) {
    setModeFilter(value as ModeFilter | null);
    setPage(1);
  }

  function selectCategory(value: FilterValue) {
    setCategoryFilter(value);
    setPage(1);
  }

  function toggleSaved(id: string) {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function resetFilters() {
    setQuery("");
    setTypeFilter(null);
    setModeFilter(null);
    setCategoryFilter(null);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Search */}
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
        }}
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111] p-3 shadow-[0_8px_40px_rgba(0,0,0,0.35)] sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
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
                  onClick={resetFilters}
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
                value={typeFilter}
                options={typeOptions}
                allCount={typePool.length}
                onChange={selectType}
              />
              <FilterGroup
                title="Work Mode"
                name="filter-work-mode"
                value={modeFilter}
                options={modeOptions}
                allCount={modePool.length}
                onChange={selectMode}
              />
              <FilterGroup
                title="Category"
                name="filter-category"
                value={categoryFilter}
                options={categoryOptions}
                allCount={categoryPool.length}
                onChange={selectCategory}
              />
            </div>

            <p className="mt-5 border-t border-white/5 pt-4 text-xs text-zinc-600">
              One option per filter — counts follow your search.
            </p>
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
                  onChange={(event) => {
                    setSort(event.target.value as SortKey);
                    setPage(1);
                  }}
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
              {normalizedQuery.length > 0 && (
                <ActiveFilter
                  label={`“${query.trim()}”`}
                  onClear={() => {
                    setQuery("");
                    setPage(1);
                  }}
                />
              )}
              {typeFilter && (
                <ActiveFilter
                  label={typeFilter}
                  onClear={() => selectType(null)}
                />
              )}
              {modeFilter && (
                <ActiveFilter
                  label={modeFilter === "remote" ? "Remote" : "On-site"}
                  onClear={() => selectMode(null)}
                />
              )}
              {categoryFilter && (
                <ActiveFilter
                  label={categoryFilter}
                  onClear={() => selectCategory(null)}
                />
              )}
              <button
                type="button"
                onClick={resetFilters}
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
                  onClick={resetFilters}
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
                  saved={savedIds.includes(job.id)}
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
                onClick={() => setPage(Math.max(1, currentPage - 1))}
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
                    onClick={() => setPage(item)}
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
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
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
