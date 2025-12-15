"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/lib/validationSchema";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import bcrypt from "bcryptjs";
import z from "zod";

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in user!" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });

  return { success: "Confirmation Email sent!" };
}
