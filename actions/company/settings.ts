import { prisma } from "@/lib/prisma";

export async function getCompanyWithDetails(userId: string) {
  return prisma.company.findUnique({
    where: {
      ownerId: userId,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      cars: {
        include: {
          category: true,
          model: true,
          images: true,
        },
      },
      orders: {
        include: {
          user: true,
          orderCars: {
            include: {
              car: true,
            },
          },
        },
      },
    },
  });
}

export async function updateCompanyInfo(
  companyId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    lat?: number | null;
    lng?: number | null;
    city?: string;
    bankName?: string;
    bankAccount?: string;
  },
) {
  return prisma.company.update({
    where: { id: companyId },
    data,
  });
}

export async function deleteCompany(companyId: string) {
  await prisma.company.delete({
    where: { id: companyId },
  });
}

// export async function getCompanyWithDetails(userId: string) {
//   return prisma.company.findUnique({
//     where: { ownerId: userId },
//     include: {
//       settings: true, // 👈 مهم
//       owner: {
//         select: { id: true, name: true, email: true },
//       },
//       cars: {
//         include: { category: true, model: true, images: true },
//       },
//       orders: {
//         include: {
//           user: true,
//           orderCars: { include: { car: true } },
//         },
//       },
//     },
//   });
// }

// export async function updateCompanySettings(
//   companyId: string,
//   data: {
//     emailNotifications?: boolean;
//     orderNotifications?: boolean;
//     paymentNotifications?: boolean;
//     marketingEmails?: boolean;
//   },
// ) {
//   return prisma.companySettings.update({
//     where: { companyId },
//     data,
//   });
// }
