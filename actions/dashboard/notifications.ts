"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUserNotifications() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
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

export async function deleteAllUserNotifications() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.notification.deleteMany({
    where: {
      userId: session.user.id,
    },
  });

  return { success: true };
}

export async function deleteNotificationById(notificationId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.notification.delete({
    where: {
      id: notificationId,
      userId: session.user.id,
    },
  });

  return { success: true };
}

export async function getUserNotificationsCount() {
  const session = await auth();

  if (!session?.user?.id) {
    return 0;
  }

  const count = await prisma.notification.count({
    where: {
      userId: session.user.id,
    },
  });

  return count;
}
