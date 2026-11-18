const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export type ApplicationData = {
  userId: string;
  jobId: string;
};

export type MyApplication = {
  applicationId: string;
  applied: string;
  status: "Applied";
  job: {
    _id: string;
    title: string;
    company: string;
    type: string;
    remote: boolean;
    category: string;
    location: string;
  } | null;
};
export async function applyToJob(data: ApplicationData) {
  const response = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit application");
  }

  return result;
}

export async function getMyApplications(userId: string) {
  const response = await fetch(
    `${BASE_URL}/applications?userId=${encodeURIComponent(userId)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to load applications");
  }

  return response.json();
}
