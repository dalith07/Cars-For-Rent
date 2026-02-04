import { z } from "zod";

// Register Schema
export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(8, { message: "Minimum 6 characters required" }),
  name: z.string().min(1, { message: "Name is required" }),
});

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(8, { message: "Password is required" }).max(60),
  // code: z.optional(z.string()),
});

export const ProfileSchema = z.object({
  phoneNumber: z.string().optional(),
  streetAddress: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  image: z.string().optional(), // 🔥 مهم
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
