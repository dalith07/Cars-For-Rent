/**
 *  An array of routes that are accessible to the public
 *  These routes do not require authentication
 *  @type {string[]}
 */

// export const publicRoutes = ["/", "/auth/new-verification"];
export const publicRoutes = [
  "https://cars-for-rent-h68n.vercel.app/",
  "https://cars-for-rent-h68n.vercel.app//auth/new-verification",
];

/**
 *  An array of routes that are used for authentication
 *  These routes will redirect logged in users to /settings
 *  @type {string[]}
 */

// export const authRoutes = [
//   "/auth/login",
//   "/auth/register",
//   "/auth/error",
//   "/auth/reset",
//   "/auth/new-password",
// ];

export const authRoutes = [
  "https://cars-for-rent-h68n.vercel.app/api/auth/auth/login",
  "https://cars-for-rent-h68n.vercel.app/api/auth/auth/register",
  "https://cars-for-rent-h68n.vercel.app/api/auth/auth/error",
  "https://cars-for-rent-h68n.vercel.app/api/auth/auth/reset",
  "https://cars-for-rent-h68n.vercel.app/api/auth/auth/new-password",
];

/**
 *  The prefix for API authentication routes
 *  Routes that start with this prefix are used for API authentication purposes
 *  @type {string}
 */

// export const apiAuthPrefix = "/api/auth";
export const apiAuthPrefix = "https://cars-for-rent-h68n.vercel.app/api/auth";

/**
 *  The default redirect path after logging in
 *  @type {string}
 */

// export const DEFAULT_LOGIN_REDIRECT = "/";

export const DEFAULT_LOGIN_REDIRECT = "https://cars-for-rent-h68n.vercel.app/";
