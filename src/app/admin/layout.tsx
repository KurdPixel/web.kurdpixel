import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "../../components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Header />
      {children}
    </ClerkProvider>
  );
}

