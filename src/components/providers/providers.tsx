'use client';
import { SessionProvider } from './session-Provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create the QueryClient only once per client
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5 // Data is fresh for 5 minutes
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider initialSession={null}>{children}</SessionProvider>
    </QueryClientProvider>
  );
}
