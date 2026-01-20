import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ["/", "/demo", "/api/demo"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
