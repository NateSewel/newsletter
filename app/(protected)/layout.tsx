import { getAuthUser } from "@/actions/users";

import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import Sidebar from "./dashboard/components/Sidebar";
import Navbar from "./dashboard/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen flex">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen hidden md:block">
        <Sidebar role={user.role} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[180px] lg:ml-[250px]">
        <Navbar user={user} />
        <div className="p-4 lg:p-6 lg:px-12">{children}</div>
      </main>
    </div>
  );
}
