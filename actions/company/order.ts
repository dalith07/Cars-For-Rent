"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; // NextAuth
import { redirect } from "next/navigation";
import { PaymentStatus, RentalStatus } from "@prisma/client";

export async function getCompanyOrders() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Compnay ( GET USER COMPANY )
  const company = await prisma.company.findUnique({
    where: {
      ownerId: session.user.id,
    },
  });

  if (!company) {
    throw new Error("Company not found for this user");
  }

  // 2️⃣ نجيبو الأوردرات متاع الشركة
  const orders = await prisma.order.findMany({
    where: {
      companyId: company.id,
    },
    include: {
      user: { include: { profile: true } },
      car: true,
      orderCars: {
        include: { car: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: RentalStatus,
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // نجيبو الأوردر + نتحققو إلي تابع للشركة متاعو
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      company: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.company.ownerId !== session.user.id) {
    throw new Error("Not allowed");
  }

  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  // Message حسب الـ status
  const statusMessages: Record<RentalStatus, string> = {
    PENDING: "Your order is pending review.",
    ACCEPTED: "✅ Your rental order has been accepted.",
    REJECTED: "❌ Your rental order has been rejected.",
    CANCELLED: "⚠️ Your rental order has been cancelled.",
    COMPLETED: "🎉 Your rental has been completed successfully.",
  };

  // Create notification
  await prisma.notification.create({
    data: {
      userId: order.userId,
      title: "Order Status Update",
      message: statusMessages[newStatus],
      type: "ORDER",
    },
  });

  return updatedOrder;
}

export async function updatePaymentStatus(
  orderId: string,
  newPaymentStatus: PaymentStatus,
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // نجيبو الأوردر + الشركة
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      company: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // نتحققوا اللي اليوزر هو owner متاع الشركة
  if (order.company.ownerId !== session.user.id) {
    throw new Error("Not allowed");
  }

  // Update payment status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: newPaymentStatus,
    },
  });

  // Notification message
  const paymentMessages: Record<PaymentStatus, string> = {
    NOT_PAID: "⚠️ Payment is marked as not paid.",
    PAID: "💰 Payment has been successfully received.",
  };

  // Create notification
  await prisma.notification.create({
    data: {
      userId: order.userId,
      title: "Payment Status Update",
      message: paymentMessages[newPaymentStatus],
      type: "PAYMENT",
    },
  });

  return updatedOrder;
}

export async function removeOrder(orderId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // نجيبو الأوردر + الشركة
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      company: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // نتأكدو إلي الأوردر تابع لشركة الـ user
  if (order.company.ownerId !== session.user.id) {
    throw new Error("Not allowed");
  }

  // نحذف الأوردر (OrderCar يتحذف أوتوماتيك بسبب onDelete: Cascade)
  await prisma.order.delete({
    where: { id: orderId },
  });

  // Notification للـ user
  await prisma.notification.create({
    data: {
      userId: order.userId,
      title: "Order Cancelled",
      message: "❌ Your rental order has been removed by the company.",
      type: "ALERT",
    },
  });

  return { success: true };
}
