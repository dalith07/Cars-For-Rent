/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CarWithAll } from "@/lib/utils";

interface CarItemInput {
  name: string;
  description?: string;
  engine: string;
  horsepower: string;
  transmission: string;
  pricePerDay: number;
  year: number;
  stock: string;
  discount?: string;
  status: string;

  categoryName: string;
  modelName: string;
  modelId: string;

  images: { imageUrl: string }[];
}

export async function createCarItem(data: CarItemInput) {
  try {
    // Validate required fields
    if (
      !data.name ||
      !data.pricePerDay ||
      !data.engine ||
      !data.categoryName ||
      !data.modelName ||
      !data.stock ||
      !data.status ||
      !data.horsepower ||
      !data.transmission
    ) {
      throw new Error("Missing required fields");
    }

    // Get session
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Fetch company owned by this user
    const company = await prisma.company.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!company) throw new Error("No company found for this user");

    // Upsert category to get its ID
    const category = await prisma.category.upsert({
      where: { name: data.categoryName },
      update: {},
      create: { name: data.categoryName },
    });

    // Upsert model to get its ID
    const model = await prisma.model.upsert({
      where: { name: data.modelName },
      update: {},
      create: { name: data.modelName },
    });

    const horsepowerValue =
      data.horsepower === "Custom" ? 0 : parseInt(data.horsepower);

    const statusEnum: Record<string, "AVAILABLE" | "RENTED" | "MAINTENANCE"> = {
      available: "AVAILABLE",
      rented: "RENTED",
      maintenance: "MAINTENANCE",
    };

    const transmissionEnum: Record<
      string,
      "MANUAL" | "AUTOMATIC" | "SEMI_AUTOMATIC"
    > = {
      manual: "MANUAL",
      automatic: "AUTOMATIC",
      semi_automatic: "SEMI_AUTOMATIC",
      auto: "AUTOMATIC", // alias
    };

    // Create car
    const carItem = await prisma.car.create({
      data: {
        name: data.name,
        description: data.description || "",
        pricePerDay: data.pricePerDay,
        year: data.year,
        engine: data.engine || "Not specified",
        stock: parseFloat(data.stock),
        discount: parseFloat(data.discount || "0"),
        status: statusEnum[data.status.toLowerCase()] as any,
        transmission: transmissionEnum[data.transmission.toLowerCase()] as any,
        horsepower: horsepowerValue,

        companyId: company.id,
        categoryId: category.id,
        modelId: model.id,

        images: {
          create: data.images
            .filter((img) => img.imageUrl.trim() !== "")
            .map((img) => ({ imageUrl: img.imageUrl })),
        },
      },
      include: {
        images: true,
        category: true,
        model: true,
        orders: true,
      },
    });

    // console.log("Car Added Successfully ❤️", carItem);

    return { success: true, data: carItem };
  } catch (error: any) {
    console.error("❌ Error creating car item:", error);
    return {
      success: false,
      message: error.message || "Failed to create car item",
    };
  }
}

///////////////////////////////////////////////////////////////////////////////
interface CarItemUpdateInput {
  id: string;
  name: string;
  description?: string;
  engine: string;
  horsepower: string;
  transmission: string;
  pricePerDay: number;
  year: number;
  stock: string;
  discount?: string;
  status: string;

  categoryId: string;
  categoryName: string;
  modelName: string;
  modelId: string;

  images: { imageUrl: string }[];
}

export async function updateCarItem(data: CarItemUpdateInput) {
  try {
    if (
      !data.name ||
      !data.pricePerDay ||
      !data.engine ||
      !data.categoryName ||
      !data.modelName ||
      !data.stock ||
      !data.discount ||
      !data.status ||
      !data.horsepower ||
      !data.transmission
    ) {
      throw new Error("Missing required fields");
    }

    // Get the current car to check if name has changed
    const currentCar = await prisma.car.findUnique({
      where: { id: data.id },
      select: { name: true },
    });

    if (!currentCar) {
      return { success: false, message: "Car not found" };
    }

    // Only check for duplicate name if the name is actually changing
    const nameChanged = currentCar.name !== data.name;
    if (nameChanged) {
      const existingByName = await prisma.car.findFirst({
        where: { name: data.name },
      });

      if (existingByName && existingByName.id !== data.id) {
        return { success: false, message: "Car name already exists" };
      }
    }

    // Upsert category to get its ID
    // const category = await prisma.category.upsert({
    //   where: { name: data.categoryName },
    //   update: {},
    //   create: { name: data.categoryName },
    // });

    // Upsert model to get its ID
    // const model = await prisma.model.upsert({
    //   where: { name: data.modelName },
    //   update: {},
    //   create: { name: data.modelName },
    // });

    const statusEnum: Record<string, "AVAILABLE" | "RENTED" | "MAINTENANCE"> = {
      available: "AVAILABLE",
      rented: "RENTED",
      maintenance: "MAINTENANCE",
    };

    const transmissionEnum: Record<
      string,
      "MANUAL" | "AUTOMATIC" | "SEMI_AUTOMATIC"
    > = {
      manual: "MANUAL",
      automatic: "AUTOMATIC",
      semi_automatic: "SEMI_AUTOMATIC",
      auto: "AUTOMATIC", // alias
    };

    const horsepowerValue =
      data.horsepower === "Custom" ? 0 : parseInt(data.horsepower);

    // Build update data conditionally
    const updateData: any = {
      description: data.description,
      pricePerDay: data.pricePerDay,
      year: data.year,
      engine: data.engine,
      stock: data.stock ? parseFloat(data.stock) : 0,
      discount: data.discount ? parseFloat(data.discount) : 0,
      status: statusEnum[data.status.toLowerCase()] as any,
      horsepower: horsepowerValue,
      transmission: transmissionEnum[data.transmission.toLowerCase()] as any,

      category: {
        connectOrCreate: {
          where: { name: data.categoryName },
          create: { name: data.categoryName },
        },
      },
      model: {
        connectOrCreate: {
          where: { name: data.modelName },
          create: { name: data.modelName },
        },
      },

      images: {
        deleteMany: {},
        create: data.images.map((img) => ({ imageUrl: img.imageUrl })),
      },
    };

    // Only update name if it has changed
    if (nameChanged) {
      updateData.name = data.name;
    }

    const updatedCar = await prisma.car.update({
      where: { id: data.id },
      data: updateData,
      include: {
        category: true,
        model: true,
        images: true,
      },
    });

    return { success: true, data: updatedCar };
  } catch (error: any) {
    console.error("❌ Error updating car item:", error);

    // Handle Prisma unique constraint error specifically
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return {
        success: false,
        message: "Car name already exists. Please choose a different name.",
      };
    }

    return {
      success: false,
      message: error.message || "Failed to update car item",
    };
  }
}

// =================== USER (GET CAR ITEMS) SHOW IN MARKET CARS  ===================
export async function getCarItems(): Promise<CarWithAll[]> {
  try {
    return await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        model: true,
        images: true,
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching car items:", error);
    return [];
  }
}

export async function getCarItemsByCompany() {
  try {
    // 1️⃣ احصل على session
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // 2️⃣ احصل على الشركة الخاصة بالمستخدم
    const company = await prisma.company.findFirst({
      where: { ownerId: session.user.id },
    });
    if (!company) throw new Error("No company found for this user");

    // 3️⃣ جلب سيارات هذه الشركة فقط
    const cars = await prisma.car.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        model: true,
        images: true,
        orders: true,
        company: true,
      },
    });

    return cars;
  } catch (error: any) {
    console.error("❌ Error fetching car items:", error);
    return [];
  }
}

export async function getCarItemById(id: string) {
  try {
    if (!id) throw new Error("Car ID is required");

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        category: true,
        model: true,
        images: true,
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    if (!car) {
      return { success: false, message: "Car not found" };
    }

    return { success: true, data: car };
  } catch (error: any) {
    console.error("❌ Error fetching car by ID:", error);
    return { success: false, message: error.message || "Failed to fetch car" };
  }
}

export async function deleteCarItem(id: string) {
  try {
    if (!id) throw new Error("Car ID is required");

    // 1. Find the car first
    const car = await prisma.car.findUnique({
      where: { id },
      select: { modelId: true, categoryId: true },
    });

    if (!car) throw new Error("Car not found");

    // 2. Delete the car
    await prisma.car.delete({
      where: { id },
    });

    // 3. If model has no more cars → delete model
    if (car.modelId) {
      const count = await prisma.car.count({
        where: { modelId: car.modelId },
      });

      if (count === 0) {
        await prisma.model.delete({
          where: { id: car.modelId },
        });
      }
    }

    // 4. If category has no more cars → delete category
    if (car.categoryId) {
      const count = await prisma.car.count({
        where: { categoryId: car.categoryId },
      });

      if (count === 0) {
        await prisma.category.delete({
          where: { id: car.categoryId },
        });
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("❌ Error deleting car item:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteImageCarItemById(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        message: "Image id is required",
      };
    }

    const deletedImage = await prisma.imagesOnCars.delete({
      where: { id },
    });

    return {
      success: true,
      data: deletedImage,
    };
  } catch (error: any) {
    console.error("❌ Error deleting car image:", error);

    return {
      success: false,
      message: error?.message || "Failed to delete image",
    };
  }
}

export async function getTotalCars() {
  try {
    const count = await prisma.car.count();
    return count;
  } catch (error: any) {
    console.error("❌ Error counting cars:", error);
    return 0;
  }
}

export async function getCarsGrowthFromLastWeek() {
  try {
    const now = new Date();

    const startOfThisWeek = new Date();
    startOfThisWeek.setDate(now.getDate() - 7);

    const startOfLastWeek = new Date();
    startOfLastWeek.setDate(now.getDate() - 14);

    const thisWeekCount = await prisma.car.count({
      where: {
        createdAt: {
          gte: startOfThisWeek,
        },
      },
    });

    const lastWeekCount = await prisma.car.count({
      where: {
        createdAt: {
          gte: startOfLastWeek,
          lt: startOfThisWeek,
        },
      },
    });

    if (lastWeekCount === 0) {
      return { percent: 100, isUp: true };
    }

    const percent = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;

    return {
      percent: Math.round(percent),
      isUp: percent >= 0,
    };
  } catch (error) {
    console.error("❌ Error calculating cars growth:", error);
    return { percent: 0, isUp: true };
  }
}

// add function get all cars mahom details al company
export async function getAllCarsWithCompanyDetails() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        model: true,
        images: true,
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            status: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return cars;
  } catch (error) {
    console.error("❌ Error fetching cars with company details:", error);
    return [];
  }
}
