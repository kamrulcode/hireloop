"use client";

import { useState } from "react";
import { FileText, X } from "lucide-react";
import { SeekerLayout } from "@/components/dashboard/layouts";
import { Avatar, type DashboardUser } from "@/components/dashboard/shell";
import {
  PageHeader,
  btnOutline,
  btnPrimary,
  card,
  inputClass,
  textareaClass,
} from "@/components/dashboard/ui";
import { cn } from "cn";

const labelClass = "mb-2 block text-sm text-zinc-300";

export function SeekerSettings({ user }: { user: DashboardUser }) {
  const [skills, setSkills] = useState(["Figma", "UI Design", "Prototyping"]);
  const [draft, setDraft] = useState("");

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const skill = draft.trim();
    if (skill && !skills.includes(skill)) {
      setSkills((current) => [...current, skill]);
    }
    setDraft("");
  };

  return (
    <SeekerLayout user={user} searchPlaceholder="Search settings...">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Settings"
          description="Manage your account details and professional profile."
        />

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className={cn(card, "p-6 lg:col-span-2")}>
            <h2 className="text-xl font-semibold text-white">
              Profile Information
            </h2>

            <div className="mt-5 flex items-center gap-5">
              <Avatar user={user} className="size-24 text-3xl" />
              <div>
                <button type="button" className={btnOutline}>
                  Change Avatar
                </button>
                <p className="mt-2 text-xs text-zinc-500">
                  JPG, GIF or PNG. Max size of 5MB.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="seeker-name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="seeker-name"
                  defaultValue={user.name}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="seeker-email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="seeker-email"
                  type="email"
                  defaultValue={user.email ?? "jane.doe@example.com"}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-white/10 pt-6">
              <button type="button" className={btnPrimary}>
                Update Profile
              </button>
              <button type="button" className={btnOutline}>
                Reset Password
              </button>
            </div>
          </div>

          <div className={cn(card, "p-6")}>
            <h2 className="text-xl font-semibold text-white">Resume</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Upload your most recent resume to enable one-click applications.
            </p>

            <div className="mt-5 rounded-xl border border-dashed border-white/15 p-6 text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-white/10 bg-[#1c1c1c]">
                <FileText className="size-5 text-zinc-300" />
              </span>
              <p className="mt-4 truncate text-sm font-medium text-white">
                {user.name.replace(/\s+/g, "_")}_Resume_2023.pdf
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Last updated 2 days ago • 1.2 MB
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button type="button" className={btnOutline}>
                  Replace
                </button>
                <button type="button" className={btnOutline}>
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className={cn(card, "p-6 lg:col-span-2")}>
            <h2 className="text-xl font-semibold text-white">
              Professional Details
            </h2>

            <div className="mt-5">
              <label htmlFor="headline" className={labelClass}>
                Professional Headline
              </label>
              <input
                id="headline"
                defaultValue="Senior UX/UI Designer"
                className={inputClass}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="bio" className={labelClass}>
                Bio
              </label>
              <textarea
                id="bio"
                rows={5}
                defaultValue="Passionate designer with 5+ years of experience crafting user-centric digital experiences..."
                className={textareaClass}
              />
            </div>

            <div className="mt-5">
              <p className="mb-2 block text-sm text-zinc-300">Skills</p>
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-[#0d0d0d] p-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1c1c1c] px-3 py-1 text-sm text-zinc-200"
                  >
                    {skill}
                    <button
                      type="button"
                      aria-label={`Remove ${skill}`}
                      onClick={() =>
                        setSkills((current) =>
                          current.filter((item) => item !== skill),
                        )
                      }
                      className="text-zinc-500 transition-colors hover:text-white"
                    >
                      <X className="size-3.5" />
                    </button>
                  </span>
                ))}
                <form onSubmit={addSkill} className="min-w-32 flex-1">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Add a skill..."
                    aria-label="Add a skill"
                    className="h-8 w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                  />
                </form>
              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-white/10 pt-6">
              <button type="button" className={btnPrimary}>
                Save Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </SeekerLayout>
  );
}
