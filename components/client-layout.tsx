"use client";

import React, { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // MiniKit hook needs to be in a client component *inside* the Provider
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  return <>{children}</>;
}
