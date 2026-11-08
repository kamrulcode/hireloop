import {
  Bookmark,
  Building2,
  FileText,
  GraduationCap,
  Search,
  Target,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
  },
  {
    icon: TrendingUp,
    title: "Salary Insights",
    description: "Get real-time salary data to negotiate confidently.",
  },
  {
    icon: Building2,
    title: "Top Companies",
    description: "Apply to verified companies that are hiring.",
  },
  {
    icon: Bookmark,
    title: "Saved Jobs",
    description: "Manage apps & favorites on your dashboard.",
  },
  {
    icon: Zap,
    title: "One-Click Apply",
    description: "Simplify your applications for an easier process.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
  },
  {
    icon: Target,
    title: "Skill-Based Matching",
    description: "Discover jobs to match your skills and experience.",
  },
  {
    icon: GraduationCap,
    title: "Career Growth Resources",
    description: "Boost your career with quick interview tips.",
  },
];

export function Features() {
  return (
    <section className="border-t border-white/5 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-violet-400 uppercase">
            ✦ Features Job ✦
          </p>
          <h2 className="font-heading mx-auto mt-4 max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Everything you need to succeed
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#141414]">
                <feature.icon className="size-4 text-zinc-300" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
