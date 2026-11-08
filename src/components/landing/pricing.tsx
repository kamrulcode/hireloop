"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "cn";

type Plan = {
  name: string;
  icon: LucideIcon;
  monthly: number;
  yearly: number;
  description: string;
  features: string[];
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    icon: Sparkles,
    monthly: 0,
    yearly: 0,
    description: "Start building your insights hub:",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  {
    name: "Growth",
    icon: TrendingUp,
    monthly: 17,
    yearly: 14,
    description: "Start building your insights hub:",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    icon: Zap,
    monthly: 99,
    yearly: 79,
    description: "Start building your insights hub:",
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="border-t border-white/5 bg-[#0d0d0d] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-violet-400 uppercase">
            ✦ Pricing ✦
          </p>
          <h2 className="font-heading mx-auto mt-4 max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Pay for the leverage,
            <br />
            not the listings
          </h2>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#141414] p-1">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                billing === "monthly"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors",
                billing === "yearly"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Yearly
              <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const price = billing === "monthly" ? plan.monthly : plan.yearly;
            return (
              <Card
                key={plan.name}
                className={cn(
                  "gap-5 rounded-2xl p-6",
                  plan.highlighted
                    ? "bg-[#161616] ring-1 ring-violet-500/40"
                    : "bg-[#141414] ring-white/10"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <plan.icon
                      className={cn(
                        "size-4",
                        plan.highlighted ? "text-violet-400" : "text-zinc-400"
                      )}
                    />
                    {plan.name}
                  </span>
                  <span className="flex items-baseline gap-1">
                    <span className="font-heading text-3xl font-semibold text-white">
                      ${price}
                    </span>
                    <span className="text-xs text-zinc-500">/month</span>
                  </span>
                </div>

                <p className="text-sm text-zinc-400">{plan.description}</p>

                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-zinc-300"
                    >
                      <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-violet-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "mt-1 h-10 w-full rounded-lg text-sm font-medium",
                    plan.highlighted
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "border border-white/10 bg-[#1c1c1c] text-white hover:bg-[#242424]"
                  )}
                >
                  Choose This Plan
                  <ArrowRight className="!size-3.5" />
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
