import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
  }

  // Find the key and the user it belongs to
  const keyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { user: true } // We need the user info here
  });

  if (!keyRecord || keyRecord.revoked) {
    return NextResponse.json({ error: "Invalid or Revoked Key" }, { status: 403 });
  }

  // 1. Check Usage Limits (The Throttling Logic)
  const usageCount = await prisma.usage.count({
    where: { userId: keyRecord.userId }
  });

  const limit = keyRecord.user.plan === "PRO" ? 50000 : 1000;

  if (usageCount >= limit) {
    return NextResponse.json(
      { error: "Usage limit exceeded. Upgrade to PRO." },
      { status: 429 }
    );
  }

  // 2. Log the usage (The part that was causing the error)
  await prisma.usage.create({
    data: {
      apiKeyId: keyRecord.id,
      userId: keyRecord.userId, // THIS WAS MISSING
      endpoint: "/api/v1/hello",
    },
  });

  return NextResponse.json({
    message: "Hello from the Velo API!",
    usage: `${usageCount + 1} / ${limit}`,
  });
}