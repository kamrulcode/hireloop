"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Briefcase, Clock, MapPin, Wallet } from "lucide-react";
import { SeekerLayout } from "@/components/dashboard/layouts";
import { type DashboardUser } from "@/components/dashboard/shell";
import { card } from "@/components/dashboard/ui";
import { cn } from "cn";
import { notify } from "@/components/ui/toast";
import {
  getSavedJobs,
  removeSavedJob,
  type SavedJob,
} from "@/lib/actions/savedjobs";
import {
  toRecruiterJob,
  type RecruiterJob,
} from "@/components/dashboard/recruiter-jobs-data";

function savedDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Saved recently"
    : `Saved ${date.toLocaleDateString()}`;
}

export function SeekerSavedJobs({ user }: { user: DashboardUser }) {
  const email = user.email ?? "";
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    getSavedJobs(email)
      .then((jobs) => {
        if (active) setSavedJobs(jobs);
      })
      .catch((error: unknown) => {
        if (active) {
          notify.error(
            "Could not load saved jobs",
            error instanceof Error ? error.message : "Please try again.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [email]);

  async function handleRemove(jobId: string) {
    if (removingIds.includes(jobId)) return;

    setRemovingIds((current) => [...current, jobId]);
    try {
      await removeSavedJob(jobId, email);
      setSavedJobs((current) =>
        current.filter(
          ({ job }) => (job._id ?? job.id) !== jobId,
        ),
      );
      notify.success("Job removed", "The job was removed from your saved list.");
    } catch (error) {
      notify.error(
        "Could not remove saved job",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setRemovingIds((current) =>
        current.filter((removingId) => removingId !== jobId),
      );
    }
  }

  return (
    <SeekerLayout
      user={user}
      searchPlaceholder="Search jobs, companies, or skills..."
      topbarExtra={
        <Link
          href="/browser-jobs"
          className="hidden h-9 items-center rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200 sm:inline-flex"
        >
          Browse Jobs
        </Link>
      }
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Saved Jobs</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Manage and track your bookmarked opportunities.
            </p>
          </div>
          <div className={cn(card, "flex items-center gap-3 px-4 py-3")}>
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#1c1c1c]">
              <Bookmark className="size-4 text-zinc-200" />
            </span>
            <div>
              <p className="text-xs text-zinc-400">Total Saved</p>
              <p className="text-2xl leading-tight font-semibold text-white">
                {savedJobs.length}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-zinc-500">Loading saved jobs...</p>
        ) : savedJobs.length === 0 ? (
          <div className={cn(card, "mt-6 px-6 py-14 text-center")}>
            <Briefcase className="mx-auto size-8 text-zinc-500" />
            <p className="mt-4 text-base font-semibold text-white">
              No saved jobs yet
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Bookmark a job to keep it here for later.
            </p>
            <Link
              href="/browser-jobs"
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            {savedJobs.map(({ job: document, savedAt }, index) => {
              const job = toRecruiterJob(document, index);
              const closed = job.status !== "Active";
              return (
                <SavedJobCard
                  key={job.id}
                  job={job}
                  savedAt={savedAt}
                  closed={closed}
                  removing={removingIds.includes(job.id)}
                  onRemove={handleRemove}
                />
              );
            })}
          </div>
        )}
      </div>
    </SeekerLayout>
  );
}

function SavedJobCard({
  job,
  savedAt,
  closed,
  removing,
  onRemove,
}: {
  job: RecruiterJob;
  savedAt: string;
  closed: boolean;
  removing: boolean;
  onRemove: (id: string) => void;
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-5 rounded-xl border border-white/10 p-6 lg:flex-row lg:items-center",
        closed ? "bg-[#0d0d0d]" : "bg-[#111]",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#141414]">
          <Briefcase className="size-5 text-zinc-300" />
        </span>
        <div className="min-w-0">
          <h2 className={cn("text-lg font-semibold", closed ? "text-zinc-500" : "text-white")}>
            {job.title}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{job.company}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs text-zinc-300">
              <MapPin className="size-3.5 text-zinc-500" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs text-zinc-300">
              <Wallet className="size-3.5 text-zinc-500" />
              {job.pay}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
        <p className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Clock className="size-3.5" />
          {savedDate(savedAt)}
        </p>
        <button
          type="button"
          disabled={removing}
          onClick={() => onRemove(job.id)}
          className="h-9 rounded-lg border border-white/10 px-4 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          {removing ? "Removing..." : "Remove"}
        </button>
        {closed ? (
          <span className="text-xs text-red-400">Applications closed</span>
        ) : (
          <Link
            href={`/browser-jobs/${job.id}`}
            className="inline-flex h-9 items-center rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
          >
            View Job
          </Link>
        )}
      </div>
    </article>
  );
}
