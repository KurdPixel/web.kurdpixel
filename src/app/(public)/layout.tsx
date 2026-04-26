import React from "react";
import HeaderPublic from "@/components/HeaderPublic";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderPublic />
      <main className="flex-1">{children}</main>
    </>
  );
}

