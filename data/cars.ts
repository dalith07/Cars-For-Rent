"use server";

import { prisma } from "@/lib/prisma";

export const getCarsById = async (id: string) => {
  try {
    const carsItems = await prisma.itemsCars.findUnique({
      where: { id },
      // select: {
      //   id: true,
      //   name: true,
      //   description: true,
      //   price: true,
      //   year: true,
      //   engine: true,
      //   horsepower: true,
      //   quantity: true,
      //   discount: true,
      //   status: true,
      //   version: true,
      //   transmission: true,
      //   createdAt: true,
      //   updatedAt: true,
      //   categoryId: true,
      //   modelId: true,
      //   category: true,
      //   model: true,
      //   imagesOnCars: true,
      // },
      include: {
        category: true,
        model: true,
        imagesOnCars: true,
      },
    });

    return carsItems;
  } catch {
    return null;
  }
};
