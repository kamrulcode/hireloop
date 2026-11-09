"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { authClient } from "@/lib/auth-client";
import { cn } from "cn";

const navLinks = [
  { label: "Browse Jobs", href: "/" },
  { label: "Company", href: "/" },
  { label: "Pricing", href: "#pricing" },
];

export type NavbarUser = {
  name: string;
  email: string;
  image?: string | null;
  role: string;
};

function UserAvatar({
  user,
  className,
}: {
  user: NavbarUser;
  className?: string;
}) {
  if (user.image) {
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

/**
 * Interactive navbar shell.
 * < lg: menu icon left, logo centered, avatar right (menu drops down).
 * >= lg: logo left, links centered, avatar right.
 * Avatar click opens a dropdown: name, email, role chip, role-based
 * dashboard link, logout.
 */
export function NavbarClient({ user }: { user: NavbarUser | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const router = useRouter();

  const roleLabel = user
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "";

  const handleLogout = async () => {
    setAvatarOpen(false);
    await authClient.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0d0d0d]/90 backdrop-blur-md">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6">
        {/* Left: menu button (mobile/tablet) or logo (desktop) */}
        <div className="flex items-center">
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((open) => !open);
              setAvatarOpen(false);
            }}
            className="flex items-center text-zinc-400 transition-colors hover:text-white lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <span className="hidden lg:block">
            <Logo />
          </span>
        </div>

        {/* Center: logo (mobile/tablet) or nav links (desktop) */}
        <div className="flex items-center justify-center">
          <span className="lg:hidden">
            <Logo />
          </span>
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: avatar menu or auth buttons */}
        <div className="relative flex items-center justify-end gap-2">
          {user ? (
            <>
              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={avatarOpen}
                onClick={() => {
                  setAvatarOpen((open) => !open);
                  setMenuOpen(false);
                }}
                className="flex items-center rounded-full transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
              >
                <UserAvatar user={user} className="size-8" />
              </button>

              {avatarOpen && (
                <>
                  <div
                    aria-hidden="true"
                    onClick={() => setAvatarOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute top-full right-0 z-50 mt-2 w-60 rounded-xl border border-white/10 bg-[#141414] p-1 shadow-2xl sm:w-64">
                    <div className="px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {user.email}
                      </p>
                      <span className="mt-1.5 inline-block rounded-full bg-violet-600/20 px-2 py-0.5 text-[11px] font-medium text-violet-300 ring-1 ring-violet-500/30">
                        {roleLabel}
                      </span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <Link
                      href="/dashboard"
                      onClick={() => setAvatarOpen(false)}
                      className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <LayoutDashboard className="size-4" />
                      {roleLabel} Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex h-9 items-center px-3 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white sm:px-4"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="hidden h-9 items-center rounded-lg bg-[#4f46e5] px-4 text-sm text-white transition-colors hover:bg-[#5b5bf0] sm:flex"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile/tablet menu panel */}
      {menuOpen && (
        <div className="border-t border-white/5 lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                Dashboard
              </Link>
            )}
            {!user && (
              <div className="mt-2 flex gap-2 border-t border-white/5 pt-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 flex-1 items-center justify-center px-4 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 flex-1 items-center justify-center rounded-lg bg-[#4f46e5] px-4 text-sm text-white transition-colors hover:bg-[#5b5bf0]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
