import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "API Key is missing" }, { status: 401 });
  }

  // 1. Validate the Key and User Plan
  const keyData = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { user: true },
  });

  if (!keyData || keyData.revoked) {
    return NextResponse.json({ error: "Invalid or Revoked API Key" }, { status: 403 });
  }

  // 2. Check Quota (The "Business" Logic)
  const usageCount = await prisma.usage.count({
    where: { userId: keyData.userId },
  });

  const limit = keyData.user.plan === "PRO" ? 50000 : 1000;

  if (usageCount >= limit) {
    return NextResponse.json({ error: "Usage limit exceeded. Upgrade to PRO." }, { status: 429 });
  }

  // 3. Log the Usage (The "Analytics" Logic)
  await prisma.usage.create({
    data: {
      userId: keyData.userId,
      apiKeyId: keyData.id,
      endpoint: "/api/v1/resource",
    },
  });

  // 4. Return the actual "Data" being sold
  return NextResponse.json({
    status: "success",
    data: "This is the premium data protected by Velo Infrastructure.",
    timestamp: new Date().toISOString(),
  });
}