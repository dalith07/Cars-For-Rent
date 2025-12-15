/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";

interface CarItemInput {
  name: string;
  description?: string;
  engine: string;
  horsepower: string;
  transmission: string;
  price: number;
  year: number;
  quantity: string;
  discount: string;
  status: string;
  version: string;
  categoryName: string;
  categoryId: string;
  modelName: string;
  modelId: string;
  imagesOnCars: { imageUrl: string }[];
}

export async function createCarItem(data: CarItemInput) {
  try {
    if (
      !data.name ||
      !data.price ||
      !data.engine ||
      !data.categoryName ||
      !data.modelName ||
      !data.quantity ||
      !data.discount ||
      !data.status ||
      !data.version ||
      !data.horsepower ||
      !data.transmission
    ) {
      throw new Error("Missing required fields");
    }

    // Check uniqueness by name (id is generated)
    // const exist = await prisma.itemsCars.findFirst({
    //   where: { name: data.name },
    // });

    // if (exist) {
    //   throw new Error("Car with this name already exists");
    // }

    const horsepowerValue =
      data.horsepower === "Custom" || data.horsepower.trim() === ""
        ? 0
        : parseInt(data.horsepower);

    const quantityValue =
      data.quantity && data.quantity.trim() !== ""
        ? parseFloat(data.quantity)
        : 1;

    const discountValue =
      data.discount && data.discount.trim() !== ""
        ? parseFloat(data.discount)
        : 0;

    const carItem = await prisma.itemsCars.create({
      data: {
        name: data.name,
        description: data.description || "",
        price: data.price,
        year: data.year || 2025,
        engine: data.engine || "Not specified",
        quantity: quantityValue,
        discount: discountValue,
        status: data.status || "available",
        version: data.version || "new",
        horsepower: horsepowerValue || 0,
        transmission: data.transmission || "auto",
        category: {
          connectOrCreate: {
            where: { name: data.categoryName || data.categoryId },
            create: {
              name: data.categoryName || data.categoryId || "Uncategorized",
            },
          },
        },
        model: {
          connectOrCreate: {
            where: { name: data.modelName || data.modelId },
            create: { name: data.modelName || data.modelId || "Generic" },
          },
        },
        imagesOnCars: {
          create: data.imagesOnCars
            .filter((img) => img.imageUrl && img.imageUrl.trim() !== "")
            .map((img) => ({
              imageUrl: img.imageUrl,
            })),
        },
      },
      include: {
        imagesOnCars: true,
        category: true,
        model: true,
      },
    });

    console.log("CreateCarItem Received Data❤️:", data);

    return { success: true, data: carItem };
  } catch (error: any) {
    console.error("❌ Error creating car item:", error);
    return {
      success: false,
      message: error.message || "Failed to create car item",
    };
  }
}

interface CarItemUpdateInput {
  id: string;
  name: string;
  description?: string;
  engine: string;
  horsepower: string;
  transmission: string;
  price: number;
  year: number;
  quantity: string;
  discount: string;
  status: string;
  version: string;

  categoryId: string;
  categoryName: string;
  modelName: string;
  modelId: string;

  imagesOnCars: { imageUrl: string }[];
}

export async function updateCarItem(data: CarItemUpdateInput) {
  try {
    if (
      !data.name ||
      !data.price ||
      !data.engine ||
      !data.categoryName ||
      !data.modelName ||
      !data.quantity ||
      !data.discount ||
      !data.status ||
      !data.version ||
      !data.horsepower ||
      !data.transmission
    ) {
      throw new Error("Missing required fields");
    }

    // Get the current car to check if name has changed
    const currentCar = await prisma.itemsCars.findUnique({
      where: { id: data.id },
      select: { name: true },
    });

    if (!currentCar) {
      return { success: false, message: "Car not found" };
    }

    // Only check for duplicate name if the name is actually changing
    const nameChanged = currentCar.name !== data.name;
    if (nameChanged) {
      const existingByName = await prisma.itemsCars.findFirst({
        where: { name: data.name },
      });

      if (existingByName && existingByName.id !== data.id) {
        return { success: false, message: "Car name already exists" };
      }
    }

    const horsepowerValue =
      data.horsepower === "Custom" ? 0 : parseInt(data.horsepower);

    // Build update data conditionally
    const updateData: any = {
      description: data.description,
      price: data.price,
      year: data.year,
      engine: data.engine,
      quantity: data.quantity ? parseFloat(data.quantity) : 0,
      discount: data.discount ? parseFloat(data.discount) : 0,
      status: data.status,
      version: data.version,
      horsepower: horsepowerValue,
      transmission: data.transmission,
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
      imagesOnCars: {
        deleteMany: {},
        create: data.imagesOnCars.map((img) => ({ imageUrl: img.imageUrl })),
      },
    };

    // Only update name if it has changed
    if (nameChanged) {
      updateData.name = data.name;
    }

    const updatedCar = await prisma.itemsCars.update({
      where: { id: data.id },
      data: updateData,
      include: {
        category: true,
        model: true,
        imagesOnCars: true,
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

export async function getCarItems() {
  try {
    const cars = await prisma.itemsCars.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        model: true,
        imagesOnCars: true,
      },
    });

    // console.log("✅ Successfully fetched cars:", cars.length);
    // if (cars.length > 0) {
    //   console.log("🖼️ First car images:", cars[0]?.imagesOnCars);
    // }

    return cars;
  } catch (error: any) {
    console.error("❌ Error fetching car items:", error);
    return []; // Return empty array instead of error object
  }
}

export async function getCarItemById(id: string) {
  try {
    if (!id) throw new Error("Car ID is required");

    const car = await prisma.itemsCars.findUnique({
      where: { id },
      include: {
        category: true,
        model: true,
        imagesOnCars: true,
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
    const car = await prisma.itemsCars.findUnique({
      where: { id },
      select: { modelId: true, categoryId: true },
    });

    if (!car) throw new Error("Car not found");

    // 2. Delete the car
    await prisma.itemsCars.delete({
      where: { id },
    });

    // 3. If model has no more cars → delete model
    if (car.modelId) {
      const count = await prisma.itemsCars.count({
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
      const count = await prisma.itemsCars.count({
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
    const deletedImage = await prisma.imagesOnCars.delete({
      where: { id },
    });

    return {
      success: true,
      data: deletedImage,
    };
  } catch (error: any) {
    console.error("❌ Error deleting image:", error);

    return {
      success: false,
      message: error.message || "Failed to delete image",
    };
  }
}
