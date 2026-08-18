"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { DepartmentProvider } from "@/context/department-context";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Root providers wrapper — wraps the entire application with:
 * - DepartmentProvider for unified multi-department management & switching
 * - TanStack Query for server state management
 * - Sonner for toast notifications
 */
import NextTopLoader from "nextjs-toploader";

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DepartmentProvider>
        <NextTopLoader
          color="#85261e"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #85261e,0 0 5px #85261e"
          zIndex={1600}
          showAtBottom={false}
        />
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            className: "font-sans",
          }}
        />
      </DepartmentProvider>
    </QueryClientProvider>
  );
}
