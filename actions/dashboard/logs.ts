/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { LogType } from "@prisma/client";

// create a log
export async function createLog(
  type: "INFO" | "WARN" | "ERROR",
  message: string,
  details?: any
) {
  try {
    await prisma.log.create({
      data: {
        type,
        message,
        details: details ?? undefined, // optional JSON
      },
    });
  } catch (error) {
    console.error("Failed to create log:", error);
  }
}

// fetch logs with filtering support
export async function getLogs(
  limit = 100,
  filterType?: "INFO" | "WARN" | "ERROR" | "ALL"
) {
  try {
    const where =
      filterType && filterType !== "ALL" ? { type: filterType as LogType } : {};

    const logs = await prisma.log.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return logs;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return [];
  }
}

// delete all logs
export async function deleteAllLogs() {
  try {
    await prisma.log.deleteMany({});
    return { success: true };
  } catch (error) {
    console.error("Failed to delete logs:", error);
    return { success: false, error };
  }
}
