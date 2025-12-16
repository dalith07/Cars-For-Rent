"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUserNotifications() {
  const session = await auth();

  if (!session?.user?.id) {
    return []; // ✅ ALWAYS return array
  }

  return prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
