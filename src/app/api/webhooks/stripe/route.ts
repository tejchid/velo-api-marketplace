import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === "checkout.session.completed") {
    const userId = session.client_reference_id;

    if (!userId) {
      return new NextResponse("User ID missing", { status: 400 });
    }

    // Upgrade the user to PRO in the database
    await prisma.user.update({
      where: { clerkId: userId },
      data: { plan: "PRO" },
    });
  }

  return new NextResponse(null, { status: 200 });
}