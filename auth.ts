// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import GitHub from "next-auth/providers/github";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { LoginSchema } from "@/lib/validationSchema";
// import { getUserById, getUserByEmail } from "@/data/user";
// import { UserRole } from "@prisma/client";

// export const { auth, handlers, signIn, signOut } = NextAuth({
//   pages: {
//     signIn: "/auth/login",
//     error: "/auth/error",
//   },

//   adapter: PrismaAdapter(prisma),

//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     GitHub({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//     }),
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const validated = LoginSchema.safeParse(credentials);
//         if (!validated.success) return null;

//         const { email, password } = validated.data;
//         const user = await getUserByEmail(email);
//         if (!user || !user.password) return null;

//         const isValid = await bcrypt.compare(password, user.password);
//         if (!isValid) return null;

//         return {
//           id: user.id,
//           email: user.email!,
//           name: user.name,
//           role: user.role,
//           companyId: user.company?.id ?? null,
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     async signIn({ user, account }) {
//       if (account && account.provider !== "credentials") {
//         const existingUser = await prisma.user.findUnique({
//           where: { email: user.email! },
//           include: { accounts: true },
//         });

//         if (!existingUser) {
//           // First-time OAuth login → create user & link account
//           await prisma.user.create({
//             data: {
//               name: user.name!,
//               email: user.email!,
//               emailVerified: new Date(),
//               role: "USER",
//               accounts: {
//                 create: [
//                   {
//                     provider: account.provider,
//                     providerAccountId: account.providerAccountId!,
//                     type: account.type,
//                     access_token: account.access_token ?? null,
//                     refresh_token: account.refresh_token ?? null,
//                     expires_at: account.expires_at ?? null,
//                     token_type: account.token_type ?? null,
//                     scope: account.scope ?? null,
//                     id_token: account.id_token ?? null,
//                     session_state: account.session_state
//                       ? String(account.session_state)
//                       : null,
//                   },
//                 ],
//               },
//             },
//           });
//           return true;
//         }

//         // Link account if not already linked
//         const isLinked = existingUser.accounts.some(
//           (a) =>
//             a.provider === account.provider &&
//             a.providerAccountId === account.providerAccountId,
//         );

//         if (!isLinked) {
//           await prisma.account.create({
//             data: {
//               userId: existingUser.id,
//               provider: account.provider,
//               providerAccountId: account.providerAccountId!,
//               type: account.type,
//               access_token: account.access_token ?? null,
//               refresh_token: account.refresh_token ?? null,
//               expires_at: account.expires_at ?? null,
//               token_type: account.token_type ?? null,
//               scope: account.scope ?? null,
//               id_token: account.id_token ?? null,
//               session_state: account.session_state
//                 ? String(account.session_state)
//                 : null,
//             },
//           });
//         }

//         // Block banned users
//         if (existingUser.status === "BANNED") return false;
//         return true;
//       }

//       // Credentials login
//       const existingUser = await getUserById(user.id!);
//       if (!existingUser) return false;
//       if (existingUser.status === "BANNED") return false;

//       return true;
//     },

//     async session({ token, session }) {
//       if (!session.user) return session;

//       // sync id & role
//       if (token.sub) session.user.id = token.sub;
//       if (token.role) session.user.role = token.role as UserRole;
//       session.user.image = token.image as string; // 🔥🔥🔥

//       if (token.sub) {
//         const user = await getUserById(token.sub);
//         if (user) {
//           session.user.companyId = user.company?.id ?? null;
//           if (user.status === "BANNED") {
//             session.user.isBanned = true;
//             session.error = "Your account is blocked!";
//           }
//         }
//       }

//       return session;
//     },

//     async jwt({ token }) {
//       if (!token.sub) return token;
//       const user = await getUserById(token.sub);
//       if (!user) return token;
//       token.role = user.role;
//       return token;
//     },
//   },

//   events: {
//     async linkAccount({ user }) {
//       await prisma.user.update({
//         where: { id: user.id },
//         data: { emailVerified: new Date() },
//       });
//     },
//   },

//   session: { strategy: "jwt" },
// });

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/validationSchema";
import { getUserById, getUserByEmail } from "@/data/user";
import { UserRole } from "@prisma/client";

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const validated = LoginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;
        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],

  callbacks: {
    // ✅ JWT — المصدر الوحيد للحقيقة
    async jwt({ token, user, trigger, session }) {
      // أول login
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.image = user.image;
      }

      // 🔥 وقت update() من client
      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }

      // sync دائم من DB
      if (token.sub) {
        const dbUser = await getUserById(token.sub);
        if (dbUser) {
          token.role = dbUser.role;
          token.image = dbUser.image;
        }
      }

      return token;
    },

    // ✅ SESSION — اللي ال-UI يقراه
    async session({ session, token }) {
      if (!session.user) return session;

      session.user.id = token.sub!;
      session.user.role = token.role as UserRole;
      session.user.image = token.image as string; // 🔥🔥🔥

      const dbUser = await getUserById(token.sub!);
      if (dbUser) {
        session.user.companyId = dbUser.company?.id ?? null;

        if (dbUser.status === "BANNED") {
          session.user.isBanned = true;
          session.error = "Your account is blocked!";
        }
      }

      return session;
    },
  },

  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
});
