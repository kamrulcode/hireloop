import type { Metadata } from "next";
import { AdminPayments } from "@/components/dashboard/admin-payments";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payments — Admin | HireLoop" };

export default async function PaymentsPage() {
  const user = await requireRole("admin");
  return (
    <AdminPayments
      user={{ name: user.name, email: user.email, image: user.image }}
    />
  );
}
