"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { stripe } from "./stripe";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";

export async function syncUser() {
  const user = await currentUser();
  if (!user) return null;
  try {
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: { email: user.emailAddresses[0].emailAddress },
      create: { clerkId: user.id, email: user.emailAddresses[0].emailAddress, plan: "FREE" },
    });
    return dbUser;
  } catch (error) { return null; }
}

export async function createApiKey(name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) throw new Error("User not found");
  const key = `velo_live_${randomBytes(16).toString("hex")}`;
  await prisma.apiKey.create({ data: { userId: dbUser.id, name, key } });
  revalidatePath("/dashboard");
}

export async function revokeApiKey(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await prisma.apiKey.update({ where: { id }, data: { revoked: true } });
  revalidatePath("/dashboard");
}

export async function getUsageData() {
  const { userId } = await auth();
  if (!userId) return [];
  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) return [];

  try {
    const usages = await prisma.usage.findMany({
      where: { userId: dbUser.id },
      orderBy: { timestamp: "asc" },
    });

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const count = usages.filter(u => 
        u.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === label
      ).length;

      chartData.push({ date: label, count: count });
    }
    return chartData;
  } catch (error) { return []; }
}

export async function createCheckoutSession() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "Velo Pro Plan", description: "Enterprise API Infrastructure" },
        unit_amount: 2900,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${baseUrl}/dashboard?success=true`,
    cancel_url: `${baseUrl}/dashboard?canceled=true`,
    client_reference_id: userId,
  });
  if (session.url) redirect(session.url);
}