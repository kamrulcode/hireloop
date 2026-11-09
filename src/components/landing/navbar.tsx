import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavbarClient, type NavbarUser } from "@/components/landing/navbar-client";

export async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const raw = session?.user;

  const user: NavbarUser | null = raw
    ? {
        name: raw.name,
        email: raw.email,
        image: raw.image,
        role: (raw as { role?: string }).role ?? "seeker",
      }
    : null;

  return <NavbarClient user={user} />;
}
