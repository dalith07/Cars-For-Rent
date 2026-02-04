"use server";

import "server-only";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { UserRole, CompanyStatus, UserStatus } from "@prisma/client";
import { CompanyWithAll } from "@/lib/utils";

type CreateCompanyInput = {
  name: string;
  email?: string;
  logo?: string;
  phone: string;
  city: string;
  address?: string;
  location?: string;
  lat: number;
  lng: number;
  description?: string;
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
  registrationNumber?: string;
  documentUrl?: string;
};

interface DeleteCompanyProps {
  companyId: string;
}

interface CheckCompanyVerificationProps {
  companyId: string;
}

//  =============== CREATE COMPANY (USER)  ===============
export async function createCompany(data: CreateCompanyInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // 🔹 Required fields check
    if (!data.name || !data.phone || !data.city || !data.lat || !data.lng) {
      return { success: false, error: "Missing required fields" };
    }

    const company = await prisma.company.create({
      data: {
        name: data.name,
        email: data.email || "",
        logo: data.logo || "",
        phone: data.phone,
        city: data.city,
        address: data.address || "",
        location: data.location || "",
        lat: data.lat,
        lng: data.lng,
        description: data.description || "",
        bankName: data.bankName || "",
        bankAccount: data.bankAccount || "",
        bankHolder: data.bankHolder || "",
        registrationNumber: data.registrationNumber || "",
        documentUrl: data.documentUrl || "",
        status: CompanyStatus.PENDING,
        setupCompleted: true, // 🔹 mark setup as complete if user submits the form
        owner: { connect: { id: session.user.id } },
      },
    });

    return { success: true, data: company };
  } catch (error: any) {
    console.error("❌ Error creating company:", error);
    return { success: false, error: error.message };
  }
}

//  =============== DELETE COMPANY (USER)  ===============
export async function deleteCompany({ companyId }: DeleteCompanyProps) {
  try {
    await prisma.company.delete({
      where: { id: companyId },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete company:", error);
    return { success: false, error: "Failed to delete company." };
  }
}

//  =============== CHECK COMPANY STATUS (POLLING)  ===============
export async function checkCompanyVerification({
  companyId,
}: CheckCompanyVerificationProps) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { status: true },
    });

    if (!company) {
      return { success: false, error: "Company not found" };
    }

    return { success: true, verified: company.status };
  } catch (error: any) {
    console.error("❌ Error checking company verification:", error);
    return { success: false, error: error.message };
  }
}

//  =============== GET USER COMPANY  ===============
export async function getUserCompany() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    const company = await prisma.company.findUnique({
      where: {
        ownerId: session.user.id,
      },
      select: {
        id: true,
        status: true,
        owner: { select: { role: true } },
      },
    });

    return company;
  } catch (error) {
    console.error("❌ Error fetching user company:", error);
    return null;
  }
}

//  =============== ADMIN – GET ALL COMPANIES  ===============
// export async function getAllCompanies() {
//   try {
//     const companies = await prisma.company.findMany({
//       orderBy: { createdAt: "desc" },
//       include: {
//         owner: true,
//         orders: true,
//         cars: {
//           include: {
//             model: true,
//             category: true,
//             images: true,
//             orders: true,
//             company: true,
//           },
//         },
//       },
//     });

//     return { success: true, data: companies };
//   } catch (error: any) {
//     console.error("❌ Error fetching companies:", error);
//     return { success: false, error: error.message };
//   }
// }

export async function getAllCompanies() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: true,
        orders: true,
        cars: {
          include: {
            model: true,
            category: true,
            images: true,
            orders: true,
            company: true,
          },
        },
      },
    });

    // ✅ cast to CompanyWithAll[]
    return { success: true, data: companies as unknown as CompanyWithAll[] };
  } catch (error: any) {
    console.error("❌ Error fetching companies:", error);
    // Return empty array if database is unavailable during build
    return {
      success: false,
      error: error.message,
      data: [] as CompanyWithAll[],
    };
  }
}

export async function getAllCompaniesForMap() {
  try {
    const companies = await prisma.company.findMany({
      select: {
        name: true,
        lat: true,
        lng: true,
      },
      where: {
        lat: { not: null },
        lng: { not: null },
      },
    });

    return {
      success: true,
      data: companies.map((c) => ({
        name: c.name,
        lat: c.lat as number,
        lng: c.lng as number,
      })),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, data: [] };
  }
}
//  =============== ADMIN - GET NOTIFY STATUS  ===============
// function getNotificationByStatus(status: CompanyStatus) {
//   switch (status) {
//     case "APPROVED":
//       return {
//         title: "Company Approved 🎉",
//         message:
//           "Your company has been approved. You can now access your dashboard.",
//       };

//     case "REJECTED":
//       return {
//         title: "Company Rejected ❌",
//         message: "Unfortunately, your company request has been rejected.",
//       };

//     case "BLOCKED":
//       return {
//         title: "Company Blocked ⛔",
//         message: "Your company has been blocked. Please contact support.",
//       };

//     default:
//       return null;
//   }
// }
function getNotificationByStatus(status: CompanyStatus) {
  switch (status) {
    case "APPROVED":
      return {
        title: "Company Approved",
        message: "Your company has been approved",
        type: "ORDER" as const, // ✅ matches enum
      };
    case "REJECTED":
      return {
        title: "Company Rejected",
        message: "Your company has been rejected",
        type: "ALERT" as const, // ✅ matches enum
      };
    case "BLOCKED":
      return {
        title: "Company Blocked",
        message: "Your company has been blocked",
        type: "ALERT" as const, // ✅ matches enum
      };
    default:
      return {
        title: "Status Update",
        message: "Your company status has changed",
        type: "ORDER" as const, // ✅ fallback must also match enum
      };
  }
}

//  =============== ADMIN - GET USER ROLE  ===============
function getUserUpdateByCompanyStatus(status: CompanyStatus) {
  switch (status) {
    case "APPROVED":
      return {
        role: UserRole.COMPANY_OWNER,
        status: UserStatus.ACTIVE,
      };

    case "REJECTED":
      return {
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      };

    case "BLOCKED":
      return {
        role: UserRole.USER,
        status: UserStatus.BANNED,
      };

    default:
      return {
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      };
  }
}

//  =============== ADMIN - UPDATE COMPANY STATUS  ===============
// export async function updateCompanyStatus(
//   companyId: string,
//   status: CompanyStatus,
// ) {
//   try {
//     return await prisma.$transaction(async (tx) => {
//       // 1️⃣ get company
//       const company = await tx.company.findUnique({
//         where: { id: companyId },
//         include: { owner: true },
//       });

//       if (!company) {
//         throw new Error("Company not found");
//       }

//       // 2️⃣ update company status
//       await tx.company.update({
//         where: { id: companyId },
//         data: { status },
//       });

//       // 3️⃣ ALWAYS update user role & status
//       const userUpdate = getUserUpdateByCompanyStatus(status);

//       await tx.user.update({
//         where: { id: company.ownerId },
//         data: userUpdate,
//       });

//       // 4️⃣ notification
//       const notification = getNotificationByStatus(status);

//       if (notification) {
//         await tx.notification.create({
//           data: {
//             userId: company.ownerId,
//             title: notification.title,
//             message: notification.message,
//           },
//         });
//       }

//       return { success: true };
//     });
//   } catch (error) {
//     console.error("❌ Failed to update company status:", error);
//     throw new Error("Failed to update company status");
//   }
// }

export async function updateCompanyStatus(
  companyId: string,
  status: CompanyStatus,
) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1️⃣ get company
      const company = await tx.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      // 2️⃣ update company status
      await tx.company.update({
        where: { id: companyId },
        data: { status },
      });

      // 3️⃣ update user ONLY if owner exists
      if (company.ownerId) {
        const userUpdate = getUserUpdateByCompanyStatus(status);

        await tx.user.update({
          where: { id: company.ownerId },
          data: userUpdate,
        });
      }

      // 4️⃣ notification (also safe)
      const notification = getNotificationByStatus(status);

      if (notification && company.ownerId) {
        await tx.notification.create({
          data: {
            userId: company.ownerId,
            title: notification.title,
            message: notification.message,
            type: notification.type,
          },
        });
      }

      return { success: true };
    });
  } catch (error) {
    console.error("❌ Failed to update company status:", error);
    throw error; // ⬅️ خليه هكّا باش تشوف السبب الحقيقي
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

//  ===============   ===============
// export async function updateCompanyStatus(
//   companyId: string,
//   status: CompanyStatus
// ) {
//   try {
//     const company = await prisma.company.update({
//       where: { id: companyId },
//       data: { status },
//     });
//     return company;
//   } catch (error) {
//     console.error("Failed to update company status:", error);
//     throw new Error("Failed to update company status");
//   }
// }

//  =============== ADMIN – APPROVE COMPANY   (dont working)  ===============
export async function approveCompany(companyId: string) {
  const company = await prisma.company.update({
    where: { id: companyId },
    data: {
      status: CompanyStatus.APPROVED,
      owner: {
        update: {
          role: UserRole.COMPANY_OWNER,
          status: UserStatus.ACTIVE,
        },
      },
    },
  });

  revalidatePath("/dashboard/companies");
  return company;
}
//  =============== ADMIN – BLOCK COMPANY    (dont working)  ===============
export async function blockCompany(companyId: string) {
  const company = await prisma.company.update({
    where: { id: companyId },
    data: {
      status: CompanyStatus.BLOCKED,
      owner: {
        update: {
          status: UserStatus.BANNED,
        },
      },
    },
  });

  revalidatePath("/dashboard/companies");
  return company;
}

//  =============== (dont working)  ===============
// export async function verifyCompany(id: string) {
//   const company = await prisma.company.update({
//     where: { id },
//     data: { status: "APPROVED" },
//     include: { owner: true },
//   });

//   await prisma.user.update({
//     where: { id: company.ownerId },
//     data: { role: UserRole.COMPANY_OWNER }, // 👈 يتحوّل OWNER لسوبر شركة
//   });

//   // 🔥 Create Notification
//   await prisma.notification.create({
//     data: {
//       userId: company.ownerId,
//       title: "Company Verified",
//       message: `Congratulations! Your company "${company.name}" has been approved.`,
//       type: "success",
//     },
//   });

//   revalidatePath("/dashboard/companies");
//   return company;

//   // return { success: true };
// }

//  =============== ADMIN – REJECTED COMPANY  ===============
export async function rejectedCompany(companyId: string) {
  const company = await prisma.company.update({
    where: { id: companyId },
    data: { status: "REJECTED" },
    include: { owner: true },
  });

  await prisma.user.update({
    where: { id: company.ownerId },
    data: { role: UserRole.USER },
  });

  await prisma.notification.create({
    data: {
      userId: company.ownerId,
      title: "Company Unverified",
      message: `Your company "${company.name}" is no longer verified.`,
      type: "ALERT",
    },
  });

  // revalidatePath("/dashboard/companies");
  return company;
}

//  =============== (dont working)  ===============
export async function getCompany(): Promise<CompanyWithAll[]> {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: true,
        orders: true,
        cars: {
          include: {
            model: true,
            category: true,
            images: true,
            orders: true,
            company: { select: { id: true, name: true, logo: true } },
          },
        },
      },
    });

    // Map status to verified
    return companies.map((c) => ({
      ...c,
      verified: c.status === "APPROVED", // ✅ true if company is approved
    }));
  } catch (error: any) {
    console.error("Error fetching company items:", error);
    return [];
  }
}

//  =============== ADMIN – COMPANY STATS  ===============

// ✅ Total companies
export async function getTotalCompanies() {
  return prisma.company.count();
}

// ✅ Approved / Active companies
export async function getActiveCompanies() {
  return prisma.company.count({
    where: {
      status: CompanyStatus.APPROVED,
    },
  });
}

// ⏳ Pending companies
export async function getPendingCompanies() {
  return prisma.company.count({
    where: {
      status: CompanyStatus.PENDING,
    },
  });
}

// ❌ Rejected companies
export async function getRejectedCompanies() {
  return prisma.company.count({
    where: {
      status: CompanyStatus.REJECTED,
    },
  });
}

// ⛔ Blocked companies
export async function getBlockedCompanies() {
  return prisma.company.count({
    where: {
      status: CompanyStatus.BLOCKED,
    },
  });
}

// craete function get all company mahom el user w kol chay details al user w al company
export async function getAllCompaniesWithUsers() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            image: true,
            createdAt: true,
          },
        },
        cars: {
          select: {
            id: true,
          },
        },
        orders: {
          select: {
            id: true,
          },
        },
      },
    });

    // 🔹 optional: format data
    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      city: company.city,
      address: company.address,
      location: company.location,
      status: company.status,
      createdAt: company.createdAt,

      logo: company.logo || null,
      owner: company.owner,

      totalCars: company.cars.length,
      totalOrders: company.orders.length,
    }));
  } catch (error) {
    console.error("❌ Error fetching companies with users:", error);
    return [];
  }
}

export async function deleteCompanyById(companyId: string) {
  try {
    await prisma.company.delete({
      where: { id: companyId },
    });

    // Refresh dashboard after delete
    // revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Delete company error:", error);
    return { success: false, message: "Failed to delete company" };
  }
}
