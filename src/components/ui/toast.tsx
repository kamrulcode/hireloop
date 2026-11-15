"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { XIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const toast = ToastPrimitive.createToastManager()

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full",
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border bg-popover text-popover-foreground shadow-lg will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        // Thin coloured bar on the left edge; each toast type only sets its colour.
        "before:absolute before:inset-y-2.5 before:left-0 before:w-[3px] before:rounded-full before:content-['']",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        className
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground",
        className
      )}
      {...props}
    >
      {children ?? (
        <XIcon aria-hidden="true" />
      )}
    </ToastPrimitive.Close>
  )
}

/**
 * One place to define how each toast type looks.
 * `danger` is accepted as an alias for `error`, because both words are common.
 */
type ToastTone = "success" | "error" | "warning" | "info" | "loading"

const toastTones: Record<
  ToastTone,
  { root: string; icon: string }
> = {
  success: {
    // Solid (opaque) dark surface with a green tint — not a transparent overlay,
    // because cn()/tailwind-merge would otherwise replace bg-popover entirely.
    root: "border-emerald-400/30 bg-[#0c1613] before:bg-emerald-400 shadow-[0_18px_45px_-18px_rgba(16,185,129,0.55)]",
    icon: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  },
  error: {
    root: "border-rose-400/30 bg-[#170d10] before:bg-rose-400 shadow-[0_18px_45px_-18px_rgba(244,63,94,0.55)]",
    icon: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
  },
  warning: {
    root: "border-amber-400/30 bg-[#171207] before:bg-amber-400 shadow-[0_18px_45px_-18px_rgba(245,158,11,0.55)]",
    icon: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  },
  info: {
    root: "border-sky-400/30 bg-[#0b1319] before:bg-sky-400 shadow-[0_18px_45px_-18px_rgba(14,165,233,0.55)]",
    icon: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
  },
  loading: {
    root: "border-indigo-400/30 bg-[#0d0d1a] before:bg-indigo-400 shadow-[0_18px_45px_-18px_rgba(99,102,241,0.55)]",
    icon: "bg-indigo-500/15 text-indigo-300 ring-indigo-400/30",
  },
}

/** Turns the free-form `type: string` into one of our known tones. */
function getToastTone(type: string | undefined): ToastTone | undefined {
  if (type === "danger") return "error"
  if (
    type === "success" ||
    type === "error" ||
    type === "warning" ||
    type === "info" ||
    type === "loading"
  ) {
    return type
  }
  return undefined
}

function ToastIcon({
  type,
  className,
}: {
  type: string | undefined
  className?: string
}) {
  let icon: React.ReactNode = null

  if (type === "success") {
    icon = (
      <CircleCheckIcon aria-hidden="true" />
    )
  }

  if (type === "info") {
    icon = (
      <InfoIcon aria-hidden="true" />
    )
  }

  if (type === "warning") {
    icon = (
      <TriangleAlertIcon aria-hidden="true" />
    )
  }

  if (type === "error" || type === "danger") {
    icon = (
      <OctagonXIcon aria-hidden="true" />
    )
  }

  if (type === "loading") {
    icon = (
      <Loader2Icon className="animate-spin" aria-hidden="true" />
    )
  }

  if (!icon) {
    return null
  }

  return (
    <span
      data-slot="toast-icon"
      className={cn(
        // A small coloured "chip" behind the icon. `animate-in` + `zoom-in-75`
        // (from tw-animate-css) gives every toast a subtle pop on arrival.
        "flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-transform duration-200 ease-out group-hover/toast:scale-105 motion-safe:animate-in motion-safe:zoom-in-75 motion-safe:fade-in-0 motion-safe:duration-500 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
    >
      {icon}
    </span>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toastItem) => {
    const tone = getToastTone(toastItem.type)
    const styles = tone ? toastTones[tone] : undefined

    return (
      <Toast
        key={toastItem.id}
        toast={toastItem}
        // tailwind-merge (cn) keeps the tone colours and drops the defaults.
        className={cn(styles?.root)}
      >
        <ToastContent>
          <ToastIcon type={toastItem.type} className={styles?.icon} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <ToastTitle />
            <ToastDescription />
          </div>
          <ToastAction />
          <ToastClose />
        </ToastContent>
      </Toast>
    )
  })
}

function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

/**
 * Shortcuts for the four cases you normally need, with sensible durations:
 *
 *   notify.success("Job deleted", "The listing was removed.")
 *   notify.error("Could not delete job")
 *
 * `type` still works on its own (`toast.add({ type: "warning", ... })`);
 * `notify` just saves you repeating title/description/timeout every time.
 */
const notify = {
  success: (title: string, description?: string) =>
    toast.add({ type: "success", title, description, timeout: 4000 }),
  error: (title: string, description?: string) =>
    toast.add({ type: "error", title, description, timeout: 6000 }),
  warning: (title: string, description?: string) =>
    toast.add({ type: "warning", title, description, timeout: 5000 }),
  info: (title: string, description?: string) =>
    toast.add({ type: "info", title, description, timeout: 4000 }),
  /**
   * Stays on screen until you replace it, e.g.
   *   const id = notify.loading("Deleting job…");
   *   toast.update(id, { type: "success", title: "Job deleted", timeout: 4000 });
   */
  loading: (title: string, description?: string) =>
    toast.add({ type: "loading", title, description, timeout: 0 }),
}

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  notify,
  toast,
  useToastManager,
}
