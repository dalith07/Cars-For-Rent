// import { UserRole } from "@prisma/client";
// import { type DefaultSession } from "next-auth";

// // Extend the session user type
// export type ExtendedUser = DefaultSession["user"] & {
//   id: string;
//   role: UserRole;
//   companyId?: string | null;
//   isBanned?: boolean;
//   image?: string | null;
// };

// declare module "next-auth" {
//   interface Session {
//     user: ExtendedUser;
//     error?: string;
//   }

//   // Also extend the JWT type so you can store role
//   interface JWT {
//     role?: UserRole;
//     companyId?: string | null;
//     sub?: string;
//     isBanned?: boolean;
//   }
// }

import { DefaultSession, DefaultUser } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      companyId?: string | null;
      isBanned?: boolean;
      image?: string | null;
    } & DefaultSession["user"];
    error?: string;
  }
  interface User extends DefaultUser {
    role?: UserRole;
    image?: string | null;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    image?: string | null;
    companyId?: string | null;
    isBanned?: boolean;
    sub?: string;
  }
}
