"use server";

import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

// export const getUserById = async (id: string) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id },
//       select: {
//         id: true,
//         email: true,
//         emailVerified: true,
//         role: true,
//         password: true,
//         name: true,
//         image: true,
//         profile: true,
//         status: true,
//         createdAt: true,
//       },
//     });

//     return user;
//   } catch {
//     return null;
//   }
// };

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        role: true,
        password: true,
        name: true,
        image: true,
        status: true,
        createdAt: true,
        profile: true, // Prisma field
      },
    });

    if (!user) return null;

    return {
      ...user,
      Profile: user.profile, // rename to match type
    };
  } catch {
    return null;
  }
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const deleteUserById = async (id: string) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    return null;
  }
};
