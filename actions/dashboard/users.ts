"use server";

import { prisma } from "@/lib/prisma";

export async function getUserProfile(userId: string) {
  if (!userId) return null;

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { user: true },
  });

  return profile;
}
// ✅ Total users (كلهم)
export async function getTotalUsers() {
  return prisma.user.count();
}

// ✅ Company users (WITHOUT admin)
export async function getUsersWithCompany() {
  return prisma.user.count({
    where: {
      role: { not: "ADMIN" },
      company: {
        isNot: null,
      },
    },
  });
}

// ✅ Normal users (no company, no admin)
export async function getNormalUsers() {
  return prisma.user.count({
    where: {
      role: { not: "ADMIN" },
      company: {
        is: null,
      },
    },
  });
}

// ✅ Admin users (optional)
export async function getAdminUsers() {
  return prisma.user.count({
    where: {
      role: "ADMIN",
    },
  });
}
