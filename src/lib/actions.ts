"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { stripe } from "./stripe";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function isDemoMode() {
  // In newer Next versions, cookies() can be async in types; await works either way.
  const c: any = await cookies();
  return c?.get?.("velo_demo")?.value === "1";
}

async function getOrCreateDemoUser() {
  return prisma.user.upsert({
    where: { clerkId: "demo-user" },
    update: { email: "demo@velo.local", plan: "PRO" },
    create: { clerkId: "demo-user", email: "demo@velo.local", plan: "PRO" },
  });
}

export async function syncUser() {
  if (await isDemoMode()) {
    return getOrCreateDemoUser();
  }

  const user = await currentUser();
  if (!user) return null;

  try {
    const email = user.emailAddresses?.[0]?.emailAddress ?? "unknown@unknown";
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: { email },
      create: { clerkId: user.id, email, plan: "FREE" },
    });
    return dbUser;
  } catch {
    return null;
  }
}

export async function createApiKey(name: string) {
  const demo = await isDemoMode();
  const clerkId = demo ? "demo-user" : (await auth()).userId;

  if (!clerkId) throw new Error("Unauthorized");

  const dbUser = demo
    ? await getOrCreateDemoUser()
    : await prisma.user.findUnique({ where: { clerkId } });

  if (!dbUser) throw new Error("User not found");

  const key = `velo_live_${randomBytes(16).toString("hex")}`;

  await prisma.apiKey.create({
    data: { userId: dbUser.id, name, key },
  });

  revalidatePath("/dashboard");
}

export async function revokeApiKey(id: string) {
  const demo = await isDemoMode();
  const clerkId = demo ? "demo-user" : (await auth()).userId;

  if (!clerkId) throw new Error("Unauthorized");

  // (Optional) in demo mode, allow deletes too
  await prisma.apiKey.update({ where: { id }, data: { revoked: true } });

  revalidatePath("/dashboard");
}

export async function getUsageData() {
  const demo = await isDemoMode();
  const clerkId = demo ? "demo-user" : (await auth()).userId;

  if (!clerkId) return [];

  const dbUser = demo
    ? await getOrCreateDemoUser()
    : await prisma.user.findUnique({ where: { clerkId } });

  if (!dbUser) return [];

  try {
    const usages = await prisma.usage.findMany({
      where: { userId: dbUser.id },
      orderBy: { timestamp: "asc" },
    });

    // If demo has no usage yet, return a nice synthetic curve
    const chartData: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const count = usages.filter(
        (u) =>
          u.timestamp.toLocaleDateString("en-US", { month: "short", day: "numeric" }) === label
      ).length;

      // If no real data and demo mode, add a little shape
      const fallback = demo ? Math.max(0, Math.round(40 * Math.sin((6 - i) / 1.6) + 55)) : 0;

      chartData.push({ date: label, count: count || fallback });
    }

    return chartData;
  } catch {
    return [];
  }
}

export async function createCheckoutSession() {
  // Never ask recruiters to pay
  if (await isDemoMode()) return;

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Velo Pro Plan", description: "Enterprise API Infrastructure" },
          unit_amount: 2900,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/dashboard?success=true`,
    cancel_url: `${baseUrl}/dashboard?canceled=true`,
    client_reference_id: userId,
  });

  if (session.url) redirect(session.url);
}
