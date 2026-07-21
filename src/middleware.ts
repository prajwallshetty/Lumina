import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Edge middleware: a fast, defense-in-depth gate for the admin area. It only
 * checks for the presence of a session cookie — full authorization (role,
 * active state) is enforced server-side in the protected layout and actions.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/admin/sign-in") || pathname.startsWith("/admin/forbidden");
  if (!pathname.startsWith("/admin") || isAuthRoute) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request, { cookiePrefix: "lumina" });
  if (!sessionCookie) {
    const url = new URL("/admin/sign-in", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
