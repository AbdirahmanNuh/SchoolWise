'use client';

import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import React from "react";

// 1. Initialize the Convex client
// Make sure to set the NEXT_PUBLIC_CONVEX_URL environment variable!
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Wrap the children with ConvexProvider
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}