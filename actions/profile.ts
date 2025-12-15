"use server";

import { prisma } from "@/lib/prisma";
import { ProfileSchema } from "@/lib/validationSchema";
import z from "zod";

export const profile = async (
  values: z.infer<typeof ProfileSchema>,
  email: string,
  userId: string
) => {
  const validated = ProfileSchema.safeParse(values);

  if (!validated.success) {
    return { error: "Invalid fields!" };
  }

  const { phoneNumber, streetAddress, city, postalCode } = validated.data;

  // 1️⃣ Check if the profile exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    // 2️⃣ UPDATE PROFILE
    await prisma.profile.update({
      where: { userId },
      data: {
        phoneNumber,
        streetAddress,
        city,
        postalCode,
      },
    });

    return { success: "Profile updated!" };
  }

  // 3️⃣ CREATE PROFILE
  await prisma.profile.create({
    data: {
      phoneNumber,
      streetAddress,
      city,
      postalCode,
      userId,
    },
  });

  return { success: "Profile created!" };
};
