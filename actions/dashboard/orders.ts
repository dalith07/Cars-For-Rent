"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";

export async function getUsersOrders() {
  try {
    const order = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        user: true,
      },
    });

    return order;
  } catch (error: any) {
    console.error("❌ Error fetching car items:", error);
    return []; // Return empty array instead of error object
  }
}

export async function updateOrder(
  orderId: string,
  status: "confirmed" | "processing" | "cancelled",
  isPaid: "Paid" | "Not Paid"
) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status, isPaid },
      include: { user: true, items: true },
    });

    if (
      (status === "confirmed" || status === "cancelled") &&
      updatedOrder.userId
    ) {
      await prisma.notification.create({
        data: {
          userId: updatedOrder.userId,
          title:
            status === "confirmed"
              ? "Order Confirmed ✅"
              : "Order Cancelled ❌",
          message:
            status === "confirmed"
              ? "Your order has been confirmed successfully."
              : "Your order has been cancelled. Please contact support if needed.",
        },
      });
    }

    return updatedOrder;
  } catch (error: any) {
    console.error("❌ Error updating order:", error);
    throw error;
  }
}
