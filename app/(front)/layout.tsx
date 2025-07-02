import React, { ReactNode } from "react";

export default function FrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" min-h-screen">
      {/* <Header /> */}
      {children}
    </div>
  );
}
