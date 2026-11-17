// Helpers for reading jobs from the Express API in ../hireloop-server.

/** Base URL of the job API. Both files in src/lib/actions use this same trick. */
const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/+$/, "");

/**
 * One job document exactly as `GET /jobs` returns it.
 * Every field is optional because the database is filled in by hand,
 * so we can never be sure a field exists.
 */
export type JobDocument = {
  _id?: string;
  id?: string;
  title?: string;
  company?: string;
  category?: string;
  type?: string;
  remote?: boolean;
  location?: string;
  deadline?: string;
  minSalary?: string | number;
  maxSalary?: string | number;
  frequency?: string;
  responsibilities?: string;
  qualifications?: string[];
  applicants?: number;
  status?: string;
  [key: string]: unknown;
};

/** GET /jobs — every job in the database, newest last. */
export async function getJobsData(query = ""): Promise<JobDocument[]> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}/jobs?${query}`, { cache: "no-store" });
  } catch {
    // fetch() only rejects when the server is unreachable (or the URL is bad),
    // and the default error message is just "fetch failed", which helps nobody.
    throw new Error(
      `Could not reach the job API at ${BASE_URL}/jobs. Is hireloop-server running?`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `Failed to load jobs: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();
  return Array.isArray(data) ? (data as JobDocument[]) : [];
}

/**
 * Find one job by its id through `GET /jobs/:id`.
 * Returns `null` when the API says the id is unknown or malformed.
 */
export async function getJobById(id: string): Promise<JobDocument | null> {
  const url = `${BASE_URL}/jobs/${encodeURIComponent(id)}`;
  let response: Response;

  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    throw new Error(
      `Could not reach the job API at ${url}. Is hireloop-server running?`,
    );
  }

  // 400 = malformed ObjectId, 404 = no document. Both mean "no such job".
  if (response.status === 400 || response.status === 404) return null;

  if (!response.ok) {
    throw new Error(
      `Failed to load job: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();
  return data && typeof data === "object" ? (data as JobDocument) : null;
}
