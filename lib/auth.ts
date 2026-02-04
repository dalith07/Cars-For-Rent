// /lib/auth.ts
import { auth } from "@/auth";
import { prisma } from "./prisma";

export async function currentUser() {
  const session = await auth(); // get session of logged-in user
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { company: true }, // important
  });

  return user;
}
