import {
  Briefcase,
  Building2,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const stats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Briefcase, value: "50K", label: "Active Jobs" },
  { icon: Building2, value: "12K", label: "Companies" },
  { icon: Users, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
];

export function Stats() {
  return (
    <section className="relative overflow-hidden  ">
      <div className="starfield absolute inset-0" aria-hidden />

      <div className="relative mx-auto h-150 w-full max-w-5xl bg-[url('/hero.png')] bg-cover bg-top bg-no-repeat">
        {/* Planet: layered radial gradients + violet atmosphere glow */}
        {/* <div
          aria-hidden
          className="absolute left-1/2 top-16 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_32%,#241a55_0%,#151038_38%,#0b0820_68%,#070514_100%)] shadow-[0_0_140px_30px_rgba(109,40,217,0.4)]"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-16 h-[560px] w-[560px] -translate-x-1/2 rounded-full shadow-[inset_0_14px_60px_rgba(196,181,253,0.5),0_0_0_1px_rgba(167,139,250,0.35)]"
        /> */}
        {/* Faint continents */}
        {/* <div
          aria-hidden
          className="absolute left-1/2 top-16 h-[560px] w-[560px] -translate-x-1/2 overflow-hidden rounded-full"
        >
          <div className="absolute left-[14%] top-[38%] h-28 w-40 rotate-12 rounded-[50%] bg-[#3b2f7a] opacity-40 blur-xl" />
          <div className="absolute left-[48%] top-[24%] h-24 w-36 -rotate-6 rounded-[50%] bg-[#31276b] opacity-40 blur-xl" />
          <div className="absolute left-[34%] top-[58%] h-20 w-44 rotate-3 rounded-[50%] bg-[#2c2565] opacity-35 blur-xl" />
        </div> */}

        <div className="absolute inset-x-0 top-2/3 -translate-y-1/2 px-6 text-center">
          <h2 className="font-heading text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl">
            Assisting over 15,000 job seekers
            <br />
            find their dream positions.
          </h2>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-24 grid max-w-6xl grid-cols-1 gap-4 px-6  sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="gap-3 rounded-2xl bg-[#141414] p-6 ring-white/10 transition-transform hover:-translate-y-1"
          >
            <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <stat.icon className="size-4 text-zinc-300" />
            </span>
            <div>
              <p className="font-heading text-3xl font-semibold text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
