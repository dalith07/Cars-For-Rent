// "use server";

// import { getUserByEmail } from "@/data/user";
// import { LoginSchema } from "@/lib/validationSchema";
// import z from "zod";
// import { AuthError } from "next-auth";
// // import { DEFAULT_LOGIN_REDIRECT } from "@/route";
// import { signIn } from "@/auth";
// import { createLog } from "./dashboard/logs";

// export async function login(values: z.infer<typeof LoginSchema>) {
//   const validatedFields = LoginSchema.safeParse(values);
//   if (!validatedFields.success) {
//     return { error: "Invalid fields!" };
//   }

//   const { email, password } = validatedFields.data;

//   // Check if user exists
//   const existingUser = await getUserByEmail(email);
//   if (!existingUser || !existingUser.email || !existingUser.password) {
//     return { error: "Email does not exist!" };
//   }

//   try {
//     // await signIn("credentials", {
//     //   email,
//     //   password,
//     //   redirectTo: DEFAULT_LOGIN_REDIRECT,
//     // });
//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (result?.error) {
//       await createLog("ERROR", "Login failed with credentials", {
//         email,
//         error: result.error,
//       });
//       return { error: result.error };
//     }

//     // ✅ Success
//     await createLog("INFO", "User logged in successfully", {
//       userId: existingUser.id,
//       email: existingUser.email,
//     });

//     // ⭐ FIX: return success message
//     return { success: "Login successful!" };
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return { error: "Invalid credentials!" };
//         default: {
//           return { error: "Something went wrong!" };
//         }
//       }
//     }

//     await createLog("ERROR", "Login failed with an exception", {
//       email,
//       error: error instanceof Error ? error.message : error,
//     });
//     throw error;
//   }
// }

"use server";

import { getUserByEmail } from "@/data/user"; // Prisma query to get user by email
import { LoginSchema } from "@/lib/validationSchema";
import z from "zod";
import { signIn } from "@/auth"; // next-auth credentials
import { createLog } from "./dashboard/logs"; // function to log events

export async function login(values: z.infer<typeof LoginSchema>) {
  // 1️⃣ Validate fields
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  // 2️⃣ Check if user exists
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  // 3️⃣ Check if user is blocked
  if (existingUser.status === "BANNED") {
    return { error: "You are banned and cannot log in" };
  }

  try {
    // 4️⃣ Try to sign in with credentials
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // مهم باش نتحكم في الرسائل
    });

    if (result?.error) {
      await createLog("ERROR", "Login failed with credentials", {
        email,
        error: result.error,
      });
      return { error: result.error };
    }

    // 5️⃣ Success login
    await createLog("INFO", "User logged in successfully", {
      userId: existingUser.id,
      email: existingUser.email,
    });

    return { success: "Login successful!" };
  } catch (error) {
    await createLog("ERROR", "Login failed with an exception", {
      email,
      error: error instanceof Error ? error.message : error,
    });
    return { error: "Something went wrong!" };
  }
}
