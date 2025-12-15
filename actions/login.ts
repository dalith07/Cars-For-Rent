"use server";

import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/lib/validationSchema";
import z from "zod";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { signIn } from "@/auth";

export async function login(values: z.infer<typeof LoginSchema>) {
  // Validate fields
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  // Check if user exists
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    // ⭐ FIX: return success message
    return { success: "Login successful!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default: {
          return { error: "Something went wrong!" };
        }
      }
    }
    throw error;
  }
}
