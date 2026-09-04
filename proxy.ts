import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/cart",
  "/checkout",
  "/account",
  "/design-consultation",
  "/admin",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) return NextResponse.next();

  // JWT is stored in localStorage (client-side only), so we use a cookie
  // set by the client as a session signal. See auth-provider.tsx for cookie sync.
  const sessionCookie = request.cookies.get("nest_session");

  if (!sessionCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Keep middleware export for backward compatibility
export const middleware = proxy;

export const config = {
  matcher: [
    "/cart",
    "/cart/:path*",
    "/checkout",
    "/checkout/:path*",
    "/account",
    "/account/:path*",
    "/design-consultation",
    "/design-consultation/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
