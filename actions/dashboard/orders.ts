"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { RentalStatus, PaymentStatus, NotificationType } from "@prisma/client";

export async function getUsersOrders() {
  try {
    const order = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        orderCars: { include: { car: true } },
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
  newStatus: RentalStatus,
  isPaid: PaymentStatus,
) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        paymentStatus: isPaid,
      },
      include: {
        user: true,
        orderCars: { include: { car: true } },
      },
    });

    // Notification messages
    const statusMessages: Record<RentalStatus, string> = {
      PENDING: "Your order is pending review.",
      ACCEPTED: "✅ Your rental order has been accepted.",
      REJECTED: "❌ Your rental order has been rejected.",
      CANCELLED: "⚠️ Your rental order has been cancelled.",
      COMPLETED: "🎉 Your rental has been completed successfully.",
    };

    const paymentMessages: Record<PaymentStatus, string> = {
      NOT_PAID: "⚠️ Payment is marked as not paid.",
      PAID: "💰 Payment has been successfully received.",
    };

    // Create notifications for status
    await prisma.notification.create({
      data: {
        userId: updatedOrder.userId,
        title: "Order Status Update",
        message: statusMessages[newStatus],
        type: NotificationType.ORDER, // ✅ required enum
      },
    });

    // Create notifications for payment
    await prisma.notification.create({
      data: {
        userId: updatedOrder.userId,
        title: "Payment Status Update",
        message: paymentMessages[isPaid],
        type: NotificationType.PAYMENT, // ✅ required enum
      },
    });

    return updatedOrder;
  } catch (error: any) {
    console.error("❌ Error updating order:", error);
    throw error;
  }
}
