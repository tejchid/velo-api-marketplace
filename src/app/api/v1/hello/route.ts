import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hasReachedLimit } from "@/lib/limits";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "API Key is required" }, { status: 401 });
  }

  const keyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { user: true },
  });

  if (!keyRecord || keyRecord.revoked) {
    return NextResponse.json({ error: "Invalid or revoked API Key" }, { status: 403 });
  }

  // NEW: Check if the user has reached their plan limit
  const { reached, current, limit } = await hasReachedLimit(keyRecord.userId, keyRecord.user.plan);

  if (reached) {
    return NextResponse.json({ 
      error: "Plan limit reached", 
      usage: current, 
      limit: limit,
      message: "Upgrade to PRO for more requests." 
    }, { status: 429 }); // 429 is the standard 'Too Many Requests' error
  }

  await prisma.usage.create({
    data: {
      apiKeyId: keyRecord.id,
      endpoint: "/api/v1/hello",
    },
  });

  return NextResponse.json({
    message: "Success! You have accessed the Velo API.",
    usage_remaining: limit - (current + 1),
    timestamp: new Date().toISOString(),
  });
}