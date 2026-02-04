"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// interface CarItemInput {
//   userId?: string;
//   customerName: string;
//   phoneNumber: string;
//   country: string;
//   customerEmail: string;
//   items: {
//     id: string;
//     name: string;
//     description?: string;
//     price: number;
//     stock: number;
//     discount?: number;
//     image?: string;
//     category: string;
//     model: string;
//   }[];
//   subtotal: number;
//   tax: number;
//   shipping: number;
//   total: number;
//   shippingAddress: string;
// }
// export async function createUserCart(data: CarItemInput) {
//   try {
//     if (
//       !data.customerName ||
//       !data.customerName ||
//       !data.phoneNumber ||
//       !data.country ||
//       !data.customerEmail ||
//       !data.items ||
//       data.items.length === 0
//     ) {
//       throw new Error("Missing required fields");
//     }

//     // Generate order number
//     const orderNumber = `ORD-${Date.now()}-${Math.random()
//       .toString(36)
//       .substr(2, 9)
//       .toUpperCase()}`;

//     // Create order with items
//     const order = await prisma.order.create({
//       data: {
//         orderNumber: orderNumber,
//         userId: data.userId,
//         phoneNumber: data.phoneNumber,
//         customerName: data.customerName,
//         customerEmail: data.customerEmail,
//         subtotal: data.subtotal,
//         tax: data.tax,
//         shipping: data.shipping,
//         total: data.total,
//         country: data.country,
//         shippingAddress: data.shippingAddress,
//         items: {
//           create: data.items.map((item: any) => ({
//             productId: item.id,
//             name: item.name,
//             description: item.description,
//             price: item.price,
//             stock: item.stock,
//             discount: item.discount,
//             image: item.image,
//             category: item.category,
//             model: item.model,
//             subtotal:
//               item.quantity *
//               (item.discount
//                 ? item.price * (1 - item.discount / 100)
//                 : item.price),
//           })),
//         },
//       },
//       include: { car: true },
//     });

//     console.log("orderrrrr 🙌🙌🙌🙌🙌:", data);

//     return {
//       success: true,
//       order,
//       message: "Order created successfully",
//     };
//   } catch (error: any) {
//     console.error("❌ Error creating car item:", error);
//     return {
//       success: false,
//       message: error.message || "Failed to create car item",
//     };
//   }
// }

interface OrderCarInput {
  carId: string;
  pricePerDay: number;
  discount?: number;
}
interface CreateOrderInput {
  userId: string;
  companyId: string;
  startDate: Date;
  endDate: Date;
  cars: OrderCarInput[];
}

export async function createOrder({
  userId,
  companyId,
  startDate,
  endDate,
  cars,
}: CreateOrderInput) {
  if (!companyId) throw new Error("Company ID is required");
  if (!userId) throw new Error("User ID is required");
  if (!cars || cars.length === 0) throw new Error("No cars provided");

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (totalDays <= 0) throw new Error("Invalid rental period");

  const TAX_RATE = 0.1;
  const SERVICE_FEE = 20;

  const orderNumber = `ORD-${Date.now()}`;

  // ✅ subtotal (cars only)
  const subtotal = cars.reduce((sum, car) => {
    const priceAfterDiscount =
      car.pricePerDay * (1 - (car.discount ?? 0) / 100);
    return sum + priceAfterDiscount * totalDays;
  }, 0);

  // ✅ tax + final total
  const tax = subtotal * TAX_RATE;
  const finalTotal = subtotal + tax + SERVICE_FEE;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      startDate,
      endDate,
      totalDays,
      totalPrice: finalTotal, // ✅ هنا الإصلاح الحقيقي
      user: { connect: { id: userId } },
      company: { connect: { id: companyId } },
      orderCars: {
        create: cars.map((car) => {
          const carTotal =
            car.pricePerDay * totalDays * (1 - (car.discount ?? 0) / 100);

          return {
            days: totalDays,
            pricePerDay: car.pricePerDay,
            discount: car.discount ?? 0,
            totalPrice: carTotal,
            car: { connect: { id: car.carId } },
          };
        }),
      },
    },
  });

  return order;
}

export async function getUserOrders() {
  const session = await auth();

  if (!session?.user?.email) return [];

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: { createdAt: "desc" },
    include: {
      car: true,
      user: {
        include: {
          profile: true,
        },
      },
      company: true,
    },
  });

  return orders;
}

export async function getOrderCount(userId: string) {
  if (!userId) return 0;

  const count = await prisma.order.count({
    where: { userId },
  });

  return count;
}

export async function deleteUserYourOrder(orderId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // ✅ check order belongs to this user
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: { car: true },
  });

  if (!order) {
    throw new Error("Order not found or not allowed");
  }

  // ❌ optional: prevent deleting paid orders
  if (order.paymentStatus === "PAID") {
    throw new Error("You cannot delete a paid order");
  }

  // 🗑️ delete
  await prisma.order.delete({
    where: { id: orderId },
  });

  return { success: true };
}
