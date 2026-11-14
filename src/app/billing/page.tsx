import type { Metadata } from "next";
import { SeekerBilling } from "@/components/dashboard/seeker-billing";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Billing — HireLoop" };

export default async function BillingPage() {
  const user = await requireRole("seeker");
  return (
    <SeekerBilling
      user={{ name: user.name, email: user.email, image: user.image }}
    />
  );
}
