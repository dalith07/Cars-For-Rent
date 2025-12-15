// import authConfig from "./auth.config";
// import {
//   apiAuthPrefix,
//   authRoutes,
//   DEFAULT_LOGIN_REDIRECT,
//   publicRoutes,
// } from "./route";

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;
//   const pathname = nextUrl.pathname;

//   const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
//   const isPublicRoute = publicRoutes.includes(pathname);
//   const isAuthRoute = authRoutes.includes(pathname);

//   if (isApiAuthRoute) return null;

//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//     }
//     return null;
//   }

//   if (!isLoggedIn && !isPublicRoute) {
//     return Response.redirect(new URL("/auth/login", nextUrl));
//   }

//   return null;
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

// import { auth } from "@/auth";
// import { NextResponse } from "next/server";

// export default auth((req) => {
//   const isLoggedIn = !!req.auth;
//   const pathname = req.nextUrl.pathname;
//   console.log(isLoggedIn);

//   const publicRoutes = ["/auth/login", "/auth/register", "/"];
//   const dashboardRoute = "/dashboard";

//   if (!isLoggedIn && !publicRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   if (isLoggedIn && pathname.startsWith("/auth")) {
//     return NextResponse.redirect(new URL(dashboardRoute, req.url));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!_next|api/auth|favicon.ico).*)"],
// };

import { auth } from "@/auth";
import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "@/route";

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isUploadThingRoute = pathname.startsWith("/api/uploadthing");
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  if (isApiAuthRoute) return null;
  // Allow uploadthing callbacks (they come from the UT server without auth cookies)
  if (isUploadThingRoute) return null;

  // Already authenticated → redirect away from login/register
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // ----------------------------------------
  // 🔥 ADMIN ONLY ACCESS: /dashboard/**
  // ----------------------------------------
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) return Response.redirect(new URL("/auth/login", nextUrl));

    if (role !== "ADMIN") return Response.redirect(new URL("/", nextUrl)); // not admin → block
  }

  // Normal protected routes
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
