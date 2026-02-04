"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function setUserOnline() {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      isOnline: true,
      lastSeen: null,
    },
  });
}

export async function setUserOffline() {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      isOnline: false,
      lastSeen: new Date(),
    },
  });
}

export async function pingUser() {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      lastSeen: new Date(),
    },
  });
}

export async function updateUserStatus(userId: string, online: boolean) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      isOnline: online,
      lastSeen: online ? null : new Date(),
    },
  });
}
