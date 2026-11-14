import type { Metadata } from "next";
import { AdminCompanies } from "@/components/dashboard/admin-companies";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Companies — Admin | HireLoop" };

export default async function CompaniesPage() {
  const user = await requireRole("admin");
  return (
    <AdminCompanies
      user={{ name: user.name, email: user.email, image: user.image }}
    />
  );
}
