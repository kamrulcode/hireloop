import { Search, type LucideIcon } from "lucide-react";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { cn } from "cn";

export type DashboardUser = {
  name: string;
  image?: string | null;
};

export type NavItem = { label: string; icon: LucideIcon };

/** Circular avatar: profile image when set, otherwise an initial. */
export function Avatar({
  user,
  className,
}: {
  user: DashboardUser;
  className?: string;
}) {
  console.log(user.image);
  if (user?.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full bg-violet-600 font-medium text-white",
        className,
      )}
    >
      {user.name.charAt(0).toUpperCase()}
    </span>
  );
}

function SidebarLink({ item, active }: { item: NavItem; active?: boolean }) {
  const Icon = item.icon;
  return (
    <a
      href="#"
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-white/10 font-medium text-white"
          : "text-zinc-400 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon className="size-4" />
      {item.label}
    </a>
  );
}

/**
 * Shared dashboard layout: black sidebar (brand, optional top card, nav,
 * optional bottom card, logout) + topbar (search, custom right side) + content.
 */
export function DashboardShell({
  brand,
  sidebarTop,
  sidebarBottom,
  navItems,
  searchPlaceholder,
  topbarRight,
  children,
}: {
  brand: React.ReactNode;
  sidebarTop?: React.ReactNode;
  sidebarBottom?: React.ReactNode;
  navItems: NavItem[];
  searchPlaceholder: string;
  topbarRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-black p-4">
        <div className="px-2 py-2">{brand}</div>

        {sidebarTop}

        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map((item, i) => (
            <SidebarLink key={item.label} item={item} active={i === 0} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          {sidebarBottom}
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-[#0a0a0a]/95 px-6 backdrop-blur">
          <div className="relative w-72 max-w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-lg border border-white/10 bg-[#141414] pr-3 pl-9 text-sm text-white placeholder:text-zinc-500 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">{topbarRight}</div>
        </header>

        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

/** Floating action button (bottom-right), like in the designs. */
export function Fab() {
  return (
    <button
      type="button"
      aria-label="Create"
      className="fixed right-8 bottom-8 z-40 flex size-14 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105"
    >
      <span className="text-2xl leading-none">+</span>
    </button>
  );
}
