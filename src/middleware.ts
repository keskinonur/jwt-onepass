import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  console.log("[Middleware]", pathname, "token =", token);

  // If the user has a token and visits the login page, redirect them to the dashboard.
  if (token && pathname === "/login") {
    console.log("[Middleware] Authenticated user on /login, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If the user has no token and is trying to access the dashboard, redirect them to login.
  if (!token && pathname.startsWith("/dashboard")) {
    console.log("[Middleware] No token on a protected route, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // In all other cases (e.g., authenticated user on dashboard, unauthenticated on login),
  // allow the request to proceed.
  console.log("[Middleware] Path allowed, continuing");
  return NextResponse.next();
}

export const config = {
  // The middleware will run on all requests to the dashboard and login pages.
  matcher: ["/dashboard/:path*", "/login"],
};
