import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",              // landing
  "/demo",          // demo explainer
  "/dashboard",     // dashboard (handled below)
  "/api/demo",      // demo api
  "/docs(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const url = new URL(req.url);

  // ✅ allow demo dashboard access
  if (url.pathname === "/dashboard" && url.searchParams.get("demo") === "true") {
    return;
  }

  // 🔐 everything else requires auth
  if (!isPublicRoute(req)) {
    auth().redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
