import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "apex_uae_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "apex_uae_real_estate_jwt_secret_key_change_in_production_32char";

const PROTECTED_PREFIXES = ["/dashboard", "/settings"];
const AUTH_ROUTES = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isValidSession = false;

  if (sessionCookie) {
    try {
      const secret = new TextEncoder().encode(AUTH_SECRET);
      await jwtVerify(sessionCookie, secret);
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  // Redirect unauthenticated requests away from protected routes to /login
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtected && !isValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated requests away from login to /dashboard
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);
  if (isAuthRoute && isValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/login",
  ],
};
