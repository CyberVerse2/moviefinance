'use client';

import React from 'react';

// This component simply renders its children.
// It will be dynamically imported with ssr: false.
export function ClientOnlyWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
