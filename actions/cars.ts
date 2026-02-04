"use server";

import { prisma } from "@/lib/prisma";

export async function getSoldCarsWithCompany() {
  const cars = await prisma.car.findMany({
    where: {
      discount: {
        gt: 0,
      },
    },
    include: {
      company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return cars;
}

// Get all cars
export async function getAllCarsWithCompany() {
  const cars = await prisma.car.findMany({
    include: {
      company: {
        select: {
          name: true,
          logo: true,
          cars: true,
        },
      },
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return cars;
}
