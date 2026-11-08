import { Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SearchForm } from "@/components/landing/search-form";

const trendingRoles = ["Product Designer", "AI Engineering", "DevOps Engineer"];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="starfield absolute inset-0" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgba(79,70,229,0.18),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-6 pb-6 pt-16 text-center sm:pt-20">
        <Badge className="h-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400 hover:bg-white/5">
          <Briefcase className="!size-3.5 text-amber-400" />
          <span className="text-amber-400">50,000+</span>
          <span className="tracking-widest uppercase">new jobs this month</span>
        </Badge>

        <h1 className="font-heading mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Find Your Dream Job Today
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          HireLoop connects you with world-class companies. Browse thousands of
          curated opportunities and land your next role — faster.
        </p>

        <div className="mt-8">
          <SearchForm />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-500">
          <span>Trending:</span>
          {trendingRoles.map((role) => (
            <span
              key={role}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-violet-500/40 hover:text-white"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
