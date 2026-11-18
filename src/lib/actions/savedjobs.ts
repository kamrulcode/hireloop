import type { JobDocument } from "@/lib/actions/getjobs";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export type SavedJob = {
  job: JobDocument;
  savedAt: string;
};

async function savedJobsResponse(response: Response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update saved jobs");
  }

  return result;
}

export async function getSavedJobs(email: string): Promise<SavedJob[]> {
  const response = await fetch(
    `${BASE_URL}/saved-jobs?email=${encodeURIComponent(email)}`,
    { cache: "no-store" },
  );
  const result: unknown = await savedJobsResponse(response);

  if (!Array.isArray(result)) {
    throw new Error("The saved jobs API returned an invalid response");
  }

  return result as SavedJob[];
}

export async function saveJob(jobId: string, email: string) {
  const response = await fetch(`${BASE_URL}/saved-jobs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jobId, email }),
  });

  return savedJobsResponse(response);
}

export async function removeSavedJob(jobId: string, email: string) {
  const response = await fetch(`${BASE_URL}/saved-jobs`, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jobId, email }),
  });

  return savedJobsResponse(response);
}
