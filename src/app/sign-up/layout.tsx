import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}

