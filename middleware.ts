// src/middleware.ts
import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: authState } = req;
  const isLoggedIn = !!authState?.user;
  const path = nextUrl.pathname;

  // Public routes - always accessible
  const publicRoutes = ["/login", "/register", "/forgot-password", "/"];
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Routes that require authentication
  if (!isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // 2FA required - redirect to 2FA page
  if (
    authState?.user.twoFactorEnabled &&
    !authState?.user.twoFactorVerified &&
    path !== "/2fa"
  ) {
    return Response.redirect(new URL("/2fa", nextUrl));
  }

  // 2FA page - only accessible if 2FA is required and not verified
  if (
    path === "/2fa" &&
    (!authState?.user.twoFactorEnabled || authState?.user.twoFactorVerified)
  ) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  // Protected routes - require authentication and completed 2FA
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    if (
      authState?.user.twoFactorEnabled &&
      !authState?.user.twoFactorVerified
    ) {
      return Response.redirect(new URL("/2fa", nextUrl));
    }
    return NextResponse.next();
  }

  // Default - allow access
  return NextResponse.next();
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
