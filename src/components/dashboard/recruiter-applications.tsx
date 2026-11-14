"use client";

import {
  Download,
  MessageSquare,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { RecruiterLayout } from "@/components/dashboard/layouts";
import { type DashboardUser } from "@/components/dashboard/shell";
import {
  InitialAvatar,
  PageHeader,
  SelectBox,
  StatCard,
  StatusBadge,
  btnOutline,
  card,
  inputClass,
  td,
  th,
  type Tone,
} from "@/components/dashboard/ui";
import { cn } from "cn";

type Candidate = {
  name: string;
  role: string;
  date: string;
  experience: string;
  status: "New" | "Reviewing" | "Interviewing" | "Rejected" | "Hired";
  avatar: string;
};

const candidates: Candidate[] = [
  {
    name: "Julianne Moore",
    role: "Senior Product Designer",
    date: "Oct 24, 2023",
    experience: "6 years",
    status: "Interviewing",
    avatar: "bg-sky-700",
  },
  {
    name: "Robert Downey",
    role: "Backend Engineer",
    date: "Oct 23, 2023",
    experience: "4 years",
    status: "New",
    avatar: "bg-orange-700",
  },
  {
    name: "Emma Stone",
    role: "Marketing Lead",
    date: "Oct 22, 2023",
    experience: "8 years",
    status: "Reviewing",
    avatar: "bg-rose-700",
  },
  {
    name: "Chris Pratt",
    role: "Product Manager",
    date: "Oct 21, 2023",
    experience: "5 years",
    status: "Rejected",
    avatar: "bg-indigo-700",
  },
  {
    name: "Natalie Portman",
    role: "UX Researcher",
    date: "Oct 20, 2023",
    experience: "7 years",
    status: "Hired",
    avatar: "bg-emerald-700",
  },
  {
    name: "Tom Hardy",
    role: "Frontend Engineer",
    date: "Oct 19, 2023",
    experience: "3 years",
    status: "Reviewing",
    avatar: "bg-zinc-700",
  },
];

const statusTone: Record<Candidate["status"], Tone> = {
  New: "blue",
  Reviewing: "amber",
  Interviewing: "violet",
  Rejected: "red",
  Hired: "green",
};

export function RecruiterApplications({ user }: { user: DashboardUser }) {
  return (
    <RecruiterLayout user={user} searchPlaceholder="Search candidates...">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Applications"
          description="Review candidates and move them through your hiring pipeline."
          actions={
            <>
              <SelectBox
                label="Filter by job"
                options={[
                  "All Jobs",
                  "Senior Product Designer",
                  "Backend Engineer",
                  "Marketing Lead",
                ]}
                className="w-52"
              />
              <button type="button" className={btnOutline}>
                <Download className="size-4" />
                Export CSV
              </button>
            </>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Applicants"
            value="1,284"
            icon={Users}
            hint="+18% vs last month"
            hintTone="text-emerald-400"
          />
          <StatCard
            label="New This Week"
            value="42"
            icon={MessageSquare}
            hint="Awaiting review"
            hintTone="text-blue-300"
          />
          <StatCard
            label="Interviewing"
            value="18"
            icon={UserCheck}
            hint="6 scheduled today"
            hintTone="text-violet-300"
          />
          <StatCard
            label="Rejected"
            value="96"
            icon={UserX}
            hint="This month"
            hintTone="text-red-400"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Search by candidate name..."
            aria-label="Search candidates"
            className={cn(inputClass, "max-w-72")}
          />
          <SelectBox
            label="Filter by status"
            options={[
              "All Statuses",
              "New",
              "Reviewing",
              "Interviewing",
              "Hired",
              "Rejected",
            ]}
            className="w-44"
          />
        </div>

        <div className={cn(card, "mt-4 overflow-x-auto")}>
          <table className="w-full min-w-215 text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className={th}>Candidate Name</th>
                <th className={th}>Applied For</th>
                <th className={th}>Date Applied</th>
                <th className={th}>Experience</th>
                <th className={th}>Status</th>
                <th className={cn(th, "text-right")}>Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr
                  key={candidate.name}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className={td}>
                    <span className="flex items-center gap-3">
                      <InitialAvatar
                        name={candidate.name}
                        color={candidate.avatar}
                      />
                      <span className="font-medium text-white">
                        {candidate.name}
                      </span>
                    </span>
                  </td>
                  <td className={cn(td, "text-zinc-300")}>
                    {candidate.role}
                  </td>
                  <td className={cn(td, "whitespace-nowrap text-zinc-400")}>
                    {candidate.date}
                  </td>
                  <td className={cn(td, "text-zinc-400")}>
                    {candidate.experience}
                  </td>
                  <td className={td}>
                    <StatusBadge tone={statusTone[candidate.status]}>
                      {candidate.status}
                    </StatusBadge>
                  </td>
                  <td className={cn(td, "text-right")}>
                    <button
                      type="button"
                      className="text-sm text-zinc-200 transition-colors hover:text-white"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RecruiterLayout>
  );
}
