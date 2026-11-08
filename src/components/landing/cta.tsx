import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-28">
      {/* Upward glow of a second planet */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[-380px] h-[620px] w-[1300px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(139,92,246,0.75)_0%,rgba(79,70,229,0.4)_38%,transparent_72%)] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[-300px] h-[460px] w-[800px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(167,139,250,0.55)_0%,transparent_65%)] blur-xl"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/80 to-transparent"
      />

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Your next role is
          <br />
          already looking for you
        </h2>
        <p className="mt-4 text-sm text-zinc-400 sm:text-base">
          Build a profile in three minutes. The matches start arriving tomorrow
          morning.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="h-11 rounded-lg bg-white px-6 text-sm font-medium text-black hover:bg-zinc-200 flex items-center"
          >
            Create a free account
          </Link>
          <Button
            variant="outline"
            className="h-11 rounded-lg border-white/15 bg-transparent px-6 text-sm font-medium text-white hover:bg-white/5 hover:text-white dark:bg-transparent dark:hover:bg-white/5"
          >
            View pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
