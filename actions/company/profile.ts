"use server";

import { prisma } from "@/lib/prisma";

export async function getCompanyProfileByOwner(ownerId: string) {
  if (!ownerId) return null;

  const company = await prisma.company.findUnique({
    where: {
      ownerId,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
      cars: true,
      orders: true,
    },
  });

  return company;
}
