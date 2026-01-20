import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  const { pathname, searchParams } = req.nextUrl;

  // ✅ FULLY PUBLIC ROUTES
  if (
    pathname === "/" ||
    pathname === "/demo" ||
    pathname.startsWith("/api/demo")
  ) {
    return NextResponse.next();
  }

  // ✅ DEMO DASHBOARD (THIS IS THE IMPORTANT PART)
  if (pathname === "/dashboard" && searchParams.get("demo") === "true") {
    return NextResponse.next();
  }

  // 🔒 EVERYTHING ELSE REQUIRES AUTH
  auth().protect();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
