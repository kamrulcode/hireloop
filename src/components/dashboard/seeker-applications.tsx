"use client";

import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";

import { SeekerLayout } from "@/components/dashboard/layouts";
import { type DashboardUser } from "@/components/dashboard/shell";
import {
  PageHeader,
  StatCard,
  StatusBadge,
  card,
  td,
  th,
} from "@/components/dashboard/ui";

import { authClient } from "@/lib/auth-client";
import { getMyApplications, MyApplication } from "@/lib/actions/applications";

export function SeekerApplications({ user }: { user: DashboardUser }) {
  const { data } = authClient.useSession();

  const [applications, setApplications] = useState<MyApplication[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!data?.user?.id || data.user.role !== "seeker") {
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getMyApplications(data.user.id);

        setApplications(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [data?.user?.id, data?.user?.role]);

  const totalApplied = applications.length;

  return (
    <SeekerLayout user={user} searchPlaceholder="Search applications...">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="My Applications"
          description="Track your job applications and progress."
        />

        {/* Dynamic statistics */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Applied" value={String(totalApplied)} />

          <StatCard label="Active Applications" value={String(totalApplied)} />

          <StatCard label="Interviews" value="0" />

          <StatCard label="Offers" value="0" />
        </div>

        <div className={`mt-6 ${card}`}>
          {loading ? (
            <div className="p-10 text-center text-zinc-400">
              Loading applications...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-red-400">{error}</div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Briefcase className="mb-4 size-10 text-zinc-500" />

              <h3 className="text-lg font-semibold text-white">
                No applications yet
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                Start exploring jobs and apply for positions that match your
                skills.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-175 text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className={th}>Job Title</th>
                    <th className={th}>Company</th>
                    <th className={th}>Applied</th>
                    <th className={th}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application) => {
                    const job = application.job;

                    if (!job) return null;

                    return (
                      <tr
                        key={application.applicationId}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className={td}>
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-[#1c1c1c] text-zinc-300">
                              <Briefcase className="size-4" />
                            </div>

                            <div>
                              <p className="font-medium text-white">
                                {job.title}
                              </p>

                              <p className="text-xs text-zinc-500">
                                {job.type} · {job.remote ? "Remote" : "On-site"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className={`${td} text-zinc-300`}>{job.company}</td>

                        <td className={`${td} text-zinc-400`}>
                          {new Date(application.applied).toLocaleDateString()}
                        </td>

                        <td className={td}>
                          <StatusBadge tone="gray">Applied</StatusBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SeekerLayout>
  );
}
