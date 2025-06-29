'use client';
import React, { useState } from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider } from '../providers/session-Provider';
import { AuthResponse } from 'types/response';
import { NeighborhoodsStoreProvider } from '@/hooks/store/useNeighborhoodsStore';
import { PersonsStoreProvider } from '@/hooks/store/usePersonsStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { MembersStoreProvider } from '@/hooks/store/useMembersStore';
export default function Providers({
  session,
  children
}: {
  session: AuthResponse | null;
  children: React.ReactNode;
}) {
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
      <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
        <NeighborhoodsStoreProvider>
          <PersonsStoreProvider>
            {/* <MembersStoreProvider> */}
            <SessionProvider initialSession={session}>
              {children}
            </SessionProvider>
            {/* </MembersStoreProvider> */}
          </PersonsStoreProvider>
        </NeighborhoodsStoreProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
