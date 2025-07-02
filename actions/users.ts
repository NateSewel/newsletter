"use server";

import { auth } from "@/lib/auth";

import db from "@/prisma/db";
import { UserRole } from "@prisma/client";
import { headers } from "next/headers";
export async function getAuthUser() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the
  });
  const user = session?.user;
  if (!user) return null;
  return {
    ...session.user,
    role: session.user.role as UserRole,
    image: session.user.image as string | null,
  };
}
export async function getAllUsers() {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "USER",
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}
