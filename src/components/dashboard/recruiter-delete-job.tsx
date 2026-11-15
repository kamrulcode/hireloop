"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { notify, toast } from "@/components/ui/toast";
import type { RecruiterJob } from "./recruiter-jobs-data";
import { ApiError, deleteJob } from "@/lib/actions/jobs";

export function DeleteJob({ job }: { job: RecruiterJob }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteJob = async () => {
    if (deleting) return;

    // 1. Close the confirmation dialog right away — no waiting for the network.
    setOpen(false);
    setDeleting(true);

    // 2. One toast that starts as "loading" and is later updated in place,
    //    so the user always gets feedback even though the dialog is gone.
    const toastId = notify.loading("Deleting job…", `“${job.title}”`);

    try {
      await deleteJob(job.id);

      router.refresh();
      toast.update(toastId, {
        type: "success",
        title: "Job deleted",
        description: `“${job.title}” has been removed.`,
        timeout: 4000,
      });
    } catch (error) {
      // 404 means it was already deleted (another tab, or by someone else).
      if (error instanceof ApiError && error.status === 404) {
        router.refresh();
        toast.update(toastId, {
          type: "warning",
          title: "Already deleted",
          description: `“${job.title}” no longer exists. The list has been refreshed.`,
          timeout: 5000,
        });
        return;
      }

      toast.update(toastId, {
        type: "error",
        title: "Could not delete job",
        description:
          error instanceof ApiError
            ? error.message
            : "Could not reach the API. Is hireloop-server running?",
        timeout: 6000,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            size="icon"
            aria-label={`Delete ${job.title}`}
            disabled={deleting}
          >
            <Trash2 className="size-4" />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>
            Delete{" "}
            <span className="text-red-400 font-semibold">{job?.title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this job. You cannot undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          {/* Plain button: it does not auto-close, handleDeleteJob closes the
              dialog itself before starting the request. */}
          <AlertDialogAction onClick={handleDeleteJob} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
