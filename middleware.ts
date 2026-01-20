import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/",
    "/demo",
  ],
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};
