import { prisma } from "./prisma";

const PLAN_LIMITS = {
  FREE: 10,
  PRO: 5000,
};

export async function hasReachedLimit(userId: string, plan: string) {
  // Count usage logs for this user's keys in the last 30 days
  const usageCount = await prisma.usage.count({
    where: {
      apiKey: { userId: userId },
      timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }
  });

  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || 100;
  
  return {
    reached: usageCount >= limit,
    current: usageCount,
    limit: limit
  };
}