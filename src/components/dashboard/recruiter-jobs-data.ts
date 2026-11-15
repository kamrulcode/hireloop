import type { JobDocument } from "@/lib/actions/getjobs";

export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export type RecruiterJob = {
  id: string;
  title: string;
  department: string;
  company: string;
  location: string;
  remote: boolean;
  type: JobType;
  category: string;
  pay: string;
  minSalary: string;
  maxSalary: string;
  frequency: "per hour" | "per year";
  applicants: number;
  status: "Active" | "Expired";
  deadline: string;
  deadlineIso: string;
  postedAgo: string;
  responsibilities: string;
  qualifications: string[];
  icon: "engineering" | "design" | "infrastructure" | "marketing" | "quality";
};

const categoryToDepartment: Record<string, string> = {
  "Engineering & Tech": "Engineering",
  Design: "Design",
  Infrastructure: "Infrastructure",
  Marketing: "Marketing",
  Quality: "Quality",
  Product: "Engineering",
};

const categoryToIcon: Record<string, RecruiterJob["icon"]> = {
  "Engineering & Tech": "engineering",
  Design: "design",
  Infrastructure: "infrastructure",
  Marketing: "marketing",
  Quality: "quality",
  Product: "engineering",
};

/**
 * The database stores job types in several spellings ("full-time",
 * "Full-time", "part time", …), so normalise them to the four canonical
 * `JobType` values the UI filters on.
 */
const jobTypeAliases: Record<string, JobType> = {
  "full-time": "Full-time",
  "full time": "Full-time",
  fulltime: "Full-time",
  "part-time": "Part-time",
  "part time": "Part-time",
  parttime: "Part-time",
  contract: "Contract",
  contractor: "Contract",
  "contract-to-hire": "Contract",
  internship: "Internship",
  intern: "Internship",
};

function normalizeJobType(value: unknown): JobType {
  if (typeof value !== "string") return "Full-time";
  return jobTypeAliases[value.trim().toLowerCase()] ?? "Full-time";
}

function formatDeadline(value?: string) {
  if (!value) return "No deadline";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPay(job: JobDocument) {
  const minSalary = job.minSalary;
  const maxSalary = job.maxSalary;
  const frequency = job.frequency ?? "";

  const min =
    minSalary === undefined || minSalary === null || minSalary === ""
      ? ""
      : String(minSalary);
  const max =
    maxSalary === undefined || maxSalary === null || maxSalary === ""
      ? ""
      : String(maxSalary);
  const suffix = frequency ? ` / ${String(frequency)}` : "";

  if (min && max) return `${min} – ${max}${suffix}`;
  if (min || max) return `${min || max}${suffix}`;
  return "Compensation not listed";
}

/**
 * Convert one document from `GET /jobs` (see `JobDocument`) into the shape
 * the dashboard UI needs. Every field falls back to a safe value, so a
 * half-filled document can never crash a page.
 *
 * `index` is only used to build a fake id for documents that have no `_id`;
 * normal database documents always have one.
 */
export function toRecruiterJob(job: JobDocument, index = 0): RecruiterJob {
  const category =
    typeof job.category === "string" ? job.category : "Engineering & Tech";
  const department = categoryToDepartment[category] ?? "Engineering";
  const type = normalizeJobType(job.type);
  const location = typeof job.location === "string" ? job.location : "Remote";
  const remote =
    typeof job.remote === "boolean" ? job.remote : /remote/i.test(location);
  const rawStatus = typeof job.status === "string" ? job.status : undefined;
  const deadline = typeof job.deadline === "string" ? job.deadline : "";
  const applicants = typeof job.applicants === "number" ? job.applicants : 0;
  const responsibilities =
    typeof job.responsibilities === "string"
      ? job.responsibilities
      : "No detailed responsibilities listed yet.";
  const qualifications = Array.isArray(job.qualifications)
    ? job.qualifications.filter(
        (item): item is string => typeof item === "string",
      )
    : [];

  const normalizedId =
    typeof job._id === "string"
      ? job._id
      : typeof job.id === "string"
        ? job.id
        : `job-${index}`;

  return {
    id: normalizedId,
    title: typeof job.title === "string" ? job.title : "Untitled position",
    department,
    company:
      typeof job.company === "string" ? job.company : "HirePulse Network",
    location,
    remote,
    type,
    category,
    pay: formatPay(job),
    minSalary:
      job.minSalary === undefined || job.minSalary === null
        ? ""
        : String(job.minSalary),
    maxSalary:
      job.maxSalary === undefined || job.maxSalary === null
        ? ""
        : String(job.maxSalary),
    frequency: job.frequency === "per hour" ? "per hour" : "per year",
    applicants,
    status: rawStatus === "Expired" ? "Expired" : "Active",
    deadline: formatDeadline(deadline),
    deadlineIso: deadline,
    postedAgo: "Posted recently",
    responsibilities,
    qualifications,
    icon: categoryToIcon[category] ?? "engineering",
  };
}
