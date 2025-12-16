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
