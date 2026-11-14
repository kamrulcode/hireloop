import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type Role = "seeker" | "recruiter" | "admin";

/** Session user as needed by the dashboard components. */
export type SessionUser = {
  name: string;
  email: string;
  image?: string | null;
  role: Role;
};

export async function requireUser(): Promise<SessionUser> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const role = ((session.user as { role?: string }).role ?? "seeker") as Role;
  return {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role,
  };
}

/** Same as requireUser, but bounces other roles back to their dashboard. */
export async function requireRole(...allowed: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!allowed.includes(user.role)) redirect("/dashboard");
  return user;
}
