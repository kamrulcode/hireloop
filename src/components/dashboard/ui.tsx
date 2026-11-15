"use client";

import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";

export const card = "rounded-xl border border-white/10 bg-[#111]";
export const btnPrimary =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200";
export const btnIndigo =
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#4f46e5] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5b5bf0]";
export const btnOutline =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#141414] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1c1c1c]";
export const inputClass =
  "h-10 w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus-visible:border-white/30";
export const textareaClass =
  "w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus-visible:border-white/30";
export const th =
  "px-5 py-3.5 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase";
export const td = "px-5 py-4";

export type Tone = "green" | "amber" | "red" | "blue" | "violet" | "gray";

const toneBadge: Record<Tone, string> = {
  green: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  red: "bg-red-500/15 text-red-400 ring-red-500/30",
  blue: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
  violet: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  gray: "bg-white/5 text-zinc-300 ring-white/10",
};

const toneDot: Record<Tone, string> = {
  green: "bg-emerald-400",
  amber: "bg-amber-400",
  red: "bg-red-400",
  blue: "bg-blue-400",
  violet: "bg-violet-400",
  gray: "bg-zinc-400",
};

export function StatusBadge({
  tone = "gray",
  dot = true,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        toneBadge[tone],
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", toneDot[tone])} />}
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </div>
  );
}

export type BreadcrumbItem =
  | string
  | {
      label: string;
      /** Adds a link. Omit it for plain text (e.g. the current page). */
      href?: string;
    };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm text-zinc-500"
    >
      {items.map((item, i) => {
        const label = typeof item === "string" ? item : item.label;
        const href = typeof item === "string" ? undefined : item.href;
        const isLast = i === items.length - 1;

        return (
          <span key={`${label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="size-3.5 text-zinc-600" />}
            {href ? (
              <Link
                href={href}
                aria-current={isLast ? "page" : undefined}
                className={cn(
                  "transition-colors hover:text-white",
                  isLast && "text-zinc-400",
                )}
              >
                {label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={isLast ? "text-zinc-400" : ""}
              >
                {label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaTone = "text-emerald-400",
  hint,
  hintTone = "text-zinc-500",
  valueTone = "text-white",
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  delta?: string;
  deltaTone?: string;
  hint?: string;
  hintTone?: string;
  valueTone?: string;
}) {
  const hasTopRow = Boolean(Icon || delta);
  return (
    <div className={cn(card, "p-5")}>
      {hasTopRow && (
        <div className="flex items-start justify-between gap-2">
          {Icon ? (
            <span className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-[#1c1c1c]">
              <Icon className="size-4 text-zinc-300" />
            </span>
          ) : (
            <span />
          )}
          {delta && (
            <span className={cn("text-xs font-medium", deltaTone)}>
              {delta}
            </span>
          )}
        </div>
      )}
      <p className={cn("text-sm text-zinc-400", hasTopRow && "mt-4")}>
        {label}
      </p>
      <p className={cn("mt-1 text-3xl font-semibold", valueTone)}>{value}</p>
      {hint && <p className={cn("mt-2 text-xs", hintTone)}>{hint}</p>}
    </div>
  );
}

export function InitialAvatar({
  name,
  color = "bg-violet-600",
  className,
}: {
  name: string;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
        color,
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export function SelectBox({
  options,
  defaultValue,
  label,
  id,
  className,
}: {
  options: string[];
  defaultValue?: string;
  label?: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        id={id}
        aria-label={label ?? defaultValue ?? options[0]}
        defaultValue={defaultValue ?? options[0]}
        className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-[#141414] pr-9 pl-3 text-sm text-white outline-none focus-visible:border-white/30"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-500" />
    </div>
  );
}
