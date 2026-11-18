import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const headersList = await headers();
    const referer = headersList.get("referer");
    let refererOrigin: string | null = null;

    if (referer) {
      try {
        refererOrigin = new URL(referer).origin;
      } catch {
        refererOrigin = null;
      }
    }

    const origin =
      headersList.get("origin") ??
      refererOrigin ??
      process.env.NEXT_PUBLIC_APP_URL;

    if (!origin) {
      return NextResponse.json(
        { error: "Could not determine the application URL." },
        { status: 500 },
      );
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: "price_1Ud2O0GaHWntFZIrbkBtLGNm",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: "hireloop",
    });
    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout session URL was not created." },
        { status: 500 },
      );
    }
    return NextResponse.redirect(session.url, 303);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected checkout error";
    const statusCode =
      typeof err === "object" && err !== null && "statusCode" in err
        ? Number(err.statusCode) || 500
        : 500;

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
