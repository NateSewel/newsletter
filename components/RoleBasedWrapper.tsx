import { redirect } from "next/navigation";
import { ReactNode } from "react";

import NotAuthorized from "./NotAuthorized";
import { getCurrentUser } from "@/actions/projects";
import { UserRole } from "@prisma/client";

// type Role = "USER" | "ADMIN";

interface Props {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default async function RoleBasedWrapper({
  children,
  allowedRoles,
}: Props) {
  const user = await getCurrentUser();
  const userRole = user?.role as UserRole;

  if (!user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(userRole)) {
    return <NotAuthorized />;
  }

  return <>{children}</>;
}
