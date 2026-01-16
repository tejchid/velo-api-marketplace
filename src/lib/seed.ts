"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function seedDemoData() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkId },
    include: { apiKeys: true }
  });

  if (!dbUser || dbUser.apiKeys.length === 0) return;
  const apiKeyId = dbUser.apiKeys[0].id;

  // Clear existing logs to ensure a fresh, jagged visual
  await prisma.usage.deleteMany({ where: { userId: dbUser.id } });

  for (let i = 0; i < 7; i++) {
    // Generate a random peak for each day (10 to 150)
    const dailyVolume = Math.floor(Math.random() * 140) + 10;
    const date = new Date();
    date.setDate(date.getDate() - i);

    const logs = Array.from({ length: dailyVolume }).map(() => ({
      userId: dbUser.id,
      apiKeyId: apiKeyId,
      endpoint: "/api/v1/resource",
      timestamp: new Date(date.getTime() - Math.random() * 3600000), // Random time within that day
    }));

    await prisma.usage.createMany({ data: logs });
  }

  revalidatePath("/dashboard");
}