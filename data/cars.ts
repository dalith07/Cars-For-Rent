"use server";

import { prisma } from "@/lib/prisma";

export const getCarsById = async (id: string) => {
  try {
    const carsItems = await prisma.car.findUnique({
      where: { id },
      include: {
        category: true,
        model: true,
        images: true,
      },
    });

    return carsItems;
  } catch {
    return null;
  }
};
