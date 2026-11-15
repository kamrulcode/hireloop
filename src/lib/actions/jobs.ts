import type { JobFormDataT } from "@/components/dashboard/job-form";

// Same fallback as src/lib/actions/getjobs.ts: without it, a missing
// NEXT_PUBLIC_API_BASE_URL would send requests to "undefined/jobs".
const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/+$/, "");

/**
 * An Error that also carries the HTTP status code, so callers can react to
 * specific cases (e.g. a 404 means "the job is already gone").
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** POST /jobs — create a new job. */
export async function createJob(data: JobFormDataT) {
  const response = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new ApiError(
      `Could not create the job (${response.status}).`,
      response.status,
    );
  }

  return response.json();
}

/** PUT /jobs/:id — save changes to an existing job. */
export async function updateJob(id: string, data: JobFormDataT) {
  const response = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new ApiError(
      `Could not update the job (${response.status}).`,
      response.status,
    );
  }

  return response.json();
}

/** DELETE /jobs/:id — remove a job. Throws `ApiError` with status 404 if it is already gone. */
export async function deleteJob(id: string) {
  const response = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new ApiError(
      `Could not delete the job (${response.status}).`,
      response.status,
    );
  }

  return response.json();
}
