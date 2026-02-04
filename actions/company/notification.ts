"use server";

import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

export async function createOrderNotification(
  carId: string,
  customerName: string,
) {
  const car = await prisma.car.findUnique({
    where: { id: carId },
    include: {
      company: {
        select: {
          ownerId: true,
          name: true,
        },
      },
    },
  });

  if (!car || !car.company) return;

  await prisma.notification.create({
    data: {
      userId: car.company.ownerId,
      title: "New Rental Order",
      message: `${customerName} requested to rent ${car.name}`,
      type: NotificationType.ORDER, // ✅ add this
    },
  });
}
