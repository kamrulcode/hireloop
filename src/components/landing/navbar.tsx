import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const navLinks = [
  { label: "Browse Jobs", href: "/" },
  { label: "Company", href: "/" },
  { label: "Pricing", href: "#pricing" },
];

export async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0d0d0d]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {user ? (
          <p>{user?.name}</p>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="h-9 px-4 text-zinc-300 hover:bg-white/5 hover:text-white flex items-center"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="h-9 rounded-lg bg-[#4f46e5] px-4 text-white hover:bg-[#5b5bf0]  flex items-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
