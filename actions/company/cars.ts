"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { RentalStatus, CarStatus } from "@prisma/client";

/**
 * 🟦 Total cars of company
 */
export async function getTotalCars() {
  const user = await currentUser();
  if (!user?.company?.id) throw new Error("Unauthorized");

  return prisma.car.count({
    where: { companyId: user.company?.id },
  });
}

/**
 * 🟩 Available + Rented cars
 */
export async function getCarsStatusStats() {
  const user = await currentUser();
  if (!user?.company?.id) throw new Error("Unauthorized");

  const [availableCars, rentedCars] = await Promise.all([
    prisma.car.count({
      where: {
        companyId: user.company?.id,
        status: CarStatus.AVAILABLE,
      },
    }),
    prisma.car.count({
      where: {
        companyId: user.company?.id,
        status: CarStatus.RENTED,
      },
    }),
  ]);

  return {
    availableCars,
    rentedCars,
  };
}

/**
 * 🟪 Total money of company (completed orders)
 */
export async function getCompanyTotalMoney() {
  const user = await currentUser();
  if (!user?.company?.id) throw new Error("Unauthorized");

  const result = await prisma.order.aggregate({
    where: {
      companyId: user.company?.id,
      status: RentalStatus.COMPLETED,
    },
    _sum: {
      totalPrice: true,
    },
  });

  return result._sum.totalPrice ?? 0;
}

export async function getCompanyDashboardStats() {
  const user = await currentUser();
  if (!user?.company?.id) throw new Error("Unauthorized");

  // Total cars
  const totalCars = await prisma.car.count({
    where: { companyId: user.company?.id },
  });

  // Available / Active rentals
  const [availableCars, activeRentals] = await Promise.all([
    prisma.car.count({
      where: { companyId: user.company?.id, status: CarStatus.AVAILABLE },
    }),
    prisma.order.count({
      where: { companyId: user.company?.id, status: RentalStatus.ACCEPTED },
    }),
  ]);

  // Total money from completed orders
  const revenueAgg = await prisma.order.aggregate({
    where: { companyId: user.company?.id, status: RentalStatus.COMPLETED },
    _sum: { totalPrice: true },
  });

  return {
    totalCars,
    availableCars,
    activeRentals,
    totalRevenue: revenueAgg._sum.totalPrice ?? 0,
  };
}

export async function getCompanyDashboardData() {
  const user = await currentUser();
  if (!user?.company?.id) throw new Error("Unauthorized");

  const companyId = user.company.id;

  // 1️⃣ Get total cars, available cars, rented cars
  const [totalCars, availableCars, rentedCars] = await Promise.all([
    prisma.car.count({ where: { companyId } }),
    prisma.car.count({ where: { companyId, status: CarStatus.AVAILABLE } }),
    prisma.car.count({ where: { companyId, status: CarStatus.RENTED } }),
  ]);

  // 2️⃣ Active rentals (orders with status ACCEPTED)
  const activeRentals = await prisma.order.count({
    where: { companyId, status: RentalStatus.ACCEPTED },
  });

  // 3️⃣ Total revenue from completed rentals
  const revenueAgg = await prisma.order.aggregate({
    where: { companyId, status: RentalStatus.COMPLETED },
    _sum: { totalPrice: true },
  });
  const totalRevenue = revenueAgg._sum.totalPrice ?? 0;

  // 4️⃣ Optional: get recent orders
  const recentOrders = await prisma.order.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      car: {
        select: {
          name: true,
        },
      },
    },
  });

  // 5️⃣ Return all data
  return {
    company: {
      id: user.company.id,
      name: user.company.name,
      email: user.company.email,
    },
    stats: {
      totalCars,
      availableCars,
      rentedCars,
      activeRentals,
      totalRevenue,
    },
    recentOrders,
  };
}
