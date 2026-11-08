import Link from "next/link";
import { cn } from "cn";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-heading text-lg font-bold tracking-tight text-white",
        className
      )}
    >
      hire
      <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
        loop
      </span>
    </Link>
  );
}
