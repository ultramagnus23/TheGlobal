import { NextResponse } from "next/server";

/**
 * Preview and staging deploys must never be indexed — only `VERCEL_ENV ===
 * "production"` is a real, canonical deploy. Vercel sets `VERCEL_ENV` to
 * "preview" or "development" everywhere else; locally it's unset, which
 * this treats the same as non-production (fail closed: index nothing
 * unless we're certain it's the live site).
 */
export function proxy() {
  const response = NextResponse.next();
  if (process.env.VERCEL_ENV !== "production") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
