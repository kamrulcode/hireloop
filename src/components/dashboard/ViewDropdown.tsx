"use client";

import Link from "next/link";
import { Eye, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RecruiterJob } from "./recruiter-jobs-data";

export function ViewDropdown({ job }: { job: RecruiterJob }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label="More Options">
            <MoreVertical />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          {/* render swaps the menu item for a real link, so the whole row is clickable. */}
          <DropdownMenuItem
            render={<Link href={`/manage-jobs/${job.id}?mode=view`} />}
          >
            <Eye />
            View details
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
