"use client";

import React from "react";
import { ClerkProvider, UserButton } from "@clerk/nextjs";

export default function ClerkUserButton({ afterSignOutUrl }: { afterSignOutUrl?: string }) {
  return (
    <ClerkProvider>
      <UserButton afterSignOutUrl={afterSignOutUrl ?? "/"} />
    </ClerkProvider>
  );
}

