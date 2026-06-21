"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useRealtimeUpdates from "../hooks/useRealtimeUpdates";

function RealtimeUpdates() {
  useRealtimeUpdates();
  return null;
}

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeUpdates />
      {children}
    </QueryClientProvider>
  );
}
