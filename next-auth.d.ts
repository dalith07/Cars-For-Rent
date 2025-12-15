import { UserRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

// Extend the session user type
export type ExtendedUser = DefaultSession["user"] & {
  id: string; // Add this
  role: UserRole; // Keep role
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  // Also extend the JWT type so you can store role
  interface JWT {
    role?: UserRole;
    sub?: string;
  }
}
