import type { Metadata } from "next";
import { AdminUsers } from "@/components/dashboard/admin-users";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Users — Admin | HireLoop" };

export default async function UsersPage() {
  const user = await requireRole("admin");
  return (
    <AdminUsers
      user={{ name: user.name, email: user.email, image: user.image }}
    />
  );
}
