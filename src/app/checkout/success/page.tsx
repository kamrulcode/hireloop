import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Home, ReceiptText } from "lucide-react";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Payment Successful | HireLoop",
};

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function SuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-[#08080a] px-6 text-white">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center">
          <section className="w-full rounded-2xl border border-white/10 bg-[#111113] p-8 text-center">
            <h1 className="text-2xl font-semibold">Payment not confirmed</h1>
            <p className="mt-3 text-sm text-zinc-400">
              We could not find a checkout session. Please return to billing and try again.
            </p>
            <Link
              href="/checkout"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold hover:bg-blue-500"
            >
              Return to checkout
            </Link>
          </section>
        </div>
      </main>
    );
  }

  let customerEmail: string | null = null;
  let amount: string | null = null;
  let paid = false;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paid = session.status === "complete" && session.payment_status === "paid";
    customerEmail = session.customer_details?.email ?? session.customer_email;

    if (session.amount_total !== null) {
      const currency = (session.currency ?? "usd").toUpperCase();
      amount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(session.amount_total / 100);
    }
  } catch {
    paid = false;
  }

  return (
    <main className="min-h-screen bg-[#08080a] px-6 text-white">
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center py-12">
        <section className="w-full rounded-2xl border border-white/10 bg-[#111113] p-8 shadow-2xl shadow-black/40">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
            <CheckCircle2
              className={`size-8 ${paid ? "text-emerald-400" : "text-amber-400"}`}
              aria-hidden="true"
            />
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              {paid ? "Payment confirmed" : "Payment pending"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              {paid ? "You’re on HireLoop Pro" : "We’re confirming payment"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {paid
                ? "Your checkout was completed successfully."
                : "We could not confirm this checkout yet. Your payment may still be processing."}
            </p>
          </div>

          {(amount || customerEmail) && (
            <dl className="mt-7 divide-y divide-white/10 rounded-xl border border-white/10 bg-black/20 px-5">
              {amount && (
                <div className="flex items-center justify-between gap-4 py-4">
                  <dt className="flex items-center gap-2 text-sm text-zinc-400">
                    <ReceiptText className="size-4" aria-hidden="true" />
                    Amount paid
                  </dt>
                  <dd className="text-sm font-semibold text-white">{amount}</dd>
                </div>
              )}
              {customerEmail && (
                <div className="flex items-center justify-between gap-4 py-4">
                  <dt className="text-sm text-zinc-400">Receipt sent to</dt>
                  <dd className="max-w-[240px] truncate text-sm font-medium text-white">
                    {customerEmail}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold hover:bg-blue-500"
            >
              <Home className="size-4" aria-hidden="true" />
              Go to dashboard
            </Link>
            <Link
              href="/billing"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-white/10 px-5 text-sm font-semibold text-zinc-200 hover:bg-white/5"
            >
              View billing
            </Link>
          </div>

          <p className="mt-5 break-all text-center text-[11px] text-zinc-600">
            Reference: {sessionId}
          </p>
        </section>
      </div>
    </main>
  );
}
