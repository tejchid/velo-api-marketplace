import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/dashboard", url.origin));

  res.cookies.set("velo_demo", "1", {
    path: "/",
    maxAge: 60 * 60 * 2,
    sameSite: "lax",
    secure: true,
  });

  return res;
}
