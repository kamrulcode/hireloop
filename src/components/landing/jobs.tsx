import { ArrowRight, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const job = {
  title: "Frontend Developer",
  description:
    "Show your commitment to diversity and inclusion by highlighting initiatives",
  location: "New York, USA",
  type: "Hybrid",
  salary: "$25-$45/hour",
};

const jobs = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, ...job }));

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium tracking-[0.25em] text-violet-400 uppercase">
      ✦ {children} ✦
    </p>
  );
}

export function Jobs() {
  return (
    <section className="border-t border-white/5 bg-[#0d0d0d] pb-20 pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <Eyebrow>Smart Job Discovery</Eyebrow>
          <h2 className="font-heading mx-auto mt-4 max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            The roles you&apos;d never find by searching
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((item) => (
            <Card
              key={item.id}
              className="gap-4 rounded-2xl bg-[#141414] p-6 ring-white/10 transition hover:ring-violet-500/40"
            >
              <div>
                <h3 className="font-heading text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {item.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                  <MapPin className="size-3 text-zinc-500" />
                  {item.location}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {item.type}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <DollarSign className="size-3 text-zinc-500" />
                {item.salary}
              </div>

              <a
                href="#"
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-violet-400"
              >
                Apply Now
                <ArrowRight className="size-3.5" />
              </a>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button className="h-10 rounded-lg bg-white px-6 text-sm font-medium text-black hover:bg-zinc-200">
            View all job open
          </Button>
        </div>
      </div>
    </section>
  );
}
