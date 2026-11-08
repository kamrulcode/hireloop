"use client";

import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function SearchForm() {
  return (
    <form
      className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-full border border-white/10 bg-[#141414] p-2 pl-5 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Search className="size-4 shrink-0 text-zinc-500" />
        <Input
          placeholder="Job title, skill or company"
          className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
      <Separator orientation="vertical" className="h-6 bg-white/10" />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <MapPin className="size-4 shrink-0 text-zinc-500" />
        <Input
          placeholder="Location or Remote"
          className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
      <Button
        type="submit"
        aria-label="Search jobs"
        className="size-9 shrink-0 rounded-full bg-[#4f46e5] p-0 text-white hover:bg-[#5b5bf0]"
      >
        <Search className="!size-4" />
      </Button>
    </form>
  );
}
